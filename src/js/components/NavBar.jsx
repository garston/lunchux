var _ = require('lodash');
var React = require('react');
var ApplicationStore = require('../stores/ApplicationStore');
var { navigateTo } = require('../utils/ActionCreator');
var { STEPS } = require('../utils/Util');

module.exports = React.createClass({
    displayName: 'NavBar',

    render() {
        var segments = _(ApplicationStore.getVisitedSteps()).map(step => {
            switch(step){
                case STEPS.APPLICANT_INFO:
                    return [
                        <td className="page-step" key="applicant-info" onClick={() => navigateTo(STEPS.APPLICANT_INFO) }>Applicant Information</td>,
                        <td className="icon-step" key="child-icons">{ this._generateIcons(ApplicationStore.getFormData().numChildren, 'child-01.png') }</td>
                    ];
                case STEPS.ASSISTANCE_PROGRAM:
                    return <td className="page-step" key="assistance-program" onClick={() => navigateTo(STEPS.ASSISTANCE_PROGRAM) }>Assistance Program</td>;
                case STEPS.NUM_PEOPLE:
                    return <td className="page-step" key="num-people" onClick={() => navigateTo(STEPS.NUM_PEOPLE) }>Applicant and Adults</td>;
            }
        }).flatten().value();

        return <table className="nav-bar"><tbody><tr>{ segments }</tr></tbody></table>;
    },

    _generateIcons(num, imgSrc) {
        return _.map(_.range(num), index => <img key={ index } src={ imgSrc } />);
    }
});
