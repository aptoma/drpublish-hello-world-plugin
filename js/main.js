import Timer from './Timer.js';
import DrPublishCommunicator from './DrPublishCommunicator.js';
import AI from './AI.js';
import GUI from './GUI.js';

DrPublishCommunicator.init('ai-demo');
DrPublishCommunicator.setFocusFunction(GUI.focus.bind(GUI));

GUI.setReadFunction(DrPublishCommunicator.getArticleData);
GUI.setInsertFunction(DrPublishCommunicator.insert.bind(DrPublishCommunicator));
GUI.setAIFunction(AI.analyze.bind(AI));

const execute = async () => {
    // Don't automatically run AI.execute while the plugin is in focus
    if (DrPublishCommunicator.focus) {
        return;
    }

    const data = await AI.analyze(await DrPublishCommunicator.getArticleData());
    if (!data) {
        return;
    }
    DrPublishCommunicator.notifiyIfNoFocus('AI alternatives available');
    GUI.updateSuggestions(data);
};

const timer = new Timer(execute);
DrPublishCommunicator.articleModificationEvent(timer.event.bind(timer));
