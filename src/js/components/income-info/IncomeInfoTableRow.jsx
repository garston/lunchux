var React = require('react');
var { Textfield } = require('react-mdl');
var IncomeFrequencySelector = require('./IncomeFrequencySelector.jsx');
var { GROSS_INCOME_PATTERN } = require('../../utils/Util');

module.exports = React.createClass({
    displayName: 'IncomeInfoTableRow',
    propTypes: {
        frequency: React.PropTypes.string,
        grossIncome: React.PropTypes.string,
        label: React.PropTypes.string.isRequired,
        onChange: React.PropTypes.func.isRequired
    },

    render() {
        var { frequency, grossIncome, label, onChange } = this.props;
        return (
            <tr>
                <td>{ label }</td>
                <td>
                    <Textfield
                        error="Please enter only numbers"
                        floatingLabel
                        label="Gross Income"
                        onChange={ e => onChange('grossIncome', e.target.value) }
                        pattern={ GROSS_INCOME_PATTERN }
                        value={ grossIncome }
                    />
                </td>
                <td>Every</td>
                <td><IncomeFrequencySelector onChange={ val => onChange('frequency', val) } value={ frequency } /></td>
            </tr>
        );
    }
});
