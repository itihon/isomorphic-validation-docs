import { Validation } from 'isomorphic-validation';

const { age, experience, submitBtn } = document.form;
const paintField = (color) => ([[field]]) => { field.style.backgroundColor = color; };
const paintFieldGray = paintField('#b0b0b0');
const paintFieldGreen = paintField('#b0ffb0');
const paintFieldRed = paintField('#ffb0b0');
const enableElement = (element) => ({isValid}) => element.disabled = !isValid;
const clearInput = (input) => () => input.value = '';

// predicate functions
const isNaturalNumber = (value) => /^[1-9]+[0-9]*$/.test(value);
const isLessOrEqual = (number) => (value) => Number(value) <= Number(number);
const isGreaterOrEqual = (number) => (value) => Number(value) >= Number(number);
const isCareerYears = (value) => 21 < value && value < 60;
const isPossibleExperience = (value) => value <= age.value - 21;
const isInitValue = (value) => value === '';

// adding constraints

const ageV = Validation(age)
    .constraint(isNaturalNumber)
    .constraint(isGreaterOrEqual(16))
    .constraint(isLessOrEqual(60));

const experienceV = Validation(experience, { optional: true })
    .constraint(isNaturalNumber)
    .constraint(isPossibleExperience);

// side effects

const formV = Validation.group(ageV, experienceV)
    .changed(enableElement(submitBtn)); // enable/disable the submit button

const careerYearsV = Validation(age)
    .constraint(isCareerYears)
    .invalid(clearInput(experience))    // clear "experience" field if age is not in range
    .changed(enableElement(experience)) // enable/disable "experience" field
    .validated(() => initValueV.validate(experience));    // revalidate "experience" field after age gets validated

const initValueV = Validation.group(
    [
        Validation(age, { optional: true }),        // initial value is invalid for non-optional validations
        Validation(experience, { optional: true }), // initial value is invalid for non-optional validations
    ]
    .map(
        validation => validation
            .valid(paintFieldGray)      // paint a field gray if it is empty
            .invalid(formV)             // otherwise validate against field constraints
    )
)
.constraint(isInitValue);

[ageV, experienceV].forEach(
    validation => validation
        .valid(paintFieldGreen)         // paint a field green if it contains valid data
        .invalid(paintFieldRed)         // paint a field red if it contains invalid data
);

ageV.validated(careerYearsV); // check career years after age gets validated

document.form.addEventListener('input', initValueV);

initValueV.validate(); // initial field paint