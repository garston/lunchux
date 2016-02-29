var _ = require('lodash');
var { APPLICATION_SUBMITTED, NAVIGATE_FORWARD, NAVIGATE_TO } = require('../utils/ActionTypes');
var Dispatcher = require('../utils/Dispatcher');
var StoreCreator = require('../utils/StoreCreator');
var { STEPS } = require('../utils/Util');

var applicationId;
var formData = {};
var visitedSteps = [STEPS.HOME];

var getCurrentStep = () => _.last(visitedSteps);
var moveToNextStep = () => {
    switch(getCurrentStep()) {
        case STEPS.HOME:
            return STEPS.NUM_PEOPLE;
        case STEPS.NUM_PEOPLE:
            return STEPS.APPLICANT_INFO;
        case STEPS.APPLICANT_INFO:
            if(formData.areAdultsInAssistanceProgram) {
                formData = _.omit(formData, ['adultInfos', 'applicantIncomeInfos']);
                return STEPS.ASSISTANCE_PROGRAM;
            }else if(_.every(formData.applicantInfos, info => info.fosterChild)) {
                formData = _.omit(formData, ['adultInfos', 'applicantIncomeInfos', 'assistanceProgram', 'assistanceProgramNumber']);
                return STEPS.REVIEW_SUBMIT;
            }
            formData = _.omit(formData, ['assistanceProgram', 'assistanceProgramNumber']);
            return STEPS.INCOME_INFO;
        case STEPS.ASSISTANCE_PROGRAM:
        case STEPS.INCOME_INFO:
            return STEPS.REVIEW_SUBMIT;
    }
};

var ApplicationStore = StoreCreator.create({
    getApplicationId() {
        return applicationId;
    },
    getFormData() {
        return _.cloneDeep(formData);
    },
    getStep() {
        return getCurrentStep();
    },
    getVisitedSteps() {
        return _.clone(visitedSteps);
    }
});

ApplicationStore.dispatchToken = Dispatcher.register(({ action }) => {
    switch(action.type) {
        case APPLICATION_SUBMITTED:
            applicationId = action.applicationId;
            visitedSteps.push(STEPS.FORM_SUBMITTED);
            break;
        case NAVIGATE_FORWARD:
            _.assign(formData, action.formData);
            visitedSteps.push(moveToNextStep());
            break;
        case NAVIGATE_TO:
            visitedSteps = _.slice(visitedSteps, 0, _.indexOf(visitedSteps, action.step) + 1);
            break;
    }

    ApplicationStore.emitChange();
});

module.exports = ApplicationStore;
