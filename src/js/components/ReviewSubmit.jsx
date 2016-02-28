var _ = require('lodash');
var React = require('react');
var SignaturePad = require('signature_pad');
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

    componentDidMount() {
        var signaturePad = new SignaturePad(document.getElementById('signature'), {
            onEnd: () => this.setState({ signature: signaturePad.toDataURL() })
        });
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
                        <h2 className="householdNumName">Total Household Members</h2>
                        <h2 className="householdNum">{ numAdults + numChildren }</h2>
                    </CardTitle>
                    <CardText className="householdList">
                        <div className="barGraph"></div>
                    <table><tbody>
                        <tr>
                            <td className="householdTitle"><h3>Child</h3></td>
                            <td className="householdTitle"><h3>Adults</h3></td>
                        </tr><tr>
                            <td className="householdNames">{ this._generateNameTable(applicantInfos) }</td>
                            <td className="householdNames">{ this._generateNameTable(adultInfos) }</td>
                        </tr>
                    </tbody></table>
                    </CardText>
                    <div className="householdOther">
                        <div className="foster"><h3 className="householdSelection">Foster</h3><h3 className="householdSelectionNumber">{ this._computeNumApplicantsThatAre('fosterChild', applicantInfos) }</h3></div>
                        <div className="mhr"><h3 className="householdSelection">Migrant, Homeless, Runaway</h3><h3 className="householdSelectionNumber">{ this._computeNumApplicantsThatAre('migrantHomelessRunaway', applicantInfos) }</h3></div>
                        <div className="currentStudents"><h3 className="householdSelection">Current Students</h3><h3 className="householdSelectionNumber">{ this._computeNumApplicantsThatAre('currentStudent', applicantInfos) }</h3></div>
                </div></Card>
                { this._generateIncomeSummaryCard(formData) }
                <div className="selectionHeader container">
                    <h2>Submit</h2>
                    <p>Please fill out the information below then click submit when you are ready to submit the alpplication</p>
                </div>
                <Card shadow={1} className="submitSection"><CardText>
                    <div className="address">
                        <h3>Please Enter Current Address</h3>
                        <div className="streetField">
                            <Textfield floatingLabel label="Street" className="street" onChange={e => this.setState({street: e.target.value})} />
                            <Textfield floatingLabel label="Apt" className="apt" onChange={e => this.setState({street: e.target.value})} />
                        </div>
                        <div className="additionalField">
                            <Textfield floatingLabel label="City" className="city" onChange={e => this.setState({city: e.target.value})} />
                            <Textfield floatingLabel label="State" className="state" onChange={e => this.setState({state: e.target.value})} />
                            <Textfield floatingLabel label="Zip Code" className="zip" onChange={e => this.setState({zipCode: e.target.value})} />
                        </div>
                    </div>
                    <div className="extraInfo">
                        <div>
                            <p>Please enter the last four numbers of (primary income earner) social security number</p>
                            <Textfield error="Please enter four numbers" floatingLabel label="" onChange={e => this.setState({ssnLast4: e.target.value})} pattern={ ssnPattern } />
                        </div>
                        <div>
                            <p>Enter Todays Date</p>
                            <Textfield floatingLabel label="date" />
                        </div>
                    </div></CardText>
                    <div className="signature">
                        <div className="verifyName">
                        <Textfield floatingLabel label="First Name" />
                        <Textfield floatingLabel label="Last Name" /></div>
                        <div className="submitSignature">
                            <p>Signature</p>
                            <canvas height="50" id="signature" width="300" /><br />
                        </div>
                    </div>
                </Card>
                <div className="bottomNav container">
                    <div><p>Disclosure Statement</p></div>
                    <div><p>When you are ready click the submit button to submit your application</p>
                    <Button accent raised ripple
                        disabled={ _.some(['city', 'signature', 'ssnLast4', 'state', 'street', 'zipCode'], stateKey => !this.state[stateKey]) || !ssnRegEx.test(this.state.ssnLast4) }
                        onClick={() => navigateForward(this.state)}
                    >
                        Submit
                    </Button></div>
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
                    <h2 className="incomeNumName">Applicant Income</h2>
                    <h2 className="incomeNum">Total ${ adultTotalIncome + applicantTotalIncome } /year</h2>
                </CardTitle><CardText>
                <table className="income-summary-table"><tbody>
                    <tr>
                        <td className="incomeTitle"><h3>Child</h3></td>
                        <td className="incomeTitle"><h3>Adults</h3></td>
                    </tr>
                    <tr>
                        <td className="incomeNames">{ this._generateNameIncomeTable(applicantIncomeByPerson, applicantTotalIncome, totalIncome) }</td>
                        <td className="incomeNames">{ this._generateNameIncomeTable(adultIncomeByPerson, adultTotalIncome, totalIncome) }</td>
                    </tr>
                </tbody></table>
            </CardText></Card>
        );
    },

    _generateNameTable(infos) {
        var rows = _.map(infos, (info, index) => <tr key={ index }><td><Icon name="fiber_manual_record" /><p>{ `${info.firstName} ${info.lastName}` }</p></td></tr>);
        return <table className="names"><tbody>{ rows }</tbody></table>;
    },

    _generateNameIncomeTable(incomeByPerson, totalIncomeForTable, totalIncome) {
        var rows = _(incomeByPerson).map(({ personInfo: {firstName, lastName}, totalIncome }, index) => {
            return totalIncome && (
                <tr key={ index }>
                    <td><Icon name="fiber_manual_record" /></td>
                    <td><p>{ firstName } { lastName }</p></td>
                    <td>.........</td>
                    <td><p>${ totalIncome } /year</p></td>
                </tr>
            );
        }).compact().value();
        return (
            <div className="name-income-table">
                <div className="incomeNameList"><table><tbody>{ rows }</tbody></table></div>
                <div className="incomeGraph">{ Math.round((totalIncomeForTable/totalIncome) * 100) }%</div>
            </div>
        );
    }
});
