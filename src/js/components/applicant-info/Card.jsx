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
                            middleInitial={ this.state.middleInitial }
                            onChange={(val, prop) => this._onNameChange(val, prop)}
                        />
                    </td>
                    <td className="applicant-selection">
                        <h3>Is a...</h3>
                        <LabelCheckboxTable
                            getCheckboxValue={stateKey => !!this.state[stateKey]}
                            labelStateKeyPairs={[
                                'Current Student', 'currentStudent',
                                'Foster Child', 'fosterChild',
                                'Migrant, homeless, runaway', 'migrantHomelessRunaway',
                                'Receive Income', 'receivesIncome'
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
                <p>We are required to ask for information about your children’s race and ethnicity. This information is important and helps to make sure we are fully serving our community.
                    Responding to this section is optional and does not affect your children’s eligibility for free or reduced price meals.</p>
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
        this.props.onRequiredFieldChange(_.every(['firstName', 'lastName'], sk => sk === stateKey ? value : this.state[sk]));
        this.setState({[stateKey]: value});
    }
});
