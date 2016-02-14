const _ = require('lodash');
const EventEmitter = require('events').EventEmitter;

const CHANGE_EVENT = 'change';

const mixin = {
    emitChange() {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
};

module.exports = {
    mixin: mixin,
    create: function(spec) {
        return _.merge(spec, EventEmitter.prototype, mixin);
    }
};
