/**
 * Object that triggers a callback once no event has been received for X seconds, with a max delay of y seconds
 * Basically it doesn't trigger until the author has stopped typing
 */
class Timer
{
    callback;
    timer;

    minTimeSinceLastEvent = 10;
    timeLastEvent;

    timeLastTrigger;
    maxTimeSinceLastTrigger = 180;

    constructor(callback, minTimeSinceLastEvent = 10, maxTimeSinceLastTrigger = 180)
    {
        this.callback = callback;
        this.minTimeSinceLastEvent = minTimeSinceLastEvent;
        this.maxTimeSinceLastTrigger = maxTimeSinceLastTrigger;
    }

    event()
    {
        this.timeLastEvent = new Date();

        if (this.timeLastTrigger && this.timeLastTrigger.getTime() < (this.timeLastEvent.getTime() - (this.maxTimeSinceLastTrigger * 1000))) {
            return;
        }

        clearTimeout(this.timer);
        this.timer = setTimeout(this.trigger.bind(this), this.minTimeSinceLastEvent * 1000);
    }

    trigger()
    {
        this.timeLastTrigger = new Date();
        this.callback();
    }
}

export default Timer;
