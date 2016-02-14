var React = require('react');
var { Button, Textfield } = require('react-mdl');

module.exports = React.createClass({
    displayName: 'Homepage',
    propTypes: {
        onGetStartedClick: React.PropTypes.func.isRequired
    },

    getInitialState() {
        return {
            firstName: undefined,
            lastName: undefined
        };
    },

    render() {
        return (
            <div>
                <div>School Lunch Application</div>
                <div>Please enter</div>
                <Textfield label="First Name" onChange={(e) => this.setState({firstName: e.target.value})} />
                <Textfield label="Last Name" onChange={(e) => this.setState({lastName: e.target.value})} />
                <Button disabled={!this.state.firstName || !this.state.lastName} onClick={() => this.props.onGetStartedClick(this.state.firstName, this.state.lastName)}>Get Started</Button>
            </div>
        );
    }
});
