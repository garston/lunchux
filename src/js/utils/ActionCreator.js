var { NAVIGATE_FORWARD } = require('./ActionTypes');
var Dispatcher = require('./Dispatcher');

module.exports = {
    navigateForward() {
        Dispatcher.handleViewAction({ type: NAVIGATE_FORWARD });
    }
};
