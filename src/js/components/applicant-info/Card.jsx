var _ = require('lodash');
var React = require('react');
var { Card, CardText, CardTitle } = require('react-mdl');
var IconNamesTable = require('../general/IconNamesTable.jsx');
var LabelCheckboxTable = require('../general/LabelCheckboxTable.jsx');
var ApplicationStore = require('../../stores/ApplicationStore');
var { CHILD_ICON } = require('../../utils/Util');

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
            <Card shadow={1}>
                <CardTitle>{ `Child #${this.props.applicantIndex + 1}` }</CardTitle>
                <CardText>
                <table><tbody><tr>
                    <td className="applicant-name">
                        <IconNamesTable
                            firstName={ this.state.firstName }
                            icon={ CHILD_ICON }
                            lastName={ this.state.lastName }
                            onChange={(val, prop) => this._onNameChange(val, prop)}
                        />
                    </td>
                    <td className="applicant-selection">
                        { this._generateLabelCheckboxTable(
                            'Current Student', 'currentStudent',
                            'Receives Income', 'receivesIncome',
                            'Foster Child', 'fosterChild',
                            'Migrant, homeless, runaway', 'migrantHomelessRunaway'
                        )}
                        <div className="toggle-optional-section-visibility" onClick={() => this.setState({ optionalSectionShown: !this.state.optionalSectionShown })}>Optional</div>
                    </td>
                </tr>
                </tbody></table>
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
            <table className="tableDropdown"><tbody><tr>
                <td className="applicant-ethnicity">
                    <h3>Ethnicity</h3>
                    { this._generateLabelCheckboxTable('Hispanic or Latino', 'hispanicOrLatino') }
                </td><td className="applicant-race">
                    <h3>Race</h3>
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

    _onNameChange(value, stateKey) {
        var otherStateKey = stateKey === 'firstName' ? 'lastName' : 'firstName';
        this.props.onRequiredFieldChange(!!value && !!this.state[otherStateKey]);
        this.setState({[stateKey]: value});
    }
});
