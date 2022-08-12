# drpublish-hello-world-plugin

Prerequisites
------------
- A server where you can install the plugin, must available from your web browser. Can be on localhost.
- [node.js](https://nodejs.org), [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) 

Installation
------------
- Install the plugin on a service mentioned above
- Run `npm install` from the plugin directory
- Register the plugin in DrPublish publication config, section `Plugins`
  - name: `helloworld`
  - title: `Demo plugin` or whatever you like
  - service address: pointing to where you have installed the plugin, e.g. `https://localhost/hello-world-plugin/index.html`

