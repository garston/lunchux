var React = require('react');
var Homepage = require('./Homepage.jsx');
var NumPeopleSelection = require('./NumPeopleSelection.jsx');
var ApplicationStore = require('../stores/ApplicationStore');
var ActionCreator = require('../utils/ActionCreator');
var { STEPS } = require('../utils/Util');

function getStateFromStore(){
    return {
        step: ApplicationStore.getStep()
    };
}

module.exports = React.createClass({
    displayName: 'Page',

    getInitialState() {
        return getStateFromStore();
    },

    componentDidMount(){
        ApplicationStore.addChangeListener(this.onStoreChange);
    },

    componentWillUnmount(){
        ApplicationStore.removeChangeListener(this.onStoreChange);
    },

    render() {
        var content;
        switch(this.state.step) {
            case STEPS.HOME:
                return <Homepage onGetStartedClick={() => ActionCreator.navigateForward()} />;
            case STEPS.NUM_PEOPLE:
                content = <NumPeopleSelection />;
                break;
        }

        return (
            <div>
                <div>NAV BAR</div>
                { content }
            </div>
        );
    },

    onStoreChange(){
        this.setState(getStateFromStore());
    }
});
