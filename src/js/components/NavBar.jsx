var _ = require('lodash');
var React = require('react');
var ApplicationStore = require('../stores/ApplicationStore');
var { navigateTo } = require('../utils/ActionCreator');
var { STEPS } = require('../utils/Util');

module.exports = React.createClass({
    displayName: 'NavBar',

    render() {
        var segments = [];
        switch(ApplicationStore.getStep()){
            case STEPS.ASSISTANCE_PROGRAM:
                segments = [
                    <td className="icon-step" key="child-icons">{ this._generateIcons(ApplicationStore.getFormData().numChildren, 'child-01.png') }</td>,
                    <td className="page-step" key="assistance-program" onClick={() => navigateTo(STEPS.ASSISTANCE_PROGRAM) }>Assistance Program</td>
                ].concat(segments);
            case STEPS.APPLICANT_INFO:
                segments = [<td className="page-step" key="applicant-info" onClick={() => navigateTo(STEPS.APPLICANT_INFO) }>Applicant Information</td>].concat(segments);
            case STEPS.NUM_PEOPLE:
                segments = [<td className="page-step" key="num-people" onClick={() => navigateTo(STEPS.NUM_PEOPLE) }>Applicant and Adults</td>].concat(segments);
        }

        return <table className="nav-bar"><tbody><tr>{ segments }</tr></tbody></table>;
    },

    _generateIcons(num, imgSrc) {
        return _.map(_.range(num), index => <img key={ index } src={ imgSrc } />);
    }
});
