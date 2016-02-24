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
                        this._generateStepCell('Applicant Information', step),
                        this._generateStepCell(this._generateIcons(ApplicationStore.getFormData().numChildren, CHILD_ICON), step)
                    ];
                case STEPS.ASSISTANCE_PROGRAM:
                    return this._generateStepCell('Assistance Program', step);
                case STEPS.INCOME_INFO:
                    return [
                        this._generateStepCell('Income and Adult Information', step),
                        this._generateStepCell(this._generateIcons(ApplicationStore.getFormData().numAdults, ADULT_ICON), step)
                    ];
                case STEPS.NUM_PEOPLE:
                    return this._generateStepCell('Applicant and Adults', step);
            }
        }).flatten().value();

        return <table className="nav-bar"><tbody><tr>{ segments }</tr></tbody></table>;
    },

    _generateIcons(num, imgSrc) {
        return _.map(_.range(num), index => <img key={ 'icon-' + index } src={ imgSrc } />);
    },

    _generateStepCell(content, step) {
        var props = _.isString(content) ? {
            className: `page-step${step === ApplicationStore.getStep() ? ' active-step' : ''}`,
            key: step,
            onClick: () => navigateTo(step)
        } : {
            className: 'icon-step',
            key: `${step}-icons`
        };
        return <td { ...props }>{ content }</td>;
    }
});
