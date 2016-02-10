const { Button, Input } = require('react-bootstrap');
const React = require('react');

module.exports = React.createClass({
    displayName: 'Homepage',
    propTypes: {
        onGetStartedClick: React.PropTypes.func.isRequired
    },

    getInitialState() {
        return {
            isValid: false
        };
    },

    render() {
        return (
            <div>
                <div>School Lunch Application</div>
                <div>Please enter</div>
                <Input onChange={this.onNameInputChange} ref="firstNameInput" type="text" />
                <Input onChange={this.onNameInputChange} ref="lastNameInput" type="text" />
                <Button bsStyle="primary" disabled={!this.state.isValid} onClick={this.onGetStartedButtonClick} ref="getStartedButton">Get Started</Button>
            </div>
        );
    },

    getFirstName() {
        return this.refs.firstNameInput.getValue();
    },

    getLastName() {
        return this.refs.lastNameInput.getValue();
    },

    onGetStartedButtonClick() {
        this.props.onGetStartedClick(this.getFirstName(), this.getLastName());
    },

    onNameInputChange() {
        this.setState({isValid: !!this.getFirstName() && !!this.getLastName()});
    }
});
