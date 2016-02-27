var _ = require('lodash');
var React = require('react');
var { Card, CardText, CardTitle, Icon } = require('react-mdl');
var HorizontalBoxSelector = require('../general/HorizontalBoxSelector.jsx');
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
        return applicantInfo || {};
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
                        <LabelCheckboxTable
                            getCheckboxValue={stateKey => !!this.state[stateKey]}
                            labelStateKeyPairs={[
                                'Current Student', 'currentStudent',
                                'Receives Income', 'receivesIncome',
                                'Foster Child', 'fosterChild',
                                'Migrant, homeless, runaway', 'migrantHomelessRunaway'
                            ]}
                            onCheckboxChange={(stateKey, value) => this.setState({ [stateKey]: value })}
                        />

                    </td>
                </tr>
                </tbody></table>
                    <div className="toggle-optional-section-visibility" onClick={() => this.setState({ optionalSectionShown: !this.state.optionalSectionShown })}><p>Racial and Ethnic Identitiy (optional)</p><Icon className="downAarow" name="keyboard_arrow_down" /></div>
            </CardText>
                    { this.state.optionalSectionShown && this._generateOptionalSection() }
            </Card>
        );
    },

    getFormData() {
        return _.omit(this.state, 'optionalSectionShown');
    },

    _generateOptionalSection() {
        return (
            <div className="dropdown">
                <p>Responding to this section is optional and does not effect eligibility for free or reduced price meals.
                    This information however is important and helps make sure we are fully serving our community. (Please select ethnicity and race below)</p>
            <table className="tableDropdown"><tbody>
                <tr className="dropdownEthnicity">
                    <td className="dropdownTitle"><p>Ethnicity</p><Icon name="keyboard_arrow_right"/></td>
                    <td className="dropdownSelector">
                        <HorizontalBoxSelector
                            allowedValues={ ['Hispanic or Latino', 'Not Hispanic or Latino'] }
                            onClick={ (value, selectedValues) => this.setState({ ethnicity: _.contains(selectedValues, value) ? value : '' }) }
                            selectedValues={ _.compact([this.state.ethnicity]) }
                        />
                    </td>
                </tr><tr className="dropdownRace">
                    <td className="dropdownTitle"><p>Race</p><Icon name="keyboard_arrow_right"/></td>
                    <td className="dropdownSelector">
                        <HorizontalBoxSelector
                            allowedValues={ ['American Indian or Alaskan Native', 'Asian', 'Black or African American', 'Native Hawaiian or Other Pacific Islander', 'White'] }
                            onClick={ (value, races) => this.setState({ races }) }
                            selectedValues={ this.state.races || [] }
                        />
                    </td>
                </tr>
            </tbody></table>
            </div>
        );
    },

    _onNameChange(value, stateKey) {
        var otherStateKey = stateKey === 'firstName' ? 'lastName' : 'firstName';
        this.props.onRequiredFieldChange(!!value && !!this.state[otherStateKey]);
        this.setState({[stateKey]: value});
    }
});
