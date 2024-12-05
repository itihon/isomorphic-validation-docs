import { Validation } from "isomorphic-validation";

const enableElement = (element) => ({isValid}) => element.disabled = !isValid;
const paintBackground = ({isValid,  target: { style }}) => 
    isValid 
        ? style.backgroundColor = '#e7ffe7' 
        : style.backgroundColor = '#ffe7e7';

// predicate functions
const isOnlyLetters = (value) => /^[A-Za-z]+$/.test(value);
const isNaturalNumber = (value) => /^[1-9]+[0-9]*$/.test(value);
const isLessOrEqual = (number) => (value) => Number(value) <= Number(number);
const isGreaterOrEqual = (number) => (value) => Number(value) >= Number(number);

const { firstName, lastName, age, submitBtn } = document.form;

document.form.addEventListener(
    'input',
    Validation.group(

        Validation.group( 

            Validation(firstName)
                .validated(paintBackground),

            Validation(lastName) 
                .validated(paintBackground),
        )
        .constraint(isOnlyLetters),

        Validation(age, { optional: true })
            .constraint(isNaturalNumber)
            .constraint(isGreaterOrEqual(21))
            .constraint(isLessOrEqual(45))
            .validated(paintBackground),
    )
    .changed(enableElement(submitBtn))
);



