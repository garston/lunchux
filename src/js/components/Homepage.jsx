var React = require('react');
var { Button, Card, Textfield } = require('react-mdl');
var { navigateForward } = require('../utils/ActionCreator');

module.exports = React.createClass({
    displayName: 'Homepage',

    getInitialState() {
        return {};
    },

    render() {
        return (
            <div className="homepage">
                <div className="heroImage">
                    <div className="image">
                        <img src="hero.jpg"/>
                    </div>
                    <div className="heroContainer">
                        <div className="title"><h1>School Lunch Application</h1></div>
                        <div className="intro"><h3>t </h3></div>
                    </div>
                </div>
                <Card shadow={1}>
                    <div className="nameContainer">
                        <p>To start please fill out your name below to start the application</p>
                        <Textfield floatingLabel label="First Name" onChange={e => this.setState({firstName: e.target.value})} style={{width: '300px'}}/>
                        <Textfield floatingLabel label="Last Name" onChange={e => this.setState({lastName: e.target.value})} style={{width: '300px', marginLeft:"30px"}} />
                        <Button accent raised ripple disabled={!this.state.firstName || !this.state.lastName} onClick={() => navigateForward(this.state)}>Get Started</Button>
                    </div>
                </Card>
            </div>
        );
    }
});
