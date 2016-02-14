const { GET_STARTED } = require('./ActionTypes');
const Dispatcher = require('./Dispatcher');

module.exports = {
    getStarted() {
        Dispatcher.handleViewAction({ type: GET_STARTED });
    }
};
