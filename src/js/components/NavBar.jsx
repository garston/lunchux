var _ = require('lodash');
var React = require('react');
var ApplicationStore = require('../stores/ApplicationStore');
var { navigateTo } = require('../utils/ActionCreator');
var { ADULT_ICON, CHILD_ICON, STEPS } = require('../utils/Util');

module.exports = React.createClass({
    displayName: 'NavBar',

    render() {
        var segments = _(ApplicationStore.getVisitedSteps()).map(step => {
            switch(step){
                case STEPS.APPLICANT_INFO:
                    return [
                        <td className="page-step" key="applicant-info" onClick={() => navigateTo(step) }>Applicant Information</td>,
                        <td className="icon-step" key="child-icons">{ this._generateIcons(ApplicationStore.getFormData().numChildren, CHILD_ICON) }</td>
                    ];
                case STEPS.ASSISTANCE_PROGRAM:
                    return <td className="page-step" key="assistance-program" onClick={() => navigateTo(step) }>Assistance Program</td>;
                case STEPS.INCOME_INFO:
                    return [
                        <td className="page-step" key="income-info" onClick={() => navigateTo(step) }>Income and Adult Information</td>,
                        <td className="icon-step" key="adult-icons">{ this._generateIcons(ApplicationStore.getFormData().numAdults, ADULT_ICON) }</td>
                    ];
                case STEPS.NUM_PEOPLE:
                    return <td className="page-step" key="num-people" onClick={() => navigateTo(step) }>Applicant and Adults</td>;
            }
        }).flatten().value();

        return <table className="nav-bar"><tbody><tr>{ segments }</tr></tbody></table>;
    },

    _generateIcons(num, imgSrc) {
        return _.map(_.range(num), index => <img key={ index } src={ imgSrc } />);
    }
});
