import { Validation } from 'isomorphic-validation';
import { firstInvalid, applyOutline } from 'isomorphic-validation/ui';
import isAlpha from 'validator/es/lib/isAlpha';
import isStrongPassword from 'validator/es/lib/isStrongPassword';

const isLongerThan = (num) => (value) => value.length > num;

const isAlphaMsg = 'Must contain only letter characters.';
const isLongerThan1Msg = 'Must be at least 2 characters long.';
const isStrongPasswordMsg = 'Min. 8 symbols, 1 capital letter, 1 number, 1 special symbol.';

const showErrors = (validationResult) => {
    const [field, validator] = firstInvalid(validationResult);
    field.nextElementSibling.innerHTML = `<div>❗ ${validator.msg}</div>`;
};

const clearErrors = (validationResult) => {
    const [[field]] = validationResult;
    field.nextElementSibling.innerHTML = '';
};

const { firstName, lastName,  password, submitBtn } = document.form;

const validation = Validation.group(

    Validation.group( Validation(firstName), Validation(lastName) )
        .constraint(isAlpha, { msg: isAlphaMsg })
        .constraint(isLongerThan(1), { msg: isLongerThan1Msg }),

    Validation(password)
        .constraint(isStrongPassword, { msg: isStrongPasswordMsg }),
);

[...validation.validations[0].validations, validation.validations[1]].forEach(
    fieldValidation => fieldValidation
        .valid(clearErrors)
        .invalid(showErrors)
        .validated(applyOutline())
);

document.form.addEventListener('focusout', validation);

submitBtn.addEventListener('click', (event) => {
    event.preventDefault();

    if (!validation.isValid) {
        const [field] = firstInvalid(validation.constraints);
        field.focus();
    };
});