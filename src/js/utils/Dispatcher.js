var _ = require('lodash');
var Dispatcher = require('flux').Dispatcher;

module.exports = _.extend(new Dispatcher(), {
    handleServerAction: function(action) {
        this.dispatch({
            source: 'SERVER_ACTION',
            action: action
        });
    },

    handleViewAction: function(action) {
        this.dispatch({
            source: 'VIEW_ACTION',
            action: action
        });
    }
});;
