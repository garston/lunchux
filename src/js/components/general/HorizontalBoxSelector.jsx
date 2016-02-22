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
        var { allowedValues, onClick, selectedValues } = this.props;
        var boxes = _.map(allowedValues, value => {
            var isSelected = _.contains(selectedValues, value);
            return (
                <td
                    className={ isSelected ? 'selected' : '' }
                    key={ 'box-' + value }
                    onClick={ () => onClick(value) }
                >
                        { value }
                </td>
            );
        });
        return <table className="horizontal-box-selector"><tbody><tr>{ boxes }</tr></tbody></table>;
    }
});
