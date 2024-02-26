class GUI
{
    static initialized = false;
    static body = document.querySelector('body');
    static suggestions = document.querySelector('.suggestions');
    static input = document.querySelector('.input');
    static spinner = document.querySelector('template.spinner').content.firstElementChild

    static readFunction;
    static insertFunction;
    static data;

    static templates = {
        'titles': document.querySelector('template.title').content.firstElementChild,
        'descriptions': document.querySelector('template.description').content.firstElementChild,
        'tables': document.querySelector('template.table').content.firstElementChild
    };

    static setReadFunction(f)
    {
        this.readFunction = f;
        document.querySelector('.read').onclick = this.read.bind(this);
    }

    static setInsertFunction(f)
    {
        this.insertFunction = f;
    }

    static setAIFunction(f)
    {
        document.querySelector('.execute').onclick = async function(event) {
            this.clear();
            this.body.classList.add('analyzing');
            event.target.disabled = true;
            const data = this.data ?? {};
            data.text = this.input.innerText;
            this.updateSuggestions(await f(data));
            this.body.classList.remove('analyzing');
            event.target.disabled = false;
        }.bind(this);
    }

    static async read()
    {
        this.setInput((await this.readFunction()).text);
    }

    static focus()
    {
        if (!this.initialized) {
            this.initialized = true;
            this.read();
        }
    }

    static clear()
    {
        Array.from(document.querySelectorAll('.nav-item:not(:first-of-type)')).forEach(tab => tab.classList.add('hidden'));
        Array.from(document.querySelectorAll('.tab-pane:not(:first-of-type)')).forEach(pane => pane.innerHTML = '');
    }

    static setInput(text) {
        this.input.innerText = text;
        document.querySelector('button.execute').disabled = false;
    }

    static updateSuggestions(data)
    {
        this.clear();

        Object.entries(data).filter(item => ['titles', 'descriptions', 'tables'].includes(item[0])).forEach(item => {
            const pane = document.querySelector(`#${item[0]}`);
            document.querySelector(`#${item[0]}-tab`).parentElement.classList.remove('hidden');
            pane.innerHTML = '';

            item[1].forEach(suggestion => {
                const field = this.templates[item[0]].cloneNode(true);
                const id = 'input-' + Math.floor(Math.random(0, 10000) * 10000);
                field.querySelector('label')?.setAttribute('for', id);
                const input = field.querySelector('input,textarea,div.content');
                input.id = id;
                if (input.nodeName === 'DIV') {
                    input.innerHTML = suggestion;
                } else {
                    input.value = suggestion;
                }

                pane.appendChild(field);
            });
        });

        this.setInput(typeof data.input === 'string' ? data.input : '');
    }
}

Array.from(document.querySelectorAll('.tab-pane:not(:first-of-type)')).forEach(pane => pane.onclick = event => {
    if (event.target.nodeName !== 'BUTTON') {
        return;
    }

    const container = event.target.parentElement.querySelector('input,textarea,div.content');
    let data;
    if (container.nodeName === 'DIV') {
        data = [container.innerHTML, 'table'];
    } else {
        data = [container.value];
    }

    GUI.insertFunction(...data);
});

export default GUI;
