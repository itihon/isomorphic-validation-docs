import { Validation } from 'isomorphic-validation';

const { age, experience, submitBtn } = document.form;
const GRAY = '#b0b0b0', GREEN = '#b0ffb0', RED = '#ffb0b0';
const paintField = (color) =>  ({target}) => { target.style.backgroundColor = color; };
const enableElement = (element) => ({isValid}) => element.disabled = !isValid;
const clearInput = (input) => () => input.value = '';

// predicate functions
const isNaturalNumber = (value) => /^[1-9]+[0-9]*$/.test(value);
const isLessOrEqual = (number) => (value) => Number(value) <= Number(number);
const isGreaterOrEqual = (number) => (value) => Number(value) >= Number(number);
const isCareerYears = (value) => 21 < value && value < 60;
const isPossibleExperience = (age, experience) => experience <= age - 21;
const isInitValue = (value) => value === '';

// adding constraints

const ageV = Validation(age)
    .constraint(isNaturalNumber)
    .constraint(isGreaterOrEqual(16))
    .constraint(isLessOrEqual(60));

const experienceV = Validation(experience, { optional: true })
    .constraint(isNaturalNumber);

Validation.glue(Validation(age), experienceV) // "glued" to an auxiliary validation object
    .constraint(isPossibleExperience);

// side effects

const formV = Validation.group(ageV, experienceV)
    .changed(enableElement(submitBtn))  // enable/disable submit button
    .error(console.log);

const careerYearsV = Validation(age)
    .constraint(isCareerYears)
    .invalid(clearInput(experience))    // clear "experience" field if age is not in range
    .changed(enableElement(experience)) // enable/disable "experience" field
    .validated(() => experienceV());    // revalidate "experience" field after age gets validated

const initValueV = Validation.group(
    [
        Validation(age, { optional: true }),               // initial value is invalid for non-optional validations
        Validation(experience, { optional: true }),        // initial value is invalid for non-optional validations
    ]
    .map(validation => validation.valid(paintField(GRAY))) // paint a field gray if it is empty
)
.constraint(isInitValue);

formV.validations.forEach(
    validation => validation   
        .valid(paintField(GREEN))       // paint a field green if it contains valid data
        .invalid(paintField(RED))       // otherwise paint a field red
        .validated(initValueV)          // check if a field is empty
);

ageV.validated(careerYearsV);           // check career years after age gets validated

document.form.addEventListener('input', formV);

paintField(GRAY)({ target: age });          // initial field paint
paintField(GRAY)({ target: experience });   // initial field paint
