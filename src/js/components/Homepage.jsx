var React = require('react');
var { Button, Textfield } = require('react-mdl');
var { navigateForward } = require('../utils/ActionCreator');
var { Paper} = require('material-ui');

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
                </div>
                <div className="start">
                    <div className="heroContainer">
                        <h1>School Meals Application</h1>
                        <h3>Welcome to the online application to apply for free or reduced price school meals. You only need to fill out one application per household even if your children attend different schools.
                            <br />
                            <br />
                            Please read the instructions carefully and fill out the information to the best of your knowledge.
                            This form must be completed by an adult in your household. To get started please enter your name below. </h3>
                    </div>
                    <Paper zDepth={2}>
                    <div className="nameContainer">

                        <Textfield floatingLabel label="First Name" onChange={e => this.setState({firstName: e.target.value})} style={{width: '300px'}}/>
                        <Textfield floatingLabel label="Last Name" onChange={e => this.setState({lastName: e.target.value})} style={{width: '300px', marginLeft:"30px"}} />
                        <Button accent raised ripple disabled={!this.state.firstName || !this.state.lastName} onClick={() => navigateForward(this.state)}>Get Started</Button>

                    </div>
                    </Paper>
                </div>

            </div>
        );
    }
});
