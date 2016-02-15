var _ = require('lodash');
var React = require('react');
var Homepage = require('./Homepage.jsx');
var NumPeopleContent = require('./num-people/Content.jsx');
var ApplicationStore = require('../stores/ApplicationStore');
var { STEPS } = require('../utils/Util');

var stepToContentMap = {};
stepToContentMap[STEPS.HOME] = <Homepage />;
stepToContentMap[STEPS.NUM_PEOPLE] = <NumPeopleContent />;
stepToContentMap[STEPS.FORM_SUBMITTED] = <div>Form was successfully submitted.</div>;

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
        var content = stepToContentMap[this.state.step];
        return _.contains([STEPS.HOME, STEPS.FORM_SUBMITTED], this.state.step) ? content : (
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
