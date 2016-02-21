var _ = require('lodash');
var React = require('react');
var { Button, IconToggle } = require('react-mdl');

module.exports = React.createClass({
    displayName: 'WordCheckboxTable',
    propTypes: {
        getCheckboxValue: React.PropTypes.func.isRequired,
        labelStateKeyPairs: React.PropTypes.array.isRequired,
        onCheckboxChange: React.PropTypes.func.isRequired
    },

    render() {
        var rows = _(this.props.labelStateKeyPairs).
            map((label, index, arr) => index % 2 === 0 && ({ label, stateKey: arr[index+1] })).
            compact().
            map(({ label, stateKey }, index) => (
                <tr key={'word-checkbox-row' + index}>
                    <td><IconToggle ripple name="format_bold" checked={ this.props.getCheckboxValue(stateKey) } onChange={e => this.props.onCheckboxChange(stateKey, e.target.checked)}/></td>
                    <td><Button ripple checked={ this.props.getCheckboxValue(stateKey) } onChange={e => this.props.onCheckboxChange(stateKey, e.target.checked)}>{ label }</Button></td>
                </tr>
            )).
            value();
        return <table><tbody>{ rows }</tbody></table>;
    }
});
