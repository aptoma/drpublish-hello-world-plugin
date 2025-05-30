export class API {
    /*
        Contains the root backend URL fetched from init() receiving the publication
        config object for the plugin. This allows you to e.g. set the account name
        individually per publication or have multiple instances of the same plugin
        connected to different accounts without having to embed account information
        in the plugin code.
    */
    static rootUrl;

    /*
        Helper function that just turns a Map into additional query parameters 
        regardless of what the rootUrl already contains.
    */
    static createSearchUrl(searchMap) {
        const url = new URL(this.rootUrl);
        const searchParams = new URLSearchParams(url.search);
        searchMap.forEach((key, value) => searchParams.set(key, value));
        url.search = searchParams.toString();
        return url.href;
    }

    /*
        Helper function for fetch()-ing JSON
    */
    static async sendFetch(path, data) {
        const parameters = [path];
        if (data) {
            parameters.push({
                method: 'POST',
                body: JSON.stringify(data)
            }); 
        }

        let response = await fetch(...parameters);
        let json = await response.json()
            .catch(() => {
                throw new Error('Unable to process response from server <br/>' + response.status + ': ' + response.statusText);
            });

        if (response.ok) {
            return json;
        }

        throw new Error(json?.message);
    }

    static init(config) {
        if (typeof config?.config?.rootUrl !== 'string') {
            throw 'Missing or invalid plugin config "rootUrl", add configUrl to the absolute URL of config.json in Admin->Publication->Plugins and add the URL in Admin->Plugins';
        }
        this.rootUrl = config.config.rootUrl;
    }
}
