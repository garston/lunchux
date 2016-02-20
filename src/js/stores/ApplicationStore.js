var _ = require('lodash');
var { NAVIGATE_FORWARD, NAVIGATE_TO } = require('../utils/ActionTypes');
var Dispatcher = require('../utils/Dispatcher');
var StoreCreator = require('../utils/StoreCreator');
var { STEPS } = require('../utils/Util');

var formData = {};
var orderedSteps = [STEPS.HOME, STEPS.NUM_PEOPLE, STEPS.APPLICANT_INFO, STEPS.ASSISTANCE_PROGRAM, STEPS.FORM_SUBMITTED];
var step = orderedSteps[0];
var visitedSteps = [];

var ApplicationStore = StoreCreator.create({
    getFormData() {
        return _.cloneDeep(formData);
    },
    getStep() {
        return step;
    },
    getVisitedSteps() {
        return _.clone(visitedSteps);
    }
});

ApplicationStore.dispatchToken = Dispatcher.register(({ action }) => {
    switch(action.type) {
        case NAVIGATE_FORWARD:
            _.merge(formData, action.formData);
            console.log('ApplicationStore', action.formData, formData);
            step = orderedSteps[orderedSteps.indexOf(step) + 1];
            visitedSteps.push(step);
            break;
        case NAVIGATE_TO:
            step = action.step;
            visitedSteps = _.slice(visitedSteps, 0, _.indexOf(visitedSteps, step) + 1);
            break;
    }

    ApplicationStore.emitChange();
});

module.exports = ApplicationStore;
