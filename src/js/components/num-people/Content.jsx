var _ = require('lodash');
var React = require('react');
var { Button, Checkbox } = require('react-mdl');
var NumPeopleCard = require('./Card.jsx');
var ApplicationStore = require('../../stores/ApplicationStore');
var { navigateForward } = require('../../utils/ActionCreator');
var { ADULT_ICON, CHILD_ICON } = require('../../utils/Util');

module.exports = React.createClass({
    displayName: 'NumPeopleContent',

    getInitialState() {
        return _.assign({
            numAdults: 1,
            numChildren: 1
        }, _.pick(ApplicationStore.getFormData(), ['areAdultsInAssistanceProgram', 'numAdults', 'numChildren']));
    },

    render() {
        return (
            <div className="num-people-selection-content">
                <div className="selectionHeader container">
                    <h2>Household Member Selection</h2>
                    <p>First start by selecting the number of people in your household. A household member includes anyone who is living with you and shares income and expenses, even if not related.
                        If you need to go back and make any changes please use the navigation on the top left, do not hit the back button as this will exit the application. Also if you need help
                        click the question mark at the top right for additional information.
                    </p>
                </div>
                <NumPeopleCard
                    header="Children"
                    helperText="Please select the number of children 18 and under and anyone who is over 18 and in grade 12 or below. A household is anyone who shares expenses and income. Anyone 18
                    and over but in grade 12 or below is considered a child."
                    imgSrc={ CHILD_ICON }
                    numSelected={this.state.numChildren}
                    onChange={numChildren => this.setState({numChildren})}
                >
                <div className="numberRow">
                    <div className="numberOne"><p>1</p></div>
                    <div className="numberEight"><p>8</p></div>
                </div>
                </NumPeopleCard>
                <NumPeopleCard
                    header="Adults"
                    helperText="Please select the number of adult household members including yourself. DO NOT count any household members already included in the above section."
                    imgSrc={ ADULT_ICON }
                    numSelected={this.state.numAdults}
                    onChange={numAdults => this.setState({numAdults})}
                >
                    <div className="numberRow">
                        <div className="numberOne"><p>1</p></div>
                        <div className="numberEight"><p>8</p></div>
                    </div>
                    <div className="assistanceBox">
                        <Checkbox checked={ !!this.state.areAdultsInAssistanceProgram } onChange={e => this.setState({areAdultsInAssistanceProgram: e.target.checked})} ripple />
                        <p>Check if any household members currently participate in either the SNAP, TANF, or FDPIR assistance programs.</p>
                    </div>
                </NumPeopleCard>
                <div className="bottomNav container">
                    <Button className="buttonRight" raised accent ripple onClick={() => navigateForward(this.state)}>Next</Button>
                </div>
            </div>
        );
    }
});
