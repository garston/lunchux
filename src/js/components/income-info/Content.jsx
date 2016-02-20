var React = require('react');
var { Button, Card, CardText, Textfield } = require('react-mdl');
var IncomeFrequencySelector = require('./IncomeFrequencySelector.jsx');
var IconNamesTable = require('../general/IconNamesTable.jsx');
var ApplicationStore = require('../../stores/ApplicationStore');
var { navigateForward } = require('../../utils/ActionCreator');
var { ADULT_ICON } = require('../../utils/Util');

var grossIncomePattern = '^[0-9]+$';
var grossIncomeRegEx = new RegExp(grossIncomePattern);

module.exports = React.createClass({
    displayName: 'IncomeInfoContent',

    getInitialState() {
        var { adultInfos, applicantInfos, applicantIncomeInfos, firstName, lastName, numAdults } = ApplicationStore.getFormData();
        return {
            adultInfos: _.map(_.range(numAdults), index => (adultInfos && adultInfos[index]) || (index === 0 ? { firstName, lastName } : {})),
            applicantIncomeInfos: _.map(applicantInfos, (applicantInfo, index) => applicantInfo.receivesIncome && (applicantIncomeInfos ? applicantIncomeInfos[index] : {}))
        };
    },

    render() {
        return (
            <div className="income-info-content">
                { this._getApplicantIncomeSection() }
                { this._getAdultInfoSection() }
                <Button
                    disabled={
                        _.some(this.state.applicantIncomeInfos, info => info && (!info.grossIncome || !grossIncomeRegEx.test(info.grossIncome) || !info.frequency)) ||
                        _.some(this.state.adultInfos, info => !info.firstName || !info.lastName)
                    }
                    onClick={() => navigateForward(this.state)}
                >
                    Next
                </Button>
            </div>
        );
    },

    _getAdultInfoSection() {
        var cards = _.map(this.state.adultInfos, (info, index) => {
            return (
                <Card key={ 'adult-card' + index } shadow={1}><CardText>
                    <table><tbody><tr>
                        <td>
                            <IconNamesTable
                                firstName={ info.firstName }
                                icon={ ADULT_ICON }
                                iconText={ index ? `Adult #${index + 1}` : 'You' }
                                lastName={ info.lastName }
                                onChange={(val, prop) => this._updateStateInfoArray(info, 'adultInfos', prop, val)}
                            />
                        </td>
                    </tr></tbody></table>
                </CardText></Card>
            );
        });

        return (
            <div>
                Adult Information and Income
                { cards }
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
                            onChange={e => this._updateStateInfoArray(applicantIncomeInfo, 'applicantIncomeInfos', 'grossIncome', e.target.value)}
                            pattern={ grossIncomePattern }
                            value={ applicantIncomeInfo.grossIncome }
                        />
                    </td>
                    <td>Every</td>
                    <td>
                        <IncomeFrequencySelector
                            onChange={val => this._updateStateInfoArray(applicantIncomeInfo, 'applicantIncomeInfos', 'frequency', val)}
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

    _updateStateInfoArray(infoToUpdate, stateKey, key, val) {
        this.setState({
            [stateKey]: _.map(this.state[stateKey], info => info === infoToUpdate ? _.assign({}, info, { [key]: val }) : info)
        });
    }
});
