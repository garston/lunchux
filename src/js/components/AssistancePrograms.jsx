var _ = require('lodash');
var React = require('react');
var { Button, Card, CardText, Checkbox, Textfield } = require('react-mdl');
var { navigateForward } = require('../utils/ActionCreator');

module.exports = React.createClass({
    displayName: 'AssistancePrograms',

    getInitialState() {
        return {
            fdpir: false,
            fdpirNumber: undefined,
            tanf: false,
            tanfNumber: undefined,
            snap: false,
            snapNumber: undefined
        };
    },

    render() {
        var cardRows = _.map(['snap', 'tanf', 'fdpir'], stateKey => {
            return (
                <tr key={stateKey + '-assistance-program-row'}>
                    <td><Checkbox onChange={e => this.setState({ [stateKey]: e.target.checked })} /></td>
                    <td>{ stateKey.toUpperCase() }</td>
                    <td><Textfield label="Case Number" onChange={e => this.setState({ [ stateKey + 'Number' ]: e.target.value })} /></td>
                </tr>
            );
        });

        return (
            <div>
                <Card shadow={1}><CardText>
                    Please select applicable programs and enter case numbers
                    <table><tbody>
                        { cardRows }
                    </tbody></table>
                </CardText></Card>
                <Button onClick={() => navigateForward(this.state)}>Next</Button>
            </div>
        );
    }
});
