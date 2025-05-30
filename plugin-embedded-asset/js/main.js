import { PluginAPI } from 'https://bootstrap.drpublish.aptoma.no/js/shared/PluginAPI/PluginAPI-5.0.js';

/*
    When the user clicks an inline placeholder that belongs to this plugin
    - Store the ID of the selected plugin in body[data-current-asset]
    - Get the asset data and put the values into form elements
*/
const embeddedAssetFocus = async (asset) => {
    document.body.dataset.currentAsset = asset.id;

    const id = asset.id.replace('asset-', '');
    const assetData = await PluginAPI.getAssetData(id);

    Object.entries(assetData.options).forEach(([key, value]) => {
        const element = document.querySelector(`[data-name="${key}"]`);
        if (element) {
            element.value = value;
        }
    });
};

/*
    When the user changes focus away from a placeholder that belongs to this plugin
    - Remove the value from body[data-current-asset]
*/
PluginAPI.on('embeddedAssetBlur', () => {
    delete document.body.dataset.currentAsset;
});

// Serializes the form into a {key: value} object to be used as embedded asset payload
const getData = () => {
    return Array.from(document.querySelectorAll('input, textarea')).reduce((carry, item) => {
        carry[item.dataset.name] = item.value;
        return carry;
    }, {});
};

// Contains all button onclick functions, uses the button[data-action] value
const actions = {
    insert: async () => {
        const data = getData();

        // Create an inline placeholder for the DrPublish, this shouldn't contain any scripts, iframes, css or external references, it's just a simple preview
        const markup = Object.entries(data).reduce((carry, [key, value]) => {
            return carry + `<p>${key}: ${value}</p>`;
        }, '<div>') + '</div>';

        const id = await PluginAPI.createEmbeddedObject();
        await PluginAPI.editorInsertElement(id, markup);
        await PluginAPI.addEmbeddedAsset(id, data);
    },
    update: async () => {
        const data = getData();
        await PluginAPI.updateEmbeddedAsset(document.body.dataset.currentAsset, data);
    },
    delete: () => {
        PluginAPI.Editor.deleteElementById(document.body.dataset.currentAsset);
    }
};

document.querySelectorAll('button').forEach((e) => e.onclick = actions[e.dataset.action]);

PluginAPI.setPluginName('plugin-embedded-assets-example');

PluginAPI.on('embeddedAssetFocus', embeddedAssetFocus);
