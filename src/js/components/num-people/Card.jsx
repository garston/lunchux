var _ = require('lodash');
var React = require('react');
var { Card, CardText, CardTitle } = require('react-mdl');

module.exports = React.createClass({
    displayName: 'NumPeopleCard',
    propTypes: {
        header: React.PropTypes.string.isRequired,
        helperText: React.PropTypes.string.isRequired,
        imgSrc: React.PropTypes.string.isRequired,
        numSelected: React.PropTypes.number.isRequired,
        onChange: React.PropTypes.func.isRequired
    },

    render() {
        var { header, helperText, imgSrc, numSelected, onChange } = this.props;

        var icons = _.map(_.range(8), index => {
            return <img
                className={'icon' + (index + 1 > numSelected ? ' not-selected' : '')}
                key={`icon-${index}`}
                onClick={() => onChange(index + 1)}
                src={imgSrc}
            />;
        });

        return (
            <Card>
                <CardTitle>{ header }</CardTitle>
                <CardText>
                    <table>
                        <tbody>
                            <tr>
                                <td>{ helperText }</td>
                                <td/>
                            </tr>
                            <tr>
                                <td>{ icons }</td>
                                <td><div className="icon-counter">{ numSelected }</div></td>
                            </tr>
                        </tbody>
                    </table>
                    { this.props.children }
                </CardText>
            </Card>
        );
    }
});
