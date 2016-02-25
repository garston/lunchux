var _ = require('lodash');
var React = require('react');
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
                    return [
                        this._generatePageStep('Applicant Information', step),
                        this._generateIconStep(numChildren, CHILD_ICON, step)
                    ];
                case STEPS.ASSISTANCE_PROGRAM:
                    return this._generatePageStep('Assistance Program', step);
                case STEPS.INCOME_INFO:
                    return [
                        this._generatePageStep('Income and Adult Information', step),
                        this._generateIconStep(numAdults, ADULT_ICON, step)
                    ];
                case STEPS.NUM_PEOPLE:
                    return this._generatePageStep('Applicant and Adults', step);
            }
        }).flatten().value();

        return <div className="nav-bar"><table><tbody><tr>{ segments }</tr></tbody></table></div>;
    },

    _generateIconStep(num, imgSrc, step) {
        return <td className='icon-step' key={ `${step}-icons` }><img src={ imgSrc } /><Badge text={ num }>&nbsp;</Badge></td>;
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
