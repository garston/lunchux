var _ = require('lodash');
var React = require('react');
var { Paper} = require('material-ui');
var { Badge, IconButton, Menu, MenuItem, Button,Dialog, DialogTitle, DialogContent,DialogActions  } = require('react-mdl');
var ApplicationStore = require('../stores/ApplicationStore');
var { navigateTo } = require('../utils/ActionCreator');
var { STEPS } = require('../utils/Util');

module.exports = React.createClass({
    displayName: 'NavBar',

    componentDidUpdate() {
        React.findDOMNode(this).scrollIntoView();
    },

    render() {
        var { numAdults, numChildren } = ApplicationStore.getFormData();
        var segments = _(ApplicationStore.getVisitedSteps()).map(step => {
            switch(step){
                case STEPS.APPLICANT_INFO:
                    return this._generateStepCell('Child Information', step, numChildren);
                case STEPS.ASSISTANCE_PROGRAM:
                    return this._generateStepCell('Assistance Program', step);
                case STEPS.INCOME_INFO:
                    return this._generateStepCell('Income and Adult Information', step, numAdults);
                case STEPS.NUM_PEOPLE:
                    return this._generateStepCell('Household Member Selection', step);
                case STEPS.REVIEW_SUBMIT:
                    return this._generateStepCell('Review / Submit', step);
            }
        }).flatten().value();

        return <Paper zDepth={1}><div className="nav-bar">
            <div className="navTop">
                <p>Lunchbox Application</p>
                <div className="help">
                    <IconButton name="help" id="helpDropdown"/>
                    <Menu target="helpDropdown" align="right" valign="bottom"  ripple>
                        <li><h3>Household:</h3>
                            <p>A household member is anyone who shares income and expenses. Even if they are not related to yo
                            u they can still be counted as a household member. </p></li>
                        <li><h3>Foster, Homeless, Migrant, Runaway:</h3>
                            <p>Please check the appropriate box in the Child section. Are eligible for free meals.
                            </p></li>
                        <li><h3>SNAP, TANF, FDPIR:</h3>
                            <p>Call your local government department to obtain the the information about the program and to obtain case numbers.  </p></li>
                        <li><h3>Child Income:</h3>
                            <p>Only report money received from outside your household that is paid directly to your child. Example include income from work, social security, disability, pension or trust, or anyone outside the household who gives them money on a regular basis.
                            </p></li>
                        <li><h3>Foster, Homeless, Migrant, Runaway:</h3>
                            <p>Anyone can enter informaaskjdkas djalsdkjsalkd sgsgsdgdgsdg sdfs sdfdsfsf  </p></li>
                    </Menu>
                </div>
            </div>
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
