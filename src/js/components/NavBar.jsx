var _ = require('lodash');
var React = require('react');
var ApplicationStore = require('../stores/ApplicationStore');
var { STEPS } = require('../utils/Util');

module.exports = React.createClass({
    displayName: 'NavBar',

    render() {
        var segments = [];
        switch(ApplicationStore.getStep()){
            case STEPS.ASSISTANCE_PROGRAM:
                segments = [
                    <td className="icon-step" key="child-icons">{ this._generateIcons(ApplicationStore.getFormData().numChildren, 'child-01.png') }</td>,
                    <td className="page-step" key="assistance-program">Assistance Program</td>
                ].concat(segments);
            case STEPS.APPLICANT_INFO:
                segments = [<td className="page-step" key="applicant-info">Applicant Information</td>].concat(segments);
            case STEPS.NUM_PEOPLE:
                segments = [<td className="page-step" key="num-people">Applicant and Adults</td>].concat(segments);
        }

        return <table className="nav-bar"><tbody><tr>{ segments }</tr></tbody></table>;
    },

    _generateIcons(num, imgSrc) {
        return _.map(_.range(num), index => <img key={ index } src={ imgSrc } />);
    }
});
