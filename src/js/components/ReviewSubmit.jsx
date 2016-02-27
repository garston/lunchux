var _ = require('lodash');
var React = require('react');
var { Button, Card, CardText, CardTitle, Icon, Textfield } = require('react-mdl');
var ApplicationStore = require('../stores/ApplicationStore');
var { navigateForward } = require('../utils/ActionCreator');
var { computeYearlyIncome } = require('../utils/Util');

var ssnPattern = '^[0-9][0-9][0-9][0-9]$';
var ssnRegEx = new RegExp(ssnPattern);

module.exports = React.createClass({
    displayName: 'ReviewSubmit',

    getInitialState() {
        return {};
    },

    render() {
        var formData = ApplicationStore.getFormData();
        var { adultInfos, applicantInfos, numAdults, numChildren } = formData;

        return (
            <div className="review-submit-page">
                <div className="selectionHeader container">
                    <h2>Summary</h2>
                    <p>Please review the information below to make sure everything is accurate</p>
                </div>
                <Card shadow={1} className="householdSum">
                    <CardTitle>
                        <h2>Total Household Members</h2>
                        <div className="householdNum"><h2>{ numAdults + numChildren }</h2></div>
                    </CardTitle>
                    <CardText className="householdList">
                        <div className="barGraph"></div>
                    <table><tbody>
                        <tr>
                            <td className="householdTitle"><h3>Applicants</h3></td>
                            <td className="householdTitle"><h3>Adults</h3></td>
                        </tr><tr>
                            <td className="householdNames">{ this._generateNameTable(applicantInfos) }</td>
                            <td className="householdNames">{ this._generateNameTable(adultInfos) }</td>
                        </tr>
                    </tbody></table>
                    </CardText>
                    <CardText className="householdOther">
                        <div className="foster"><h3>Foster</h3><h3>{ this._computeNumApplicantsThatAre('fosterChild', applicantInfos) }</h3></div>
                        <div className="mhr"><h3>Migrant, Homeless, Runaway</h3><h3>{ this._computeNumApplicantsThatAre('migrantHomelessRunaway', applicantInfos) }</h3></div>
                        <div className="currentStudents"><h3>Current Students</h3><h3>{ this._computeNumApplicantsThatAre('currentStudent', applicantInfos) }</h3></div>
                </CardText></Card>
                { this._generateIncomeSummaryCard(formData) }
                <div className="selectionHeader container">
                    <h2>Submit</h2>
                    <p>Please fill out the information below then click submit when you are ready to submit the alpplication</p>
                </div>
                <Card shadow={1} className="address"><CardText>
                    Please Enter Current Address<br />
                    <Textfield floatingLabel label="Street" onChange={e => this.setState({street: e.target.value})} />
                    <Textfield floatingLabel label="City" onChange={e => this.setState({city: e.target.value})} />
                    <Textfield floatingLabel label="State" onChange={e => this.setState({state: e.target.value})} />
                    <Textfield floatingLabel label="Zip Code" onChange={e => this.setState({zipCode: e.target.value})} />
                </CardText></Card>
                <Card shadow={1} className="final"><CardText>
                    <table><tbody><tr>
                        <td>
                            <Textfield floatingLabel label="" />
                            <Textfield floatingLabel label="" />
                        </td>
                        <td>
                            Please enter the last four numbers of (primary income earner) social security number<br/>
                            <Textfield error="Please enter four numbers" floatingLabel label="" onChange={e => this.setState({ssnLast4: e.target.value})} pattern={ ssnPattern } />
                        </td></tr>
                    </tbody></table>
                    <div>
                        <Textfield floatingLabel label="" />
                        Signature
                    </div>
                </CardText></Card>
                <div className="bottomNav container">
                    <p>Disclosure Statement</p>
                    <p>When you are ready click the submit button to submit your application</p>
                    <Button accent raised ripple
                        disabled={ _.some(['city', 'ssnLast4', 'state', 'street', 'zipCode'], stateKey => !this.state[stateKey]) || !ssnRegEx.test(this.state.ssnLast4) }
                        onClick={() => navigateForward(this.state)}
                    >
                        Submit
                    </Button>
                </div>
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
            <Card shadow={1} className="incomeSum">
                <CardTitle>
                    <h3>Applicant Income</h3>
                    <h3>Adult Income</h3>
                    <div><span className="income-summary-total">Total ${ adultTotalIncome + applicantTotalIncome } /year</span></div>
                </CardTitle><CardText>
                <table className="income-summary-table"><tbody>
                    <tr>
                        <td>{ this._generateNameIncomeTable(applicantIncomeByPerson, applicantTotalIncome, totalIncome) }</td>
                        <td>{ this._generateNameIncomeTable(adultIncomeByPerson, adultTotalIncome, totalIncome) }</td>
                    </tr>
                </tbody></table>
            </CardText></Card>
        );
    },

    _generateNameTable(infos) {
        var rows = _.map(infos, (info, index) => <tr key={ index }><td><Icon name="fiber_manual_record" /></td><td>{ `${info.firstName} ${info.lastName}` }</td></tr>);
        return <table className="names"><tbody>{ rows }</tbody></table>;
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
