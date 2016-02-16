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
            currentStudent: false,
            firstName: '',
            fosterChild: false,
            lastName: '',
            migrantHomelessRunaway: false,
            receivesIncome: false
        };
    },

    render() {
        return (
            <Card>
                <CardText>
                    <table><tbody>
                        <tr>
                            <td className="applicant-name">
                                <table><tbody>
                                    <tr>
                                        <td rowSpan="2">
                                            <img src="baby.png" /><br/>
                                            Child #{ this.props.applicantIndex + 1 }
                                        </td>
                                        <td><Textfield label="First Name" onChange={e => this._onNameChange(e, 'firstName')} /></td>
                                    </tr>
                                    <tr>
                                        <td><Textfield label="Last Name" onChange={e => this._onNameChange(e, 'lastName')} /></td>
                                    </tr>
                                </tbody></table>
                            </td>
                            <td>
                                <table><tbody>
                                    { this._generateLabelCheckboxRow('Current Student', 'currentStudent') }
                                    { this._generateLabelCheckboxRow('Receives Income', 'receivesIncome') }
                                    { this._generateLabelCheckboxRow('Foster Child', 'fosterChild') }
                                    { this._generateLabelCheckboxRow('Migrant, homeless, runaway', 'migrantHomelessRunaway') }
                                </tbody></table>
                            </td>
                        </tr>
                    </tbody></table>
                </CardText>
            </Card>
        );
    },

    _generateLabelCheckboxRow(label, stateKey) {
        return (
            <tr>
                <td>{ label }</td>
                <td><Checkbox checked={this.state[stateKey]} onChange={e => this.setState({[stateKey]: e.target.checked})} /></td>
            </tr>
        );
    },

    _onNameChange({ target: { value }}, stateKey) {
        var otherStateKey = stateKey === 'firstName' ? 'lastName' : 'firstName';
        this.props.onRequiredFieldChange(!!value && !!this.state[otherStateKey]);
        this.setState({[stateKey]: value});
    }
});
