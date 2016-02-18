var _ = require('lodash');
var React = require('react');
var AssistanceProgram = require('./AssistanceProgram.jsx');
var Homepage = require('./Homepage.jsx');
var ApplicantInfoContent = require('./applicant-info/Content.jsx');
var NumPeopleContent = require('./num-people/Content.jsx');
var ApplicationStore = require('../stores/ApplicationStore');
var { STEPS } = require('../utils/Util');

function getStateFromStore(){
    return {
        formData: ApplicationStore.getFormData(),
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
            case STEPS.APPLICANT_INFO:
                content = <ApplicantInfoContent numApplicants={this.state.formData.numChildren} />;
                break;
            case STEPS.ASSISTANCE_PROGRAM:
                content = <AssistanceProgram />;
                break;
            case STEPS.FORM_SUBMITTED:
                content = <div>Form was successfully submitted.</div>;
                break;
            case STEPS.HOME:
                content = <Homepage />;
                break;
            case STEPS.NUM_PEOPLE:
                content = <NumPeopleContent />;
                break;
        }

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
