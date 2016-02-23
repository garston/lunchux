var _ = require('lodash');
var React = require('react');
var { Button, Card, CardText, Checkbox, Textfield } = require('react-mdl');
var ApplicationStore = require('../stores/ApplicationStore');
var { navigateForward } = require('../utils/ActionCreator');

var caseNumPattern = '^[0-9a-zA-Z]+$';
var caseNumRegEx = new RegExp(caseNumPattern);
var getNumberStateKey = stateKey => stateKey + 'Number';
var stateKeys = ['snap', 'tanf', 'fdpir'];

module.exports = React.createClass({
    displayName: 'AssistanceProgram',

    getInitialState() {
        return _.pick(ApplicationStore.getFormData(), ['fdpir', 'fdpirNumber', 'tanf', 'tanfNumber', 'snap', 'snapNumber']);
    },

    render() {
        var cardRows = _.map(stateKeys, stateKey => {
            return (
                <tr key={stateKey + '-assistance-program-row'}>
                    <td>
                        <Checkbox
                            checked={ !!this.state[stateKey] }
                            onChange={ e => this.setState(_.merge(this.getInitialState(), { [stateKey]: e.target.checked })) }
                        />
                    </td>
                    <td>{ stateKey.toUpperCase() }</td>
                    <td>
                        <Textfield
                            disabled={ !this.state[stateKey] }
                            error="Please enter only numbers and letters"
                            label="Case Number"
                            onChange={e => this.setState({ [getNumberStateKey(stateKey)]: e.target.value })}
                            pattern={ caseNumPattern }
                            value={ this.state[getNumberStateKey(stateKey)] }
                        />
                    </td>
                </tr>
            );
        });

        return (
            <div>
                <Card shadow={1}><CardText>
                    Please select the program and enter the case number
                    <table><tbody>
                        { cardRows }
                    </tbody></table>
                </CardText></Card>
                <div className="bottomNav container">
                    <Button className="buttonRight" raised accent ripple
                        disabled={ !_.some(stateKeys, stateKey => caseNumRegEx.test(this.state[getNumberStateKey(stateKey)])) }
                        onClick={() => navigateForward(this.state)}
                    >
                        Next
                    </Button>
                </div>
            </div>
        );
    }
});
