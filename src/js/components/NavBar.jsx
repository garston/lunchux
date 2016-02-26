var _ = require('lodash');
var React = require('react');
var { Paper} = require('material-ui');
var { Badge } = require('react-mdl');
var ApplicationStore = require('../stores/ApplicationStore');
var { navigateTo } = require('../utils/ActionCreator');
var { ADULT_ICON, CHILD_ICON, STEPS } = require('../utils/Util');

module.exports = React.createClass({
    displayName: 'NavBar',

    render() {
        var { numAdults, numChildren } = ApplicationStore.getFormData();
        var segments = _(ApplicationStore.getVisitedSteps()).map(step => {
            switch(step){
                case STEPS.APPLICANT_INFO:
                    return this._generateIconStep('Applicant Information', step, numChildren, CHILD_ICON);
                case STEPS.ASSISTANCE_PROGRAM:
                    return this._generatePageStep('Assistance Program', step);
                case STEPS.INCOME_INFO:
                    return this._generateIconStep('Income and Adult Information', step, numAdults, ADULT_ICON);
                case STEPS.NUM_PEOPLE:
                    return this._generatePageStep('Applicant and Adults', step);
                case STEPS.REVIEW_SUBMIT:
                    return this._generatePageStep('Review / Submit', step);
            }
        }).flatten().value();

        return <Paper zDepth={1}><div className="nav-bar"><div className="navTop"><p>Lunchbox Application</p></div>
                <div className="navSection"><table><tbody><tr>{ segments }</tr></tbody></table></div></div></Paper>;
    },

    _generateIconStep(content, step, num, imgSrc) {
        var props = {
            className: `page-step${step === ApplicationStore.getStep() ? ' active-step' : ''}`,
            key: step,
            onClick: () => navigateTo(step)
        };
        return <td { ...props }>{ content }<img src={ imgSrc } /><Badge text={ num } >&nbsp;</Badge></td>;
    },

    _generatePageStep(content, step) {
        var props = {
            className: `page-step${step === ApplicationStore.getStep() ? ' active-step' : ''}`,
            key: step,
            onClick: () => navigateTo(step)
        };
        return <td { ...props }>{ content }</td>;
    }
});
