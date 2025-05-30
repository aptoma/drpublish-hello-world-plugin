import { PluginAPI } from 'https://broadcast.drpublish.aptoma.no/js/shared/PluginAPI/PluginAPI-5.0.js';

const pluginName = 'plugin-hidden-example';
PluginAPI.setPluginName(pluginName);

const insert = (text) => {
    PluginAPI.Editor.insertString(`<p>${text}</p>`);
};

PluginAPI.on('insert', insert);
