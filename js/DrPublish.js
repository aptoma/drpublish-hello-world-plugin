/*
    Change the account name here from "broadcast" to whichever account is relevant
        for your plugin.
*/
import { PluginAPI } from 'https://broadcast.drpublish.aptoma.no/js/shared/PluginAPI/PluginAPI-5.0.js';
import { GUI } from './GUI.js';

/*
    This file contains all communication with the DrPublish editor
        using the PluginAPI
*/
export class DrPublish {
    static config = {};
    static pluginName = '';

    /*
        Creates an "embedded object", the relevant DrPublish object for containing custom data.
        Then inserts the object into the article with an editor element (html placeholder).
        Then adds your data object as an "embedded asset" to the "embedded object".
            The naming and process is of historic reasons and will generally follow the same sequence.
    */
    static async insert(options) {
        const id = await PluginAPI.createEmbeddedObject();
        await PluginAPI.editorInsertElement(id, this.getPlaceholderMarkup(options));
        await PluginAPI.addEmbeddedAsset(id, options);
    }

    /*
        Updates an existing "embedded asset" with a new data object
    */
    static async update(assetid, options) {
        await PluginAPI.editorElementSetByid(assetid, this.getPlaceholderMarkup(options));
        await PluginAPI.updateEmbeddedAsset(assetid.replace(/^asset-/, ''), options);
    }

    /*
        Fetches the "embedded asset" data object and sends it to be displayed in a form.
        This method is bound to the "Edit" context menu when right clicking an already embedded element.
    */
    static async edit([id]) {
        const {options} = await PluginAPI.getAssetData(id.replace(/^asset-/, ''));
        GUI.edit({...options, assetid: id});
    }

    /*
        Maximizes the plugin going from ~400px to almost the full size of the browser window.
    */
    static async maximize() {
        return PluginAPI.editorPaneMaximize('Embed edit');
    }
    
    /*
        Restores the plugin from maximized mode to regular ~400 px mode right of the editor
    */
    static async minimize() {
        await PluginAPI.restoreAppWindow();
    }

    /*
        Metod called by the "pluginWindowRestored" event, this clears the content of the now hidden
            preview in case the user has started playback so a hidden object doesn't e.g. play sound.
    */
    static async minimized() {
        GUI.setPreview();
    }

    /*
        Editor elements can only be added to fields of the "xml" that accepts XHTML.
        The most common alternatives are pure text fields for e.g. article title.
    */
    static async isEditorTypeXml() {
        const editorType = await PluginAPI.getEditorType();
        return editorType === 'xml';
    }

    /*
        Event issued every time a user switches field in the editor, used to activate/deactivate the
            insert buttons depending on the type of the currently selected field.
    */
    static async editorFocus() {
        GUI.setEditorIsXml(await this.isEditorTypeXml());
    }
   
    static getPlaceholderMarkup(options = {}) {
        return GUI.getPlaceholderMarkup(options, `${this.pluginName.charAt(0).toUpperCase() + this.pluginName.slice(1)} embed`);
    }

    /*
        PluginAPI.setPluginName() has to be the initial call to the PluginAPI in order for it to be able
            to communicate with DrPublish, and the name used must match that used when adding the plugin
            to the publication.
        The config values are defined in the config.json file which is added to the publication plugin config.
        registerMenuAction and editorInitializeMenu basically does the same, but the first adds a custom button
            and the standard buttons like "delete";
        The "on" methods adds event listeners, as does the "on-api-event" call.
    */
    static async init(pluginName) {
        this.pluginName = pluginName;
        PluginAPI.setPluginName(pluginName);
        this.config = await PluginAPI.getConfiguration();

        await PluginAPI.registerMenuAction('Edit', this.edit.bind(this), 'gfx/icons/iconic/vector/svggen.php?file=pen&fill=%231d4e6f');
        await PluginAPI.editorInitializeMenu('deleteButton');
        await PluginAPI.on('pluginWindowRestored', this.minimized.bind(this));
        await PluginAPI.on('editorFocus', this.editorFocus.bind(this));
        await PluginAPI.request('on-api-event', {name: 'editorFocus'});

        GUI.init();
        await this.editorFocus();
    }
}
