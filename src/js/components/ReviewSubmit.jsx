var _ = require('lodash');
var React = require('react');
var { Button, Card, CardText, Icon, Textfield } = require('react-mdl');
var ApplicationStore = require('../stores/ApplicationStore');
var { navigateForward } = require('../utils/ActionCreator');
var { computeYearlyIncome } = require('../utils/Util');

module.exports = React.createClass({
    displayName: 'ReviewSubmit',

    render() {
        var formData = ApplicationStore.getFormData();
        var { adultInfos, applicantInfos, numAdults, numChildren } = formData;

        return (
            <div className="review-submit-page">
                Please review the information below
                <Card shadow={1}><CardText>
                    <table><tbody><tr>
                        <td>Total Household Members</td>
                        <td>{ numAdults + numChildren }</td>
                    </tr></tbody></table>
                    <table><tbody>
                        <tr>
                            <th>Applicants</th>
                            <th>Adults</th>
                        </tr><tr>
                            <td>{ this._generateNameTable(applicantInfos) }</td>
                            <td>{ this._generateNameTable(adultInfos) }</td>
                        </tr>
                    </tbody></table>
                    <table><tbody><tr>
                        <td>Foster</td>
                        <td>{ this._computeNumApplicantsThatAre('fosterChild', applicantInfos) }</td>
                        <td>Migrant, Homeless, Runaway</td>
                        <td>{ this._computeNumApplicantsThatAre('migrantHomelessRunaway', applicantInfos) }</td>
                        <td>Current Students</td>
                        <td>{ this._computeNumApplicantsThatAre('currentStudent', applicantInfos) }</td>
                    </tr></tbody></table>
                </CardText></Card>
                { this._generateIncomeSummaryCard(formData) }
            </div>
        );
    },

    _computeIncomeByPerson(personInfos, perPersonIncomeInfos) {
        return _.map(personInfos, (personInfo, index) => {
            return {
                personInfo,
                totalIncome: _(perPersonIncomeInfos[index]).compact().reduce((sum, ii) => sum + computeYearlyIncome(ii), 0)
            };
        });
    },

    _computeNumApplicantsThatAre(prop, applicantInfos) {
        return _(applicantInfos).pluck(prop).compact().value().length;
    },

    _generateIncomeSummaryCard({ adultInfos, applicantIncomeInfos, applicantInfos }) {
        var adultIncomeByPerson = this._computeIncomeByPerson(adultInfos, _.pluck(adultInfos, 'incomeInfos'));
        var adultTotalIncome = _.reduce(adultIncomeByPerson, (sum, { totalIncome }) => sum + totalIncome, 0);
        var applicantIncomeByPerson = this._computeIncomeByPerson(applicantInfos, _.map(applicantIncomeInfos, info => [info]));
        var applicantTotalIncome = _.reduce(applicantIncomeByPerson, (sum, { totalIncome }) => sum + totalIncome, 0);
        var totalIncome = adultTotalIncome + applicantTotalIncome;

        return totalIncome > 0 && (
            <Card shadow={1}><CardText>
                <table className="income-summary-table"><tbody>
                    <tr>
                        <td>Applicant Income</td>
                        <td>Adult Income<span className="income-summary-total">Total ${ adultTotalIncome + applicantTotalIncome } /year</span></td>
                    </tr><tr>
                        <td>{ this._generateNameIncomeTable(applicantIncomeByPerson, applicantTotalIncome, totalIncome) }</td>
                        <td>{ this._generateNameIncomeTable(adultIncomeByPerson, adultTotalIncome, totalIncome) }</td>
                    </tr>
                </tbody></table>
            </CardText></Card>
        );
    },

    _generateNameTable(infos) {
        var rows = _.map(infos, (info, index) => <tr key={ index }><td><Icon name="fiber_manual_record" /></td><td>{ `${info.firstName} ${info.lastName}` }</td></tr>);
        return <table><tbody>{ rows }</tbody></table>;
    },

    _generateNameIncomeTable(incomeByPerson, totalIncomeForTable, totalIncome) {
        var rows = _(incomeByPerson).map(({ personInfo: {firstName, lastName}, totalIncome }, index) => {
            return totalIncome && (
                <tr key={ index }>
                    <td><Icon name="fiber_manual_record" /></td>
                    <td>{ firstName } { lastName }</td>
                    <td>.........</td>
                    <td>${ totalIncome } /year</td>
                </tr>
            );
        }).compact().value();
        return (
            <table className="name-income-table"><tbody>
                <tr>
                    <td><table><tbody>{ rows }</tbody></table></td>
                    <td>{ Math.round((totalIncomeForTable/totalIncome) * 100) }%</td>
                </tr>
            </tbody></table>
        );
    }
});
