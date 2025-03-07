import { Validation } from "isomorphic-validation";
import { applyAccess, applyBackground } from 'isomorphic-validation/ui';

// predicate functions
const isOnlyLetters = (value) => /^[A-Za-z]+$/.test(value);
const isNaturalNumber = (value) => /^[1-9]+[0-9]*$/.test(value);
const isLessOrEqual = (number) => (value) => Number(value) <= Number(number);
const isGreaterOrEqual = (number) => (value) => Number(value) >= Number(number);
const isShorterThan = (number) => (value) => value.length < number;

const { firstName, lastName, age, secret, submitBtn } = document.form;

document.form.addEventListener(
    'input',
    Validation.group(

        Validation.group( 

            Validation(firstName)
                .validated(applyBackground()),

            Validation(lastName) 
                .validated(applyBackground()),
        )
        .constraint(isOnlyLetters),

        Validation(age, { optional: true })
            .constraint(isNaturalNumber)
            .constraint(isGreaterOrEqual(21))
            .constraint(isLessOrEqual(45))
            .validated(applyBackground()),

        Validation(secret)
            .constraint(isShorterThan(250))
            .validated(applyBackground()),
    )
    .changed(applyAccess(submitBtn))
);



