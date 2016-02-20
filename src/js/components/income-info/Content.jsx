var React = require('react');
var { Button, Textfield } = require('react-mdl');
var IncomeFrequencySelector = require('./IncomeFrequencySelector.jsx');
var ApplicationStore = require('../../stores/ApplicationStore');
var { navigateForward } = require('../../utils/ActionCreator');

var grossIncomePattern = '^[0-9]+$';
var grossIncomeRegEx = new RegExp(grossIncomePattern);

module.exports = React.createClass({
    displayName: 'IncomeInfoContent',

    getInitialState() {
        var { applicantInfos, applicantIncomeInfos } = ApplicationStore.getFormData();
        return {
            applicantIncomeInfos: _.map(applicantInfos, (applicantInfo, index) => applicantInfo.receivesIncome && (applicantIncomeInfos ? applicantIncomeInfos[index] : {}))
        };
    },

    render() {
        return (
            <div className="income-info-content">
                { this._getApplicantIncomeSection() }
                <Button
                    disabled={ _.some(this.state.applicantIncomeInfos, info => info && (!info.grossIncome || !grossIncomeRegEx.test(info.grossIncome) || !info.frequency)) }
                    onClick={() => navigateForward(this.state)}
                >
                    Next
                </Button>
            </div>
        );
    },

    _getApplicantIncomeSection() {
        var applicantIncomeTables = _(ApplicationStore.getFormData().applicantInfos).map((applicantInfo, index) => {
            var applicantIncomeInfo = this.state.applicantIncomeInfos[index];
            return applicantIncomeInfo && (
                <table key={ 'income-info-' + index }><tbody><tr>
                    <td>{ applicantInfo.firstName } {applicantInfo.lastName}</td>
                    <td>
                        <Textfield
                            error="Please enter only numbers"
                            floatingLabel
                            label="Gross Income"
                            onChange={e => this._updateApplicantIncomeInfo(applicantIncomeInfo, 'grossIncome', e.target.value)}
                            pattern={ grossIncomePattern }
                            value={ applicantIncomeInfo.grossIncome }
                        />
                    </td>
                    <td>Every</td>
                    <td>
                        <IncomeFrequencySelector
                            onChange={val => this._updateApplicantIncomeInfo(applicantIncomeInfo, 'frequency', val)}
                            value={ applicantIncomeInfo.frequency }
                        />
                    </td>
                </tr></tbody></table>
            );
        }).compact().value();

        return applicantIncomeTables.length > 0 && (
            <div>
                Please Enter Applicant Income Information
                { applicantIncomeTables }
            </div>
        );
    },

    _updateApplicantIncomeInfo(applicantIncomeInfo, key, val) {
        this.setState({
            applicantIncomeInfos: _.map(this.state.applicantIncomeInfos, info => info === applicantIncomeInfo ? _.assign({}, info, { [key]: val }) : info)
        });
    }
});
