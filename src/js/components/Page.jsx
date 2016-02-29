var _ = require('lodash');
var React = require('react');
var AssistanceProgram = require('./AssistanceProgram.jsx');
var Homepage = require('./Homepage.jsx');
var NavBar = require('./NavBar.jsx');
var ReviewSubmit = require('./ReviewSubmit.jsx');
var ApplicantInfoContent = require('./applicant-info/Content.jsx');
var IncomeInfoContent = require('./income-info/Content.jsx');
var NumPeopleContent = require('./num-people/Content.jsx');
var ApplicationStore = require('../stores/ApplicationStore');
var { STEPS } = require('../utils/Util');

function getStateFromStore(){
    return { step: ApplicationStore.getStep() };
}

module.exports = React.createClass({
    displayName: 'Page',

    getInitialState() {
        return getStateFromStore();
    },

    componentDidMount(){
        ApplicationStore.addChangeListener(this._onStoreChange);
    },

    componentWillUnmount(){
        ApplicationStore.removeChangeListener(this._onStoreChange);
    },

    render() {
        return _.contains([STEPS.HOME, STEPS.FORM_SUBMITTED], this.state.step) ? this._getContent() : (
            <div>
                <NavBar />
                { this._getContent() }
            </div>
        );
    },

    _getContent() {
        switch(this.state.step) {
            case STEPS.APPLICANT_INFO:
                return <ApplicantInfoContent />;
            case STEPS.ASSISTANCE_PROGRAM:
                return <AssistanceProgram />;
            case STEPS.FORM_SUBMITTED:
                return <div>Form was successfully submitted. Your application ID is: { ApplicationStore.getApplicationId() }</div>;
            case STEPS.HOME:
                return <Homepage />;
            case STEPS.INCOME_INFO:
                return <IncomeInfoContent />;
            case STEPS.NUM_PEOPLE:
                return <NumPeopleContent />;
            case STEPS.REVIEW_SUBMIT:
                return <ReviewSubmit />;
        }
    },

    _onStoreChange(){
        this.setState(getStateFromStore());
    }
});
