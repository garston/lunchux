var _ = require('lodash');
var React = require('react');

module.exports = React.createClass({
    displayName: 'HorizontalBoxSelector',
    propTypes: {
        allowedValues: React.PropTypes.array.isRequired,
        onClick: React.PropTypes.func.isRequired,
        selectedValues: React.PropTypes.array.isRequired
    },

    render() {
        var { allowedValues, onClick } = this.props;
        var boxes = _.map(allowedValues, value => {
            var isSelected = this._isSelected(value);
            return (
                <td
                    className={ isSelected ? 'selected' : '' }
                    key={ 'box-' + value }
                    onClick={ () => onClick(value, _(allowedValues).map(allowedValue => (allowedValue === value ? !isSelected : this._isSelected(allowedValue)) && allowedValue).compact().value()) }
                >
                        { value }
                </td>
            );
        });
        return <table className="horizontal-box-selector"><tbody><tr>{ boxes }</tr></tbody></table>;
    },

    _isSelected(value) {
        return _.contains(this.props.selectedValues, value);
    }
});
