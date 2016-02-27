var _ = require('lodash');
var React = require('react');
var { Button } = require('react-mdl');
var ApplicantInfoCard = require('./Card.jsx');
var ApplicationStore = require('../../stores/ApplicationStore');
var { navigateForward } = require('../../utils/ActionCreator');

module.exports = React.createClass({
    displayName: 'ApplicantInfoContent',

    getInitialState() {
        var applicantInfos = ApplicationStore.getFormData().applicantInfos || [];
        return {
            areApplicantsValid: this._mapEachApplicant(index => !!applicantInfos[index])
        };
    },

    render() {
        var applicantInfoCards = this._mapEachApplicant(index => {
            return <ApplicantInfoCard
                applicantIndex={ index }
                key={ 'applicantInfoCard' + index }
                onRequiredFieldChange={ isValid => this.setState({
                    areApplicantsValid: this.state.areApplicantsValid.map((currentValue, updateIndex) => index === updateIndex ? isValid : currentValue)
                })}
                ref={ 'applicantInfoCard' + index }
            />;
        });

        return (
            <div className="applicant-info-content">
                <div className="selectionHeader container">
                    <h2>Applicant Information</h2>
                    <p>Please fill out the information below for each applicant. Reminder that an applicant in anyone in your household who is 18 and under wither they attend school
                        or not and anyone who is in 12th grade or below and but over 18</p>
                </div>
                { applicantInfoCards }
                <div className="bottomNav container">
                    <Button className="buttonRight" raised accent ripple
                        disabled={ _.some(this.state.areApplicantsValid, isValid => !isValid) }
                        onClick={() => navigateForward({ applicantInfos: this._mapEachApplicant(index => this.refs['applicantInfoCard' + index].getFormData()) })}
                    >
                        Next
                    </Button>
                </div>
            </div>
        );
    },

    _mapEachApplicant(fn) {
        return _.map(_.range(ApplicationStore.getFormData().numChildren), fn);
    }
});
