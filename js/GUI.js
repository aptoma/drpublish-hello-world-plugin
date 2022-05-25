import { DrPublish } from './DrPublish.js';
import { API } from './API.js';

/*
    This is just a quickly thrown together interface using some Bootstrap parts and nothing
        integral to the plugin logic itself. The same goes for index.html and the markup there.
*/
export class GUI {
    static previewWidth = 640;
    static previewHeight = 360;
    static editorIsXml = false;

    /*
        Quick access to a few DOM elements.
    */
    static elements = {
        results: document.querySelector('#accordion'),
        form: document.querySelector('#form'),
        search: document.querySelector('#search'),
        maximized: document.querySelector('section.maximized'),
        accordionItemTemplate: document.querySelector('template.accordion-item').content.firstElementChild,
        preview: document.querySelector('#preview')
    }

    /*
        Bound to the click event of the search button, will create a Map with name->value from all input elements
            in the search "form". There's just one such field in this example, but you can imagine other input
            fields for e.g. tag search or other relevant fields.
    */
    static async search() {
        this.elements.results.innerHTML = '';
        this.elements.results.classList.add('loading');
        
        const searchFields = Array.from(this.elements.search.querySelectorAll('input')).reduce((carry, item) => carry.set(item.dataset.name, item.value), new Map());
        this.addResults(await API.sendFetch(API.createSearchUrl(searchFields)));
    }

    /*
        Adds accordion-items based on the <template> in index.html, adds data to visible fields in the data item
            and adds event listeners.
    */
    static addResults(results) {
        // Shuffling results around so they appear dynamic
        results?.items?.sort(() => Math.random() - 0.5);

        this.elements.results.classList.remove('loading');

        results?.items?.forEach(options => {
            const element = this.elements.accordionItemTemplate.cloneNode(true);
            element.options = options;
            element.querySelector('button.edit').onclick = function(e) {this.edit(e.target.closest('.accordion-item').options)}.bind(this);
            element.querySelector('button.edit').toggleAttribute('disabled', !this.editorIsXml);

            for (const [key, value] of Object.entries(options)) {
                (element.querySelector(`.${key}`) ?? {}).innerHTML = value.replace(/(?:\n)/g, '<br/>');
            }

            this.elements.results.appendChild(element);
        });
    }

    static setPreview(embed) {
        if (!embed) {
            this.elements.preview.innerHTML = '';
            return;
        }

        const sandbox = document.createElement('iframe');
        sandbox.setAttribute('sandbox', 'allow-same-origin');
        sandbox.style.display = 'none';
        document.body.appendChild(sandbox);
        sandbox.contentDocument.body.innerHTML = embed;

        let payload = sandbox.contentDocument.body.firstElementChild;
        if (payload.nodeName === 'IFRAME') {
            payload.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-presentation');
            this.elements.preview.innerHTML = payload.outerHTML;
        } else {
            this.elements.preview.innerHTML = '<iframe sandbox="allow-same-origin allow-scripts allow-presentation" class="wrapper"></iframe>';
            this.elements.preview.firstElementChild.contentDocument.body.innerHTML = payload.outerHTML;
        }
        this.elements.preview.firstElementChild.width = this.previewWidth;
        this.elements.preview.firstElementChild.height = this.previewHeight;
        
        document.body.removeChild(sandbox);
    }

    /*
        Disable the buttons if the currently selected article field isn't an XML field that can accept plugin elements.
    */
    static setEditorIsXml(editorIsXml) {
        this.editorIsXml = editorIsXml;
        Array.from(this.elements.results.querySelectorAll('button.edit')).forEach(element => element.toggleAttribute('disabled', !editorIsXml));
    }

    static async edit(options) {
        this.elements.maximized.options = options;
        this.elements.maximized.classList.toggle('insert', !(typeof options.assetid === 'string'));

        Array.from(this.elements.form.querySelectorAll('input, textarea')).forEach(element => element.value = '');
        for (const [key, value] of Object.entries(options)) {
            (this.elements.form.querySelector(`[data-name="${key}"]`) ?? {}).value = value;
        }

        this.setPreview(options?.embed);
        DrPublish.maximize();
    }

    /*
        Either inserts or updates depending on if the currently previewed item is an already
            inserted element or not. For inserted elements there's an "assetid" value set.
    */
    static async insert() {
        const options = this.elements.maximized.options;
        Array.from(this.elements.form.querySelectorAll('input, textarea')).forEach(element => options[element.dataset.name] = element.value);
        
        if (options.assetid) {
            const assetid = options.assetid;
            delete options.assetid;
            await DrPublish.update(assetid, options);
        } else {
            await DrPublish.insert(options);
        }

        DrPublish.minimize();
    }

    /*
        The placeholder markup embedded in the article should generally be as simple as possible,
        preferably just a text and an image. The content embed code itself shouldn't be used
        as DrPublish will potentially rewrite the markup on save. Do not include any scripting
        logic in the editor markup.
    */
    static getPlaceholderMarkup(options = {}, fallbackString) {
        return `<p>${options.title ?? fallbackString}</p>`;
   }

    // Helper function to make Bootstrap accordion behave with simpler markup 
    static toggleAccordion(e) {
        if (!e.target.classList.contains('accordion-button')) {
            return;
        }
        const item = e.target.closest('.accordion-item').querySelector('.accordion-collapse');

        Array.from(this.elements.results.querySelectorAll('.accordion-button')).forEach(element => {
            if (element === e.target) {
                element.classList.toggle('collapsed');
            } else {
                element.classList.add('collapsed');
            }
        });

        Array.from(this.elements.results.querySelectorAll('.accordion-collapse')).forEach(element => {
            if (element === item) {
                element.classList.toggle('show');
            } else {
                element.classList.remove('show');
            }
        });
    }

    static init() {
        Array.from(document.querySelectorAll('button')).forEach(button => button.onclick = this[button.dataset.action].bind(this));
        this.elements.results.onclick = this.toggleAccordion.bind(this);
        API.init(DrPublish.config);
    }
}
