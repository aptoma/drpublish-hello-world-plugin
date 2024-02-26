class AI
{
    static mutex = false;

    static async analyze(data)
    {
        if (this.mutex) {
            return;
        }
        this.mutex = true;

        const sentences = data.text.split('\n');
        const title = sentences.shift();

        // The longer execution takes, the more powerful the magic appears
        await this.sleep();

        this.mutex = false;
        return {
            titles: [
                // Creating fake titles by moving around the letters of the current title
                title.split(/\b/).map(word => word.split('').reverse().join('')).join(''),
                title.split(/\b/).reverse().join(''),
                title.split('').reverse().join('')
            ].sort(() => Math.random() - 0.5),
            descriptions: [
                'This appears to be a news article of some sort...',
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
            ],
            tables: [
                '<table class="table"><thead><tr><th>User</th><th>Score</th></tr></thead><tbody><tr><td>Humans</td><td>0</td></tr><tr><td>AI</td><td>1</td></tr></tbody></table>',
                '<table class="table"><thead><tr><th>User</th><th>Score</th></tr></thead><tbody><tr><td>Humans</td><td>1</td></tr><tr><td>AI</td><td>0</td></tr></tbody></table>'
            ],
            input: data.text
        };
    }

    static async sleep()
    {
        return new Promise(resolve => {
            setTimeout(resolve, 2000);
        });
    }
}

export default AI;
