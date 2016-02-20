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
                    <h1>Lets get started</h1>
                    <p>Please start by selecting how many applicants and adults are in your household. Please select only those that share income and expenses.</p>
                </div>
                <NumPeopleCard
                    header="Children"
                    helperText="Please select the number of children 18 and under and anyone who is over 18 and in grade 12 or below. A household is anyone who shares expenses and income."
                    imgSrc={ CHILD_ICON }
                    numSelected={this.state.numChildren}
                    onChange={numChildren => this.setState({numChildren})}
                />
                <NumPeopleCard
                    header="Adults"
                    helperText="Please select the number of adults in your household that share income and expenses."
                    imgSrc={ ADULT_ICON }
                    numSelected={this.state.numAdults}
                    onChange={numAdults => this.setState({numAdults})}
                >
                    <div className="assistanceBox">
                        <Checkbox checked={ !!this.state.areAdultsInAssistanceProgram } onChange={e => this.setState({areAdultsInAssistanceProgram: e.target.checked})} ripple />
                        <p>Check if any adults are in the assistance programs SNAP, TANF, FDPIR</p>
                    </div>
                </NumPeopleCard>
                <div className="bottomNav container">
                    <Button className="buttonRight" raised ripple onClick={() => navigateForward(this.state)}>Next</Button>
                </div>
            </div>
        );
    }
});
