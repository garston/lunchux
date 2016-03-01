var _ = require('lodash');
var React = require('react');
var SignaturePad = require('signature_pad');
var { Button, Card, CardTitle, Icon, Textfield, ProgressBar, Checkbox } = require('react-mdl');
var ApplicationStore = require('../stores/ApplicationStore');
var { submitApplication } = require('../utils/ActionCreator');
var { computeYearlyIncome } = require('../utils/Util');

var datePattern = '^[01][0-9]/[0-3][0-9]/[0-9][0-9][0-9][0-9]$';
var dateRegEx = new RegExp(datePattern);
var ssnPattern = '^[0-9][0-9][0-9][0-9]$';
var ssnRegEx = new RegExp(ssnPattern);

module.exports = React.createClass({
    displayName: 'ReviewSubmit',

    getInitialState() {
        return {};
    },

    componentDidMount() {
        var signaturePad = new SignaturePad(document.getElementById('signature-canvas'), {
            onEnd: () => this.setState({ signature: signaturePad.toDataURL() })
        });
    },

    render() {
        var formData = ApplicationStore.getFormData();
        var { adultInfos, applicantInfos, numAdults, numChildren } = formData;

        var ssnSection = adultInfos && (
            <div className="ssn">
                <h3>Please enter the last four numbers of the primary income earners social security number</h3>
                <p>XXX - XX - </p>
                <Textfield floatingLabel
                    error="Please enter four numbers"
                    label="SSN"
                    onChange={e => this.setState({noSSN: false, ssnLast4: e.target.value})}
                    pattern={ ssnPattern }
                    value={ this.state.ssnLast4 }
                />
                <Checkbox ripple checked={ this.state.noSSN } onChange={e => this.setState({noSSN: e.target.checked, ssnLast4: ''})}><p className="noSSN">Check if no SSN</p></Checkbox>
            </div>
        );

        return (
            <div className="review-submit-page">
                <div className="selectionHeader container">
                    <h2>Review</h2>
                    <p>Please review the information below to make sure everything is accurate. As a reminder If any changes do need to be made please go back to the appropriate section to make the changes.
                        Your changes are saved so you will not loose any information previously entered but please be sure to review each section as any changes you make can affect other sections. </p>
                </div>
                <Card shadow={1} className="householdSum">
                    <CardTitle>
                        <h2 className="householdNumName">Total Household Members</h2>
                        <h2 className="householdNum">{ numAdults + numChildren }</h2>
                    </CardTitle>
                    <div className="householdList">
                        <div className="barGraph">
                            <ProgressBar progress={(numChildren/(numAdults + numChildren))*100} />
                        </div>
                        <table><tbody>
                            <tr>
                                <td className="householdTitle border"><h3>Children</h3></td>
                                <td className="householdTitle"><h3>Adults{ !adultInfos && ` (${numAdults})`}</h3></td>
                            </tr><tr>
                                <td className="householdNames border">{ this._generateNameTable(applicantInfos) }</td>
                                <td className="householdNames">{ adultInfos && this._generateNameTable(adultInfos) }</td>
                            </tr>
                        </tbody></table>
                    </div>
                    <div className="householdOther">
                        <div className="foster"><h3 className="householdSelection">Foster</h3><h3 className="householdSelectionNumber">{ this._computeNumApplicantsThatAre('fosterChild', applicantInfos) }</h3></div>
                        <div className="mhr"><h3 className="householdSelection">Migrant, Homeless, Runaway</h3><h3 className="householdSelectionNumber">{ this._computeNumApplicantsThatAre('migrantHomelessRunaway', applicantInfos) }</h3></div>
                        <div className="currentStudents"><h3 className="householdSelection">Current Students</h3><h3 className="householdSelectionNumber">{ this._computeNumApplicantsThatAre('currentStudent', applicantInfos) }</h3></div>
                </div></Card>
                { this._generateIncomeSummaryCard(formData) }
                <div className="selectionHeader container">
                    <h2>Additional Information</h2>
                    <p>Please fill out the information below to complete your application. Once everything has been completed please click the submit button to complete your application.
                    Keep in mind that once submitted you will not be able to edit your submission.</p>
                </div>
                <Card shadow={1} className="submitSection">
                    <div>
                    <div className="address">
                        <h3>Please Enter Current Address, Email, and Phone Number (optional)"</h3>
                        <div className="streetField">
                            <Textfield floatingLabel label="Street" className="street" onChange={e => this.setState({street: e.target.value})} />
                            <Textfield floatingLabel label="Apt" className="apt" onChange={e => this.setState({apt: e.target.value})} />
                        </div>
                        <div className="additionalField">
                            <Textfield floatingLabel label="City" className="city" onChange={e => this.setState({city: e.target.value})} />
                            <Textfield floatingLabel label="State" className="state" onChange={e => this.setState({state: e.target.value})} />
                            <Textfield floatingLabel label="Zip Code" className="zip" onChange={e => this.setState({zipCode: e.target.value})} />
                        </div>
                        <div className="phoneEmail">
                            <h3>Phone:</h3>
                            <Textfield floatingLabel label="(xxx) xxx-xxxx" className="phone" onChange={e => this.setState({phone: e.target.value})} />
                            <h3>Email:</h3>
                            <Textfield floatingLabel label="email@example.com" className="email" onChange={e => this.setState({email: e.target.value})} />
                        </div>
                    </div>
                    <div className="extraInfo">
                        { ssnSection }
                        <div className="verifyName">
                            <h3>Please Enter Your Name</h3>
                            <Textfield floatingLabel label="First Name" onChange={e => this.setState({signatureFirstName: e.target.value})} />
                            <Textfield floatingLabel label="Last Name" onChange={e => this.setState({signatureLastName: e.target.value})} />
                        </div>
                        <div className="todaysDate">
                            <h3>Enter Today's Date:</h3>
                            <Textfield floatingLabel
                                       error="Please enter the date in the form MM/DD/YYYY"
                                       label="MM/DD/YYYY"
                                       onChange={e => this.setState({todayDate: e.target.value})}
                                       pattern={ datePattern }
                            />
                        </div>
                    </div>
                    </div>
                    <div className="signature">
                        <div className="submitSignature">
                            <h3>Please Sign in the Box Below</h3>
                            <p>The person signing is furnishing true information and to advise that person that the application is being made in connection with the receipt of Federal funds;
                                School officials may verify the information on the application; and Deliberate misrepresentation of the information may subject the applicant to prosecution under State and Federal statutes.</p>
                            <canvas height="70" id="signature-canvas" width="600" /><br />
                        </div>
                        <div className="submitButton"><p>When you are ready click the submit button to submit your application</p>
                            <Button accent raised ripple
                                disabled={
                                    _.some(['signature', 'signatureFirstName', 'signatureLastName', 'todayDate'], stateKey => !this.state[stateKey]) ||
                                    !dateRegEx.test(this.state.todayDate) ||
                                    (!!ssnSection && !this.state.noSSN && (!this.state.ssnLast4 || !ssnRegEx.test(this.state.ssnLast4)))
                                }
                                onClick={() => {
                                    window.onbeforeunload = null;
                                    submitApplication(this.state);
                                }}
                            >
                                Submit
                            </Button>
                        </div>
                    </div>
                </Card>
                <div className="bottomNav container">
                    <div><p>
                        USDA Non-Discrimination Statement<br/>
                        <br/>
                        In accordance with Federal civil rights law and U.S. Department of Agriculture (USDA) civil rights regulations and policies, the USDA, its Agencies, offices, and employees, and institutions participating in or administering USDA programs are prohibited from discriminating based on race, color, national origin, sex, disability, age, or reprisal or retaliation for prior civil rights activity in any program or activity conducted or funded by USDA.<br/>
                        <br/>
                        Persons with disabilities who require alternative means of communication for program information (e.g. Braille, large print, audiotape, American Sign Language, etc.), should contact the Agency (State or local) where they applied for benefits. Individuals who are deaf, hard of hearing or have speech disabilities may contact USDA through the Federal Relay Service at (800) 877-8339. Additionally, program information may be made available in languages other than English.<br/>
                        <br/>
                        To file a program complaint of discrimination, complete the USDA Program Discrimination Complaint Form, (AD-3027) found online at: http://www.ascr.usda.gov/complaint_filing_cust.html, and at any USDA office, or write a letter addressed to USDA and provide in the letter all of the information requested in the form. To request a copy of the complaint form, call (866) 632-9992. Submit your completed form or letter to USDA by:<br/>
                        <br/>
                        (1) Mail: U.S. Department of Agriculture<br/>
                        Office of the Assistant Secretary for Civil Rights<br/>
                        1400 Independence Avenue, SW<br/>
                        Washington, D.C. 20250-9410;<br/>
                        <br/>
                        (2) Fax: (202) 690-7442; or<br/>
                        <br/>
                        (3) Email: program.intake@usda.gov.<br/>
                        <br/>
                        This institution is an equal opportunity provider.<br/>
                    </p></div>
                    <div><p>
                        Use of Information Statement<br/>
                        <br/>
                        The Richard B. Russell National School Lunch Act requires the information on this application. You do not have to give the information, but if you do not submit all needed information, we cannot approve your child for free or reduced price meals. You must include the last four digits of the social security number of the adult household member who signs the application. The social security number is not required when you apply on behalf of a foster child or you list a Supplemental Nutrition Assistance Program (SNAP), Temporary Assistance for Needy Families (TANF) Program or Food Distribution Program on Indian Reservations (FDPIR) case number or other FDPIR identifier for your child or when you indicate that the adult household member signing the application does not have a social security number. We will use your information to determine if your child is eligible for free or reduced price meals, and for administration and enforcement of the lunch and breakfast programs.<br/>
                        <br/>
                        We may share your eligibility information with education, health, and nutrition programs to help them evaluate, fund, or determine benefits for their programs, auditors for program reviews, and law enforcement officials to help them look into violations of program rules.<br/>
                    </p></div>
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
                    <h2 className="incomeNumName">Total Household Income</h2>
                    <h2 className="incomeNum"> ${ adultTotalIncome + applicantTotalIncome }/year</h2>
                </CardTitle>
                <div className="incomeList">
                <table className="income-summary-table"><tbody>
                    <tr>
                        <td className="incomeTitle border"><h3>Children</h3></td>
                        <td className="incomeTitle"><h3>Adults</h3></td>
                    </tr>
                    <tr>
                        <td className="incomeNames border">{ this._generateNameIncomeTable(applicantIncomeByPerson, applicantTotalIncome, totalIncome) }</td>
                        <td className="incomeNames">{ this._generateNameIncomeTable(adultIncomeByPerson, adultTotalIncome, totalIncome) }</td>
                    </tr>
                </tbody></table>
                </div>
            </Card>
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
                    <td></td>
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
