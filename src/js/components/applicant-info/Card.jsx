var _ = require('lodash');
var React = require('react');
var { Card, CardText, Textfield } = require('react-mdl');
var LabelCheckboxTable = require('../LabelCheckboxTable.jsx');

module.exports = React.createClass({
    displayName: 'ApplicantInfoCard',
    propTypes: {
        applicantIndex: React.PropTypes.number.isRequired,
        onRequiredFieldChange: React.PropTypes.func.isRequired
    },

    getInitialState() {
        return {
            optionalSectionShown: false,

            asian: false,
            black: false,
            currentStudent: false,
            firstName: '',
            fosterChild: false,
            hawaiian: false,
            hispanicOrLatino: false,
            indianAlaskan: false,
            lastName: '',
            migrantHomelessRunaway: false,
            receivesIncome: false,
            white: false
        };
    },

    render() {
        return (
            <Card shadow={1}><CardText>
                <table><tbody><tr>
                    <td className="applicant-name">
                        <table><tbody>
                            <tr>
                                <td rowSpan="2">
                                    <img src="baby.png" /><br/>
                                    Child #{ this.props.applicantIndex + 1 }
                                </td>
                                <td><Textfield label="First Name" onChange={e => this._onNameChange(e, 'firstName')} /></td>
                            </tr><tr>
                                <td><Textfield label="Last Name" onChange={e => this._onNameChange(e, 'lastName')} /></td>
                            </tr>
                        </tbody></table>
                    </td>
                    <td>
                        { this._generateLabelCheckboxTable(
                            'Current Student', 'currentStudent',
                            'Receives Income', 'receivesIncome',
                            'Foster Child', 'fosterChild',
                            'Migrant, homeless, runaway', 'migrantHomelessRunaway'
                        )}
                        <div className="toggle-optional-section-visibility" onClick={() => this.setState({ optionalSectionShown: !this.state.optionalSectionShown })}>Optional</div>
                    </td>
                </tr></tbody></table>
                { this.state.optionalSectionShown && this._generateOptionalSection() }
            </CardText></Card>
        );
    },

    getFormData() {
        return _.omit(this.state, 'optionalSectionShown');
    },

    _generateLabelCheckboxTable(...labelStateKeyPairs) {
        return <LabelCheckboxTable labelStateKeyPairs={labelStateKeyPairs} onCheckboxChange={(stateKey, value) => this.setState({ [stateKey]: value })} />
    },

    _generateOptionalSection() {
        return (
            <table><tbody><tr>
                <td className="applicant-ethnicity">
                    Ethnicity<br/>
                    { this._generateLabelCheckboxTable('Hispanic or Latino', 'hispanicOrLatino') }
                </td><td>
                    Race<br/>
                    { this._generateLabelCheckboxTable(
                        'American Indian or Alaskan Native', 'indianAlaskan',
                        'Asian', 'asian',
                        'Black or African American', 'black',
                        'Native Hawaiian or Other Pacific Islander', 'hawaiian',
                        'White', 'white'
                    )}
                </td>
            </tr></tbody></table>
        );
    },

    _onNameChange({ target: { value }}, stateKey) {
        var otherStateKey = stateKey === 'firstName' ? 'lastName' : 'firstName';
        this.props.onRequiredFieldChange(!!value && !!this.state[otherStateKey]);
        this.setState({[stateKey]: value});
    }
});
