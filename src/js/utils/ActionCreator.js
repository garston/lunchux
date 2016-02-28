var $ = require('jquery');
var _ = require('lodash');
var { APPLICATION_SUBMITTED, NAVIGATE_FORWARD, NAVIGATE_TO } = require('./ActionTypes');
var Dispatcher = require('./Dispatcher');
var ApplicationStore = require('../stores/ApplicationStore');

module.exports = {
    navigateForward(formData) {
        Dispatcher.handleViewAction({ type: NAVIGATE_FORWARD, formData });
    },

    navigateTo(step) {
        Dispatcher.handleViewAction({ type: NAVIGATE_TO, step });
    },

    submitApplication(submitFormData) {
        var applicationId = new Date().getTime();
        $.ajax('save', {
            contentType: 'application/json; charset=UTF-8',
            data: JSON.stringify({ applicationId, formData: _.assign(ApplicationStore.getFormData(), submitFormData) }),
            method: 'PUT'
        }).done(() => Dispatcher.handleServerAction({ type: APPLICATION_SUBMITTED, applicationId }));
    }
};
