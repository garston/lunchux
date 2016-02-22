var React = require('react');
var { Textfield } = require('react-mdl');
var HorizontalBoxSelector = require('../general/HorizontalBoxSelector.jsx');
var { ALL_NUMBERS_PATTERN, ALL_NUMBERS_REGEX } = require('../../utils/Util');

var allowedFrequencies = ['Week', '2 Weeks', 'Month'];
var occurrencesPerYearByFrequency = {
    Month: 12,
    '2 Weeks': 26,
    Week: 52
};

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
                        pattern={ ALL_NUMBERS_PATTERN }
                        value={ grossIncome }
                    />
                </td>
                <td>Every</td>
                <td>
                    <HorizontalBoxSelector
                        allowedValues={ allowedFrequencies }
                        onClick={ value => onChange('frequency', value) }
                        selectedValues={ [frequency] }
                    />
                </td>
                <td>{ ALL_NUMBERS_REGEX.test(grossIncome) && frequency ? `$${grossIncome * occurrencesPerYearByFrequency[frequency]}/year` : '' }</td>
            </tr>
        );
    }
});
