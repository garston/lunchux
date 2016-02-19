var { NAVIGATE_FORWARD, NAVIGATE_TO } = require('./ActionTypes');
var Dispatcher = require('./Dispatcher');

module.exports = {
    navigateForward(formData) {
        Dispatcher.handleViewAction({ type: NAVIGATE_FORWARD, formData });
    },

    navigateTo(step) {
        Dispatcher.handleViewAction({ type: NAVIGATE_TO, step });
    }
};
