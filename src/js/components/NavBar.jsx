var _ = require('lodash');
var React = require('react');
var ApplicationStore = require('../stores/ApplicationStore');
var { navigateTo } = require('../utils/ActionCreator');
var { ADULT_ICON, CHILD_ICON, STEPS } = require('../utils/Util');
var { Badge } = require('react-mdl');

module.exports = React.createClass({
    displayName: 'NavBar',

    render() {
        var segments = _(ApplicationStore.getVisitedSteps()).map(step => {
            switch(step){
                case STEPS.APPLICANT_INFO:
                    return [

                        this._generateStepCell(<Badge text="4"> Applicant Information</Badge>, step),
                        this._generateStepCell(this._generateIcons(ApplicationStore.getFormData().numChildren), step)
                    ];
                case STEPS.ASSISTANCE_PROGRAM:
                    return this._generateStepCell('Assistance Program', step);
                case STEPS.INCOME_INFO:
                    return [
                        this._generateStepCell('Income and Adult Information', step),
                        this._generateStepCell(this._generateIcons(ApplicationStore.getFormData().numAdults), step)
                    ];
                case STEPS.NUM_PEOPLE:
                    return this._generateStepCell('Applicant and Adults', step);

            }
        }).flatten().value();

        return <div className="nav-bar"><table><tbody><tr>{ segments }</tr></tbody></table></div>;
    },

    _generateIcons(num) {
        return _.map(_.range(num), index => <Badge text="1">index</Badge>);
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
