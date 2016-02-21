var _ = require('lodash');
var React = require('react');
var { Button, Card, CardText, CardTitle } = require('react-mdl');
var IncomeInfoTable = require('./IncomeInfoTable.jsx');
var IconNamesTable = require('../general/IconNamesTable.jsx');
var LabelCheckboxTable = require('../general/LabelCheckboxTable.jsx');
var ApplicationStore = require('../../stores/ApplicationStore');
var { navigateForward } = require('../../utils/ActionCreator');
var { ADULT_ICON, GROSS_INCOME_PATTERN } = require('../../utils/Util');

var grossIncomeRegEx = new RegExp(GROSS_INCOME_PATTERN);
var isIncomeInfoInvalid = info => info && (!grossIncomeRegEx.test(info.grossIncome) || !info.frequency);
var noIncomeIncomeSrc = 'No Income';
var safeUpdateObjectInArray = (obj, arr, key, val) => _.map(arr, arrObj => arrObj === obj ? _.assign({}, obj, { [key]: val }) : arrObj);

var adultIncomeSources = ['Work', 'Public Assistance/Child Support/Alimony', 'Pensions/Retirement/Other', noIncomeIncomeSrc];
var noIncomeIndex = _.indexOf(adultIncomeSources, noIncomeIncomeSrc);

module.exports = React.createClass({
    displayName: 'IncomeInfoContent',

    getInitialState() {
        var { adultInfos, applicantInfos, applicantIncomeInfos, firstName, lastName, numAdults } = ApplicationStore.getFormData();
        return {
            adultInfos: _.map(_.range(numAdults), index => (adultInfos && adultInfos[index]) || _.assign(index === 0 ? { firstName, lastName } : {}, { incomeInfos: _.map(adultIncomeSources, () => false) })),
            applicantIncomeInfos: _.map(applicantInfos, (applicantInfo, index) => applicantInfo.receivesIncome && ((applicantIncomeInfos && applicantIncomeInfos[index]) || {}))
        };
    },

    render() {
        return (
            <div className="income-info-content">
                { this._getApplicantIncomeSection() }
                { this._getAdultInfoSection() }
                <Button
                    disabled={
                        _.some(this.state.applicantIncomeInfos, isIncomeInfoInvalid) ||
                        _.some(this.state.adultInfos, adultInfo => {
                            if(!adultInfo.firstName || !adultInfo.lastName) {
                                return true;
                            }

                            return !_.compact(adultInfo.incomeInfos).length ||
                                _.some(adultInfo.incomeInfos, (incomeInfo, incomeInfoIndex) => incomeInfoIndex !== noIncomeIndex && incomeInfo && isIncomeInfoInvalid(incomeInfo));
                        })
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
            var incomeInfoTables = _.map(info.incomeInfos, (incomeInfo, incomeInfoIndex) => {
                var incomeSrc = adultIncomeSources[incomeInfoIndex];
                return incomeInfo && incomeSrc !== noIncomeIncomeSrc &&
                    <IncomeInfoTable
                        frequency={ incomeInfo.frequency }
                        grossIncome={ incomeInfo.grossIncome }
                        key={ 'income-info-' + incomeInfoIndex }
                        label={ incomeSrc }
                        onChange={ (prop, val) => this._updateStateInfoArray(info, 'adultInfos', 'incomeInfos', safeUpdateObjectInArray(incomeInfo, info.incomeInfos, prop, val)) }
                    />;
            });

            return (
                <Card key={ 'adult-card' + index } shadow={1}>
                    <CardTitle>{ index ? `Adult #${index + 1}` : 'You' }</CardTitle>
                    <CardText>
                        <table><tbody><tr>
                            <td>
                                <IconNamesTable
                                    firstName={ info.firstName }
                                    icon={ ADULT_ICON }
                                    lastName={ info.lastName }
                                    onChange={(val, prop) => this._updateStateInfoArray(info, 'adultInfos', prop, val)}
                                />
                            </td><td>
                                Received Income From...
                                <LabelCheckboxTable
                                    getCheckboxValue={incomeSrc => !!info.incomeInfos[_.indexOf(adultIncomeSources, incomeSrc)]}
                                    labelStateKeyPairs={ _(adultIncomeSources).map(src => [src, src]).flatten().value() }
                                    onCheckboxChange={(changedIncomeSrc, isChecked) => {
                                        var changedIncomeIndex = _.indexOf(adultIncomeSources, changedIncomeSrc);
                                        var newIncomeInfos = _.map(info.incomeInfos, (incomeInfo, incomeInfoIndex) => {
                                            if(incomeInfoIndex === changedIncomeIndex) {
                                                return isChecked && {};
                                            }

                                            if(!isChecked) {
                                                return incomeInfo;
                                            }

                                            return changedIncomeSrc !== noIncomeIncomeSrc && incomeInfoIndex !== noIncomeIndex && incomeInfo;
                                        });
                                        this._updateStateInfoArray(info, 'adultInfos', 'incomeInfos', newIncomeInfos);
                                    }}
                                />
                            </td>
                        </tr></tbody></table>
                        { incomeInfoTables }
                    </CardText>
                </Card>
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
            var incomeInfo = this.state.applicantIncomeInfos[index];
            return incomeInfo &&
                <IncomeInfoTable
                    frequency={ incomeInfo.frequency }
                    grossIncome={ incomeInfo.grossIncome }
                    key={ 'income-info-' + index }
                    label={ `${applicantInfo.firstName} ${applicantInfo.lastName}` }
                    onChange={ (prop, val) => this._updateStateInfoArray(incomeInfo, 'applicantIncomeInfos', prop, val) }
                />;
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
            [stateKey]: safeUpdateObjectInArray(infoToUpdate, this.state[stateKey], key, val)
        });
    }
});
