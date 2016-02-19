var React = require('react');
var { Button, Checkbox } = require('react-mdl');
var NumPeopleCard = require('./Card.jsx');
var { navigateForward } = require('../../utils/ActionCreator');

module.exports = React.createClass({
    displayName: 'NumPeopleContent',

    getInitialState() {
        return {
            areAdultsInAssistanceProgram: false,
            numAdults: 1,
            numChildren: 1
        };
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
                    imgSrc="child-01.png"
                    numSelected={this.state.numChildren}
                    onChange={numChildren => this.setState({numChildren})}
                />
                <NumPeopleCard
                    header="Adults"
                    helperText="Please select the number of adults in your household that share income and expenses."
                    imgSrc="adult.png"
                    numSelected={this.state.numAdults}
                    onChange={numAdults => this.setState({numAdults})}
                >
                    <div className="assistanceBox">
                        <Checkbox ripple onChange={e => this.setState({areAdultsInAssistanceProgram: e.target.checked})} />
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
