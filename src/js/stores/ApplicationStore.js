var { GET_STARTED } = require('../utils/ActionTypes');
var Dispatcher = require('../utils/Dispatcher');
var StoreCreator = require('../utils/StoreCreator');
var { STEPS } = require('../utils/Util');

var step = STEPS.HOME;

var ApplicationStore = StoreCreator.create({
    getStep() {
        return step;
    }
});

ApplicationStore.dispatchToken = Dispatcher.register(({ action: { type } }) => {
    switch(type) {
        case GET_STARTED:
            step = STEPS.NUM_PEOPLE;
            break;
    }

    ApplicationStore.emitChange();
});

module.exports = ApplicationStore;
