var _ = require('lodash');
var React = require('react');
var { Card, CardText, Checkbox, Textfield } = require('react-mdl');

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
            <Card>
                <CardText>
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
                </CardText>
            </Card>
        );
    },

    getFormData() {
        return _.omit(this.state, 'optionalSectionShown');
    },

    _generateLabelCheckboxTable(...labelStateKeyPairs) {
        var rows = _(labelStateKeyPairs).
            map((label, index, arr) => index % 2 === 0 && ({ label, stateKey: arr[index+1] })).
            compact().
            map(({ label, stateKey }, index) => (
                <tr key={'label-checkbox-row' + index}>
                    <td>{ label }</td>
                    <td><Checkbox checked={this.state[stateKey]} onChange={e => this.setState({[stateKey]: e.target.checked})} /></td>
                </tr>
            )).
            value();
        return <table><tbody>{ rows }</tbody></table>;
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
