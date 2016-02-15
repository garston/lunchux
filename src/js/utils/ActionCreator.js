var { NAVIGATE_FORWARD } = require('./ActionTypes');
var Dispatcher = require('./Dispatcher');

module.exports = {
    navigateForward(formData) {
        Dispatcher.handleViewAction({ type: NAVIGATE_FORWARD, formData });
    }
};
