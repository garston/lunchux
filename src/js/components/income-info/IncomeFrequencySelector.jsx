var _ = require('lodash');
var React = require('react');

module.exports = React.createClass({
    displayName: 'IncomeFrequencySelector',
    propTypes: {
        onChange: React.PropTypes.func.isRequired,
        value: React.PropTypes.string
    },

    render() {
        var boxes = _.map([{pretty: 'Week', val: 'weekly'}, {pretty: '2 Weeks', val: 'biweekly'}, {pretty: 'Month', val: 'monthly'}], ({ pretty, val }) => {
            return <td className={ this.props.value === val ? 'selected' : '' } key={ 'box-' + val } onClick={() => this.props.onChange(val)}>{ pretty }</td>;
        });
        return <table className="income-freq-selector"><tbody><tr>{ boxes }</tr></tbody></table>;
    }
});
