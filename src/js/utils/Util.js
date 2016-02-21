var keyMirror = require('keymirror');

module.exports = {
    ADULT_ICON: 'adult-02.png',
    CHILD_ICON: 'child-01.png',
    GROSS_INCOME_PATTERN: '^[0-9]+$',
    STEPS: keyMirror({
        APPLICANT_INFO: null,
        ASSISTANCE_PROGRAM: null,
        FORM_SUBMITTED: null,
        HOME: null,
        INCOME_INFO: null,
        NUM_PEOPLE: null
    })
};
