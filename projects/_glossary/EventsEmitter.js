export default class EventsEmitter extends EventTarget {
    emit (eventName, detail = {}) {
        if (eventName instanceof Event)
            eventName = eventName.type
        this.dispatchEvent(new CustomEvent(eventName, {detail}));
    }

    on (eventName, callback) {
        this.addEventListener(eventName, callback);
    }

    off (eventName, callback) {
        this.removeEventListener(eventName, callback);
    }
}