var { NAVIGATE_FORWARD } = require('../utils/ActionTypes');
var Dispatcher = require('../utils/Dispatcher');
var StoreCreator = require('../utils/StoreCreator');
var { STEPS } = require('../utils/Util');

var orderedSteps = [STEPS.HOME, STEPS.NUM_PEOPLE];
var step = orderedSteps[0];

var ApplicationStore = StoreCreator.create({
    getStep() {
        return step;
    }
});

ApplicationStore.dispatchToken = Dispatcher.register(({ action: { type } }) => {
    switch(type) {
        case NAVIGATE_FORWARD:
            step = orderedSteps[orderedSteps.indexOf(step) + 1];
            break;
    }

    ApplicationStore.emitChange();
});

module.exports = ApplicationStore;
