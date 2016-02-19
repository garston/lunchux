var _ = require('lodash');
var React = require('react');
var { Checkbox } = require('react-mdl');

module.exports = React.createClass({
    displayName: 'LabelCheckboxTable',
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
                <tr key={'label-checkbox-row' + index}>
                    <td>{ label }</td>
                    <td><Checkbox checked={ this.props.getCheckboxValue(stateKey) } onChange={e => this.props.onCheckboxChange(stateKey, e.target.checked)} /></td>
                </tr>
            )).
            value();
        return <table><tbody>{ rows }</tbody></table>;
    }
});
