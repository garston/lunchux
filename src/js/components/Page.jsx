const Homepage = require('./Homepage.jsx')
const React = require('react');

module.exports = React.createClass({
    displayName: 'Page',

    render() {
        return <Homepage onGetStartedClick={this.getStarted} />;
    },

    getStarted(firstName, lastName) {
        console.log(firstName, lastName);
    }
});
