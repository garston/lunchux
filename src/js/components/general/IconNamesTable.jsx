var React = require('react');
var { Textfield } = require('react-mdl');

module.exports = React.createClass({
    displayName: 'IconNamesTable',
    propTypes: {
        firstName: React.PropTypes.string,
        icon: React.PropTypes.string.isRequired,
        iconText: React.PropTypes.string.isRequired,
        lastName: React.PropTypes.string,
        onChange: React.PropTypes.func.isRequired
    },

    render() {
        var { firstName, icon, iconText, lastName, onChange } = this.props;
        return (
            <table className="icon-names-table"><tbody>
                <tr>
                    <td rowSpan="2">
                        <img src={ icon } /><br/>
                        { iconText }
                    </td>
                    <td><Textfield floatingLabel label="First Name" onChange={e => onChange(e.target.value, 'firstName')} value={ firstName } /></td>
                </tr><tr>
                    <td><Textfield floatingLabel label="Last Name" onChange={e => onChange(e.target.value, 'lastName')} value={ lastName } /></td>
                </tr>
            </tbody></table>
        );
    }
});
