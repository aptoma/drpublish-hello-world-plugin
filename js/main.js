import { DrPublish } from './DrPublish.js';

try {
    DrPublish.init('example');
} catch (e) {
    console.error('Example plugin: ', e);
}