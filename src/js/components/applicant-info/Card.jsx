var _ = require('lodash');
var React = require('react');
var { Card, CardText, Textfield } = require('react-mdl');
var LabelCheckboxTable = require('../LabelCheckboxTable.jsx');
var ApplicationStore = require('../../stores/ApplicationStore');

module.exports = React.createClass({
    displayName: 'ApplicantInfoCard',
    propTypes: {
        applicantIndex: React.PropTypes.number.isRequired,
        onRequiredFieldChange: React.PropTypes.func.isRequired
    },

    getInitialState() {
        var applicantInfos = ApplicationStore.getFormData().applicantInfos;
        var applicantInfo = applicantInfos && applicantInfos[this.props.applicantIndex];
        return _.pick(applicantInfo || {}, [
            'asian', 'black', 'currentStudent', 'firstName', 'fosterChild', 'hawaiian', 'hispanicOrLatino', 'indianAlaskan', 'lastName', 'migrantHomelessRunaway', 'receivesIncome', 'white'
        ]);
    },

    render() {
        return (
            <Card shadow={1}><CardText>
                <table><tbody><tr>
                    <td className="applicant-name">
                        <table><tbody>
                            <tr>
                                <td rowSpan="2">
                                    <img src="child-01.png" /><br/>
                                    Child #{ this.props.applicantIndex + 1 }
                                </td>
                                <td><Textfield floatingLabel label="First Name" onChange={e => this._onNameChange(e, 'firstName')} value={ this.state.firstName } /></td>
                            </tr><tr>
                                <td><Textfield floatingLabel label="Last Name" onChange={e => this._onNameChange(e, 'lastName')} value={ this.state.lastName } /></td>
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
        return <LabelCheckboxTable
            getCheckboxValue={stateKey => !!this.state[stateKey]}
            labelStateKeyPairs={labelStateKeyPairs}
            onCheckboxChange={(stateKey, value) => this.setState({ [stateKey]: value })}
        />;
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
