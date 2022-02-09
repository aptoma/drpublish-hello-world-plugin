/*
    The browser support for DrPublish is the two most recent major versions of Firefox and Chrome.
    Feel free to use new and shiny features without having to support older browsers.
*/
import { PluginAPI } from 'https://broadcast.drpublish.aptoma.no/js/shared/PluginAPI/PluginAPI-5.0.js';

/*
    The plugin needs a name in order to send and receive messages from DrPublish
    The name has to match the configured plugin name in publication settings
*/
PluginAPI.setPluginName('example');

/*
    The config includes some metadata and the config object itself.
    The config object is defined by supplying URL to a schema in the publication
        settings where plugins are configured
    PluginAPI 5 uses async/returns promises and throws exceptions on errors
*/
const config = await PluginAPI.getConfiguration();

/*
    The code above this comment should ususally be used verbatim (without the comments)
    The code below this comment is purely an example of how it can be used and you're free
        to model any way you like
*/

class Example {
    static async run(pluginApiFunction, clickEvent, ...parameters) {
        const result = await pluginApiFunction(...parameters);

        /*
            Finding the .target element that belongs to the button
            Setting the content of that as the result from the PluginAPI call
        */
        const resultTarget = clickEvent.target.closest('section')?.querySelector('.target');
        if (!resultTarget) {
            return;
        }

        resultTarget.innerHTML = JSON.stringify(result);

        /*
            Emptying the target container after 10 seconds
            Storing the timeout ID on the target element
        */
        clearTimeout(resultTarget.timeout);
        resultTarget.timeout = setTimeout(() => {resultTarget.innerHTML = ''}, 10000);
    }

    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static formatDrLibQuery(clickEvent) {
        const inputElement = clickEvent.target.closest('section')?.querySelector('.input');
        
        return `${inputElement.dataset.query}${inputElement.value}`;
    }
}

// Adding onclick listeners to buttons in the DOM
class Actions {
    static getId(clickEvent) {
        Example.run(PluginAPI.Article.getId, clickEvent);
    }

    static getTags(clickEvent) {
        Example.run(PluginAPI.Article.getTags, clickEvent); 
    }

    static async getEditorType(clickEvent) {
        await Example.sleep(3000);
        Example.run(PluginAPI.Editor.getEditorType, clickEvent);
    }

    static getContent(clickEvent) {
        Example.run(PluginAPI.Article.getCurrentContent, clickEvent);
    }

    static searchDrlib(clickEvent) {
        Example.run(PluginAPI.searchDrLib, clickEvent, Example.formatDrLibQuery(clickEvent));
    }
    
    static searchDrlibTags(clickEvent) {
        Example.run(PluginAPI.searchDrLib, clickEvent, Example.formatDrLibQuery(clickEvent));
    }
};
Array.from(globalThis.document.querySelectorAll('button')).forEach(button => {
    button.onclick = Actions[button.dataset?.action];
});
