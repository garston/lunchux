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
            <div className="homepage">
                <div className="heroImage">
                    <div className="image">
                        <img src="hero.jpg"/>
                    </div>
                    <div className="heroContainer">
                        <div className="title">School Lunch Application</div>
                        <div className="intro"><p>Welcome to the </p></div>
                    </div>
                </div>
                <div className="nameSelection">
                    <div className="nameContainer">
                        <p>To start please fill out your name below to start the application</p>
                        <Textfield label="First Name" floatingLabel onChange={(e) => this.setState({firstName: e.target.value})} style={{width: '300px'}}/>
                        <Textfield label="Last Name" floatingLabel onChange={(e) => this.setState({lastName: e.target.value})} style={{width: '300px', marginLeft:"30px"}} />
                        <Button raised ripple disabled={!this.state.firstName || !this.state.lastName} onClick={() => this.props.onGetStartedClick(this.state.firstName, this.state.lastName)}>Get Started</Button>
                    </div>
                </div>
            </div>
        );
    }
});
