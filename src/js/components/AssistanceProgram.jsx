var _ = require('lodash');
var React = require('react');
var { Button, Card, CardText, CardTitle, Checkbox, Textfield } = require('react-mdl');
var ApplicationStore = require('../stores/ApplicationStore');
var { navigateForward } = require('../utils/ActionCreator');

var caseNumPattern = '^[0-9a-zA-Z]+$';
var caseNumRegEx = new RegExp(caseNumPattern);

module.exports = React.createClass({
    displayName: 'AssistanceProgram',

    getInitialState() {
        return _.pick(ApplicationStore.getFormData(), ['assistanceProgram', 'assistanceProgramNumber']);
    },

    render() {
        var cardRows = _.map(['SNAP', 'TANF', 'FDPIR'], assistanceProgram => {
            var isSelectedProgram = this.state.assistanceProgram === assistanceProgram;
            return (
                <tr key={assistanceProgram + '-assistance-program-row'}>
                    <td>
                        <Checkbox
                            checked={ isSelectedProgram }
                            onChange={ e => this.setState({ assistanceProgram: e.target.checked ? assistanceProgram : '', assistanceProgramNumber: '' }) }
                        />
                    </td>
                    <td>{ assistanceProgram }</td>
                    <td>
                        <Textfield floatingLabel
                            disabled={ !isSelectedProgram }
                            error="Please enter only numbers and letters"
                            label="Case Number"
                            onChange={e => this.setState({ assistanceProgramNumber: e.target.value })}
                            pattern={ caseNumPattern }
                            value={ isSelectedProgram ? this.state.assistanceProgramNumber : '' }
                        />
                    </td>
                </tr>
            );
        });

        return (
            <div className="assistanceProgram">
                <div className="selectionHeader container"><h2>Assistance Program Selection</h2></div>
                <Card shadow={1}>
                    <CardTitle><h2>Please select the program and enter the case number</h2></CardTitle>
                    <CardText>
                    <table><tbody>
                        { cardRows }
                    </tbody></table>
                </CardText></Card>
                <div className="bottomNav container">
                    <Button className="buttonRight" raised accent ripple
                        disabled={ !this.state.assistanceProgramNumber || !caseNumRegEx.test(this.state.assistanceProgramNumber) }
                        onClick={() => navigateForward(this.state)}
                    >
                        Next
                    </Button>
                </div>
            </div>
        );
    }
});
