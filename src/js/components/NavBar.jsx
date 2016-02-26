var _ = require('lodash');
var React = require('react');
var { Badge } = require('material-ui');
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
                case STEPS.REVIEW_SUBMIT:
                    return this._generatePageStep('Review / Submit', step);
            }
        }).flatten().value();

        return <div className="nav-bar"><div className="navTop"><div><p>Lunchboc Application</p></div><div className="material-icons orange600"></div></div>
                <table className="navSection"><tbody><tr>{ segments }</tr></tbody></table></div>;
    },

    _generateIconStep(num, imgSrc, step) {
        return <td className='icon-step' key={ `${step}-icons` }><img src={ imgSrc } /><Badge badgeContent={ num }>&nbsp;</Badge></td>;
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
