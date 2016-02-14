const { GET_STARTED } = require('../utils/ActionTypes');
const Dispatcher = require('../utils/Dispatcher');
const StoreCreator = require('../utils/StoreCreator');
const { STEPS } = require('../utils/Util');

var step = STEPS.HOME;

const ApplicationStore = StoreCreator.create({
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
