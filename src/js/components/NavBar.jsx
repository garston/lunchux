var _ = require('lodash');
var React = require('react');
var { Paper} = require('material-ui');
var { Badge, Icon, Button,Dialog, DialogTitle, DialogContent,DialogActions  } = require('react-mdl');
var ApplicationStore = require('../stores/ApplicationStore');
var { navigateTo } = require('../utils/ActionCreator');
var { STEPS } = require('../utils/Util');

module.exports = React.createClass({
    displayName: 'NavBar',

    render() {
        var { numAdults, numChildren } = ApplicationStore.getFormData();
        var segments = _(ApplicationStore.getVisitedSteps()).map(step => {
            switch(step){
                case STEPS.APPLICANT_INFO:
                    return this._generateStepCell('Children', step, numChildren);
                case STEPS.ASSISTANCE_PROGRAM:
                    return this._generateStepCell('Assistance Program', step);
                case STEPS.INCOME_INFO:
                    return this._generateStepCell('Income and Adults', step, numAdults);
                case STEPS.NUM_PEOPLE:
                    return this._generateStepCell('Household Member Selection', step);
                case STEPS.REVIEW_SUBMIT:
                    return this._generateStepCell('Review / Submit', step);
            }
        }).flatten().value();

        return <Paper zDepth={1}><div className="nav-bar"><div className="navTop"><p>Lunchbox Application</p><Icon name="help"/></div>
                <div className="navSection"><table><tbody><tr>{ segments }</tr></tbody></table></div></div></Paper>;
    },

    _generateStepCell(content, step, num) {
        var tdProps = {
            className: `page-step${step === ApplicationStore.getStep() ? ' active-step' : ''}`,
            key: step,
            onClick: () => navigateTo(step)
        };
        var badge = _.isNumber(num) && <Badge text={ num } >&nbsp;</Badge>;
        return <td { ...tdProps }>{ content }{ badge }</td>;
    }
});
