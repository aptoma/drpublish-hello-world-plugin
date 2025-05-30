# Hidden plugin inserting text

A plugin like this can be called by a toolbar button using the following configuration:

```
{action: ToolbarHelpers.actions.editor(function() {
    Controller.AppEvents.directEvent('plugin-hidden-example', 'insert', 'The inserted text');
}), label: 'Insert text', icon: 'css/budicon/svg/com-megaphone.svg'},
```

See here for list of availble icons:
https://broadcast.drpublish.aptoma.no/css/budicon/svg/cheatsheet.html