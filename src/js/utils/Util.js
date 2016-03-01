var keyMirror = require('keymirror');

var occurrencesPerYearByFrequency = {
    '2 Weeks': 26,
    Month: 12,
    Week: 52,
    Year: 1
};

module.exports = {
    ADULT_ICON: 'adult-02.png',
    ALL_NUMBERS_PATTERN: '^[0-9]+$',
    ALL_NUMBERS_REGEX: /^[0-9]+$/,
    CHILD_ICON: 'child-01.png',
    STEPS: keyMirror({
        APPLICANT_INFO: null,
        ASSISTANCE_PROGRAM: null,
        FORM_SUBMITTED: null,
        HOME: null,
        INCOME_INFO: null,
        NUM_PEOPLE: null,
        REVIEW_SUBMIT: null
    }),

    computeYearlyIncome: ({ frequency, grossIncome }) => grossIncome * occurrencesPerYearByFrequency[frequency]
};
