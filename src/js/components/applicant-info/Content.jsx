var _ = require('lodash');
var React = require('react');
var { Button } = require('react-mdl');
var ApplicantInfoCard = require('./Card.jsx');
var { navigateForward } = require('../../utils/ActionCreator');

module.exports = React.createClass({
    displayName: 'ApplicantInfoContent',
    propTypes: {
        numApplicants: React.PropTypes.number.isRequired
    },

    getInitialState() {
        return {
            areApplicantsValid: this._eachApplicant(() => false)
        };
    },

    render() {
        var applicantInfoCards = this._eachApplicant(index => {
            return <ApplicantInfoCard
                applicantIndex={ index }
                key={ 'applicantInfoCard' + index }
                onRequiredFieldChange={ isValid => this.setState({
                    areApplicantsValid: this.state.areApplicantsValid.map((currentValue, updateIndex) => index === updateIndex ? isValid : currentValue)
                })}
                ref={ 'applicantInfoCard' + index }
            />;
        });

        return (
            <div className="applicant-info-content">
                <div className="container">Applicant Info</div>
                { applicantInfoCards }
                <div className="bottomNav container">
                    <Button className="buttonRight" raised ripple
                        disabled={ _.some(this.state.areApplicantsValid, isValid => !isValid) }
                        onClick={() => navigateForward({ applicantInfos: this._eachApplicant(index => this.refs['applicantInfoCard' + index].getFormData()) })}
                    >
                        Next
                    </Button>
                </div>
            </div>
        );
    },

    _eachApplicant(fn) {
        return _.map(_.range(this.props.numApplicants), fn);
    }
});
