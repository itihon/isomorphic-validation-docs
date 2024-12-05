import { Validation } from 'isomorphic-validation';

const { login, password, pwdconfirm, submitBtn } = document.form;
const GREEN = '#b0ffb0', GRAY = '#b0b0b0';

// side effects 
const paintField = (color, field) => { field.style.backgroundColor = color; };
const highlight = ({isValid, target}) => isValid ? paintField(GREEN, target) : paintField(GRAY, target);
const enableElement = (element) => ({isValid}) => element.disabled = !isValid;

// predicate functions
const areTwoEqual = (value1, value2) => value1 === value2;
const isLongerThan = (number) => (value) => value.length > number;

document.form.addEventListener(
    'input',
    Validation.group(

        Validation(login)
            .constraint(isLongerThan(2))
            .changed(highlight),

        Validation.glue( // "glue" password and password confirmation validations

            Validation(password)
                .constraint(isLongerThan(5))
                .changed(highlight),

            Validation(pwdconfirm)
                .constraint(isLongerThan(5))
                .changed(highlight),

        ).constraint(areTwoEqual) // accepts values from both fields

    ).changed(enableElement(submitBtn))
);

// initial paint
paintField(GRAY, login);
paintField(GRAY, password);
paintField(GRAY, pwdconfirm);