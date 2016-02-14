const React = require('react');
const Homepage = require('./Homepage.jsx');
const ApplicationStore = require('../stores/ApplicationStore');
const ActionCreator = require('../utils/ActionCreator');
const { STEPS } = require('../utils/Util');

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
        switch(this.state.step) {
            case STEPS.HOME:
                return <Homepage onGetStartedClick={() => ActionCreator.getStarted()} />;
            case STEPS.NUM_PEOPLE:
                return <div>Num applicants</div>;
        }
    },

    onStoreChange(){
        this.setState(getStateFromStore());
    }
});
