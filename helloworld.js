/**
 * global PluginAPI
 */
PluginAPI.on('afterCustomMetadataLoad', function() {
    console.log('stef: after metadata load');
});

function initPlugin() {
    // fetch article id after the article has been loaded
    console.log('plgn: plugin loaded after article load completed');
    fetchArticleIdDynamically();
    fetchJWT();
    PluginAPI.on('afterSave', function() {
        // afterArticleSave();
    });
    PluginAPI.on('afterLoad', function() {
        console.log('stef: after article load');
    });

}

function fetchJWT() {
    var jwt = PluginAPI.getJWT();
    console.log('stef: plgn jwt foo', jwt);
    $('#jwt-result').val(jwt);
}

function fetchArticleIdDynamically() {
    PluginAPI.Article.getId(function(id) {
        console.log('plgn: artid', id);
        $('#fetchArticleId-result').val(id);
    });
}

// insert HTML code into the active text editor, at cursor position
function insertHelloWorld() {
    PluginAPI.Editor.insertString('<h3>Hello World</h3>');
}

// fetch all content from all text editors
function readContent() {
    PluginAPI.Editor.getHTMLBySelector('*', function (data) {
        $('#readContent-result').val(data);
    });
}

// get article id
function getId() {
    var fu5 = function (id) {
        console.log('es5:', id);
        $('#getId-result').val(id);
    }

    let fu6 = (id) => {
        console.log('es6', id)
    };
    PluginAPI.Article.getId(fu5);
    PluginAPI.Article.getId(fu6);
}

// get article tags
function getTags() {
    PluginAPI.Article.getTags(function (tags) {
        $('#getTags-result').val(tags.length > 0 ? JSON.stringify(tags) : 'article has no tags');
    });
}


// get article tags
function getCategories() {
    PluginAPI.Article.getSelectedCategories(function (cats) {
        $('#getCategories-result').val(cats.length > 0 ? JSON.stringify(cats) : 'article has no categories');
    });
}



// get article metadata
function getCustomMeta() {
    PluginAPI.Article.getCustomMeta($('#getCustomMeta-input').val(), function (customMeta) {
        $('#getCustomMeta-result').val(JSON.stringify(customMeta));
    });
}


// set article metadata
function setCustomMeta() {
    console.log('stef: set custom meta', $('#setCustomMeta-value-input').val());
    PluginAPI.Article.setCustomMeta($('#setCustomMeta-name-input').val(), $('#setCustomMeta-value-input').val(), function (data) {
        $('#setCustomMeta-result').val(JSON.stringify(data));
    });

    // PluginAPI.Article.setCustomMeta('printProductsPageCategory', '["avis-1","avis-2","avis-3"]', function (data) {
    //     console.log(data);
    // });
}



// ----------------------------------------
document.addEventListener("DOMContentLoaded", function () {
    initPlugin();
});



