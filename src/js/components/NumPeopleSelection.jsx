var _ = require('lodash');
var React = require('react');
var { Button, Card, CardText, CardTitle, Checkbox } = require('react-mdl');
var { navigateForward } = require('../utils/ActionCreator');

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
                { this.generateCard({
                    header:'Children',
                    helperText: 'Please select the number of children 18 and under and anyone who is over 18 and in grade 12 or below. A household is anyone who shares expenses and income.',
                    imgSrc: 'baby.png',
                    stateFieldName: 'numChildren'
                }) }
                { this.generateCard({
                    additionalContent: (
                        <div>
                            <Checkbox onChange={e => this.setState({areAdultsInAssistanceProgram: e.target.checked})} />
                            Check if any adults are in the assistance programs SNAP, TANF, FDPIR
                        </div>
                    ),
                    header:'Adults',
                    helperText: 'Please select the number of adults in your household that share income and expenses.',
                    imgSrc: 'adult.png',
                    stateFieldName: 'numAdults'
                }) }
                <Button onClick={() => navigateForward(this.state)}>Next</Button>
            </div>
        );
    },

    generateCard({ additionalContent, header, helperText, imgSrc, stateFieldName }) {
        var icons = _.map(_.range(8), index => {
            return <img
                className={'icon' + (index + 1 > this.state[stateFieldName] ? ' not-selected' : '')}
                key={`${stateFieldName}-icon-${index}`}
                onClick={() => this.setState({ [stateFieldName]: index + 1 })}
                src={imgSrc}
            />;
        });

        return (
            <Card shadow={1}>
                <CardTitle>{header}</CardTitle>
                <CardText>
                    <table>
                        <tbody>
                            <tr>
                                <td>{ helperText }</td>
                                <td/>
                            </tr>
                            <tr>
                                <td>{ icons }</td>
                                <td><div className="icon-counter" key={`${stateFieldName}-icon-counter`}>{ this.state[stateFieldName] }</div></td>
                            </tr>
                        </tbody>
                    </table>
                    { additionalContent }
                </CardText>
            </Card>
        );
    }
});
