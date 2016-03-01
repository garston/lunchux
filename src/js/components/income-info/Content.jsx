var _ = require('lodash');
var React = require('react');
var { Button, Card, CardText, CardTitle, Checkbox } = require('react-mdl');
var IncomeInfoTableRow = require('./IncomeInfoTableRow.jsx');
var IconNamesTable = require('../general/IconNamesTable.jsx');
var ApplicationStore = require('../../stores/ApplicationStore');
var { navigateForward } = require('../../utils/ActionCreator');
var { ADULT_ICON, ALL_NUMBERS_REGEX } = require('../../utils/Util');

var isIncomeInfoInvalid = info => info && (!ALL_NUMBERS_REGEX.test(info.grossIncome) || !info.frequency);
var safeUpdateObjectInArray = (obj, arr, key, val) => _.map(arr, arrObj => arrObj === obj ? _.assign({}, obj, { [key]: val }) : arrObj);

var adultIncomeSources = ['Work', 'Public Assistance/Child Support/Alimony', 'Pensions/Retirement/Other'];
var originalIncomeInfos = _.map(adultIncomeSources, () => false);

module.exports = React.createClass({
    displayName: 'IncomeInfoContent',

    getInitialState() {
        var { adultInfos, applicantIncomeInfos, applicantInfos, firstName, lastName, numAdults } = ApplicationStore.getFormData();
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
                <div className="bottomNav container">
                    <Button className="buttonRight" raised accent ripple
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
                            <td className="applicant-name">
                                <IconNamesTable
                                    firstName={ adultInfo.firstName }
                                    icon={ ADULT_ICON }
                                    lastName={ adultInfo.lastName }
                                    middleInitial={ adultInfo.middleInitial }
                                    onChange={(val, prop) => this._updateStateInfoArray(adultInfo, 'adultInfos', prop, val)}
                                />
                            </td><td className="applicant-selection">
                                <h3>Receives Income From...</h3>
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
                    </CardText>
                    { this._getIncomeInfoTable(adultInfo) }
                </Card>
            );
        });

        return (
            <div className="adultIncomeSection">
                <div className="container selectionHeader"><h2>Adult Information and Income</h2>
                    <p>Please enter each adult's name and select the all the appropriate boxes that reflects what type of income
                        they receive or if they do not receive any income. If any income is received please enter the amount and
                        frequency each child receives to get the total gross income. </p></div>
                { cards }
            </div>
        );
    },

    _getApplicantIncomeSection() {
        var applicantIncomeRows = _(ApplicationStore.getFormData().applicantInfos).map(({firstName, lastName, middleInitial}, index) => {
            var incomeInfo = this.state.applicantIncomeInfos[index];
            return incomeInfo &&
                <Card className="applicantCard" key={ 'income-info-' + index } shadow={1}>
                    <table><tbody>
                        <IncomeInfoTableRow
                            frequency={ incomeInfo.frequency }
                            grossIncome={ incomeInfo.grossIncome }
                            label={ `${firstName}${middleInitial ? ' ' + middleInitial : ''} ${lastName}` }
                            onChange={ (prop, val) => this._updateStateInfoArray(incomeInfo, 'applicantIncomeInfos', prop, val) }
                        />
                    </tbody></table>
                </Card>
        }).compact().value();

        return applicantIncomeRows.length > 0 && (
            <div className="applicantIncomeSection">
                <div className="container selectionHeader"><h2>Child Income</h2>
                    <p>Please enter the income information for the children you selected that receives income in the children's section.
                        Please enter the amount and frequency each child receives to get the total gross income.  </p></div>
                { applicantIncomeRows }
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
       return <div className="adultCard"><table><tbody>{ rows }</tbody></table></div>;
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
