var React = require('react');
var { Textfield } = require('react-mdl');

module.exports = React.createClass({
    displayName: 'IconNamesTable',
    propTypes: {
        firstName: React.PropTypes.string,
        icon: React.PropTypes.string.isRequired,
        lastName: React.PropTypes.string,
        middleInitial: React.PropTypes.string,
        onChange: React.PropTypes.func.isRequired
    },

    render() {
        var { firstName, icon, lastName, middleInitial, onChange } = this.props;
        return (
            <table className="icon-names-table"><tbody>
                <tr>
                    <td rowSpan="2"><img src={ icon } /></td>
                    <td><Textfield floatingLabel label="First Name" className ="firstName" onChange={e => onChange(e.target.value, 'firstName')} value={ firstName } /></td>
                    <td><Textfield floatingLabel label="MI" className ="middleIn" maxLength="1" onChange={e => onChange(e.target.value, 'middleInitial')} value={ middleInitial } /></td>
                </tr><tr>
                    <td colSpan="2"><Textfield floatingLabel label="Last Name" className ="lastName" onChange={e => onChange(e.target.value, 'lastName')} value={ lastName } /></td>
                </tr>
            </tbody></table>
        );
    }
});
