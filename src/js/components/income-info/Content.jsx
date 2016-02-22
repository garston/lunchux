var _ = require('lodash');
var React = require('react');
var { Button, Card, CardText, CardTitle, Checkbox } = require('react-mdl');
var IncomeInfoTableRow = require('./IncomeInfoTableRow.jsx');
var IconNamesTable = require('../general/IconNamesTable.jsx');
var ApplicationStore = require('../../stores/ApplicationStore');
var { navigateForward } = require('../../utils/ActionCreator');
var { ADULT_ICON, GROSS_INCOME_PATTERN } = require('../../utils/Util');

var grossIncomeRegEx = new RegExp(GROSS_INCOME_PATTERN);
var isIncomeInfoInvalid = info => info && (!grossIncomeRegEx.test(info.grossIncome) || !info.frequency);
var safeUpdateObjectInArray = (obj, arr, key, val) => _.map(arr, arrObj => arrObj === obj ? _.assign({}, obj, { [key]: val }) : arrObj);

var adultIncomeSources = ['Work', 'Public Assistance/Child Support/Alimony', 'Pensions/Retirement/Other'];
var originalIncomeInfos = _.map(adultIncomeSources, () => false);

module.exports = React.createClass({
    displayName: 'IncomeInfoContent',

    getInitialState() {
        var { adultInfos, applicantInfos, applicantIncomeInfos, firstName, lastName, numAdults } = ApplicationStore.getFormData();
        return {
            adultInfos: _.map(_.range(numAdults), index => (adultInfos && adultInfos[index]) || _.assign(index === 0 ? { firstName, lastName } : {}, { incomeInfos: originalIncomeInfos })),
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

                            return !_.compact(adultInfo.incomeInfos.concat([adultInfo.noIncome])).length || _.some(adultInfo.incomeInfos, isIncomeInfoInvalid);
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
        var cards = _.map(this.state.adultInfos, (adultInfo, index) => {
            return (
                <Card key={ 'adult-card' + index } shadow={1}>
                    <CardTitle>{ index ? `Adult #${index + 1}` : 'You' }</CardTitle>
                    <CardText>
                        <table><tbody><tr>
                            <td>
                                <IconNamesTable
                                    firstName={ adultInfo.firstName }
                                    icon={ ADULT_ICON }
                                    lastName={ adultInfo.lastName }
                                    onChange={(val, prop) => this._updateStateInfoArray(adultInfo, 'adultInfos', prop, val)}
                                />
                            </td><td>
                                Received Income From...
                                <table><tbody>
                                    { this._getIncomeCheckboxRows(adultInfo) }
                                    <tr>
                                        <td>No Income</td>
                                        <td>
                                            <Checkbox
                                                checked={ !!adultInfo.noIncome }
                                                onChange={ e => this._updateAdultInfos({ adultInfo, incomeInfos: originalIncomeInfos, noIncome: e.target.checked }) }
                                            />
                                        </td>
                                    </tr>
                                </tbody></table>
                            </td>
                        </tr></tbody></table>
                        { this._getIncomeInfoTable(adultInfo) }
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
        var applicantIncomeRows = _(ApplicationStore.getFormData().applicantInfos).map((applicantInfo, index) => {
            var incomeInfo = this.state.applicantIncomeInfos[index];
            return incomeInfo &&
                <IncomeInfoTableRow
                    frequency={ incomeInfo.frequency }
                    grossIncome={ incomeInfo.grossIncome }
                    key={ 'income-info-' + index }
                    label={ `${applicantInfo.firstName} ${applicantInfo.lastName}` }
                    onChange={ (prop, val) => this._updateStateInfoArray(incomeInfo, 'applicantIncomeInfos', prop, val) }
                />;
        }).compact().value();

        return applicantIncomeRows.length > 0 && (
            <div>
                Please Enter Applicant Income Information
                <table><tbody>{ applicantIncomeRows }</tbody></table>
            </div>
        );
    },

    _getIncomeCheckboxRows(adultInfo) {
        return _.map(adultIncomeSources, (incomeSrc, index) => {
            return (
                <tr key={ 'income-checkbox-' + index }>
                    <td>{ incomeSrc }</td>
                    <td>
                        <Checkbox
                            checked={ !!adultInfo.incomeInfos[_.indexOf(adultIncomeSources, incomeSrc)] }
                            onChange={ ({target: { checked }}) => {
                                var changedIncomeIndex = _.indexOf(adultIncomeSources, incomeSrc);
                                var incomeInfos = _.map(adultInfo.incomeInfos, (incomeInfo, incomeInfoIndex) => incomeInfoIndex === changedIncomeIndex ? checked && {} : incomeInfo);

                                this._updateAdultInfos({ adultInfo, incomeInfos, noIncome: !checked && adultInfo.noIncome });
                            }}
                        />
                    </td>
                </tr>
            );
        });
    },

    _getIncomeInfoTable(adultInfo) {
        var rows = _.map(adultInfo.incomeInfos, (incomeInfo, index, incomeInfos) => {
            return incomeInfo &&
                <IncomeInfoTableRow
                   frequency={ incomeInfo.frequency }
                   grossIncome={ incomeInfo.grossIncome }
                   key={ 'income-info-' + index }
                   label={ adultIncomeSources[index] }
                   onChange={ (prop, val) => this._updateStateInfoArray(adultInfo, 'adultInfos', 'incomeInfos', safeUpdateObjectInArray(incomeInfo, incomeInfos, prop, val)) }
                />;
       });
       return <table><tbody>{ rows }</tbody></table>;
    },

    _updateAdultInfos({ adultInfo, incomeInfos, noIncome }) {
        var adultInfos = this.state.adultInfos;
        var adultInfoIndex = _.indexOf(adultInfos, adultInfo);

        adultInfos = safeUpdateObjectInArray(adultInfos[adultInfoIndex], adultInfos, 'incomeInfos', incomeInfos);
        adultInfos = safeUpdateObjectInArray(adultInfos[adultInfoIndex], adultInfos, 'noIncome', noIncome);
        this.setState({ adultInfos });
    },

    _updateStateInfoArray(infoToUpdate, stateKey, key, val) {
        this.setState({
            [stateKey]: safeUpdateObjectInArray(infoToUpdate, this.state[stateKey], key, val)
        });
    }
});
