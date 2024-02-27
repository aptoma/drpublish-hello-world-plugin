import {PluginAPI} from 'PluginAPI';

class DrPublishCommunicator
{
    static focus = false;
    static config;
    static lastInsertDate;
    static insertModificationGraceDelay = 10;
    static tablesPluginAddress = ['tables', 'create'];
    static tablesPluginReady = false;

    static async init(pluginName)
    {
        PluginAPI.setPluginName(pluginName);
        this.config = await PluginAPI.getConfiguration();

        PluginAPI.awaitExtendedApi(...this.tablesPluginAddress).then(() => {
            this.tablesPluginReady = true;
        });
    }

    static setFocusFunction(f)
    {
        PluginAPI.on('receivedFocus', () => {
            this.focus = true;
            f();
        });
        PluginAPI.on('lostFocus', () => this.focus = false);
        PluginAPI.on('notificationClicked', () => PluginAPI.giveFocus(PluginAPI.getPluginName()));
    }

    static async getArticleData()
    {
        /*
            Request all article {fields=>markup} content
            Let the browser render the markup in a documentFragment
            Remove all root level <div> elements as they contain plugin elements like images
            Add a newline after each common block element
            Append the remaining (if any) text content to the reduce carry
        */
        return {text: Object.entries(await PluginAPI.Article.getCurrentContent()).reduce((carry, item) => {
            const content = document.createDocumentFragment().appendChild(document.createElement('content'));
            content.innerHTML = item[1];
            Array.from(content.querySelectorAll(':scope > div')).map(element => element.parentElement.removeChild(element));
            Array.from(content.querySelectorAll('p,div,h1,h2,h3,h4,h5,h6,BLOCKQUOTE')).forEach(blockElement => blockElement.appendChild(document.createTextNode('\n')));
            const text = content.innerText.replace(/\n\s+\n/, '\n').replace(/[\n]{2,}/, '\n').trim();
            if (text.length) {
                carry += text + '\n';
            }
            return carry;
        }, '').trim()};
    }

    /*
        Receives "modifiedContent" events from DrPublish, but ignores events directly after content has been inserted
    */
    static async articleModificationEvent(fn)
    {
        PluginAPI.on('modifiedContent', () => {
            if (this.lastInsertDate && this.lastInsertDate.getTime() > (new Date).getTime() - (this.insertModificationGraceDelay * 1000)) {
                return;
            }
            fn();
        }); 
    }

    static async notifiyIfNoFocus(message)
    {
        if (this.focus) {
            return;
        }
        PluginAPI.showInfoMsg(message);
    }

    static async insert(data, type = 'text')
    {
        const allowedTypes = {
            'text': ['text', 'xml'],
            'table': ['xml']
        };

        if (!Object.keys(allowedTypes).includes(type)) {
            return;
        }

        const editorType = await PluginAPI.Editor.getEditorType();
        if (!allowedTypes[type].includes(editorType)) {
            return;
        }

        if (type === 'table' && !this.tablesPluginReady) {
            return;
        }

        this.lastInsertDate = new Date();
        if (type === 'table') {
            return await PluginAPI.callExtendedApi(...this.tablesPluginAddress, {html: data});
        }
        if (editorType === 'xml') {
            data = `<p>${data}</p>`;
        }

        return await PluginAPI.Editor.insertString(data, true);
    }
}

export default DrPublishCommunicator;
