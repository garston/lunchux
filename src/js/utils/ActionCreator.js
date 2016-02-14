var { GET_STARTED } = require('./ActionTypes');
var Dispatcher = require('./Dispatcher');

module.exports = {
    getStarted() {
        Dispatcher.handleViewAction({ type: GET_STARTED });
    }
};
