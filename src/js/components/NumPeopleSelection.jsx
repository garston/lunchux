var _ = require('lodash');
var React = require('react');
var { Button, Card, CardText, CardTitle, Checkbox } = require('react-mdl');

module.exports = React.createClass({
    displayName: 'NumPeopleSelection',

    getInitialState() {
        return {
            areAdultsInAssistanceProgram: false,
            numAdults: 1,
            numChildren: 1
        };
    },

    render() {
        return (
            <div className="num-people-selection-page">
                <div>Lets get started</div>
                <div>Please start by selecting how many applicants and adults are in your household. Please select only those that share income and expenses.</div>
                <Card>
                    <CardTitle>Children</CardTitle>
                    <CardText>Please select the number of children 18 and under and anyone who is over 18 and in grade 12 or below. A household is anyone who shares expenses and income.</CardText>
                    { this.generateIconCounterRow('numChildren', 'baby.png') }
                </Card>
                <Card>
                    <CardTitle>Adults</CardTitle>
                    <CardText>Please select the number of adults in your household that share income and expenses.</CardText>
                    { this.generateIconCounterRow('numAdults', 'adult.png') }
                    <Checkbox onChange={(e) => this.setState({areAdultsInAssistanceProgram: e.target.value})} />Check if any adults are in the assistance programs SNAP, TANF, FDPIR
                </Card>
                <Button>Next</Button>
            </div>
        );
    },

    generateIconCounterRow(stateFieldName, imgSrc) {
        return _.map(_.range(8), index => {
            return <img
                className={'icon' + (index + 1 > this.state[stateFieldName] ? ' not-selected' : '')}
                key={`${stateFieldName}-icon-${index}`}
                onClick={() => this.setState({ [stateFieldName]: index + 1 })}
                src={imgSrc}
            />;
        }).concat(<div className="icon-counter" key={`${stateFieldName}-icon-counter`}>{ this.state[stateFieldName] }</div>);
    }
});
