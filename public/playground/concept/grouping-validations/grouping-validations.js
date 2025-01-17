import { Validation } from 'isomorphic-validation';
import isAlpha from 'validator/es/lib/isAlpha';
import isStrongPassword from 'validator/es/lib/isStrongPassword';

const isLongerOrEqual = (min) => (value) => String(value).length >= min;
const isShorterOrEqual = (max) => (value) => String(value).length <= max;
const areTwoEqual = (value1, value2) => value1 === value2;

const { form } = document;
const { firstName, lastName, password, pwdConfirm, submitBtn } = form;
const constraints = form.querySelectorAll('.constraint');
const fields = form.querySelectorAll('.field');

// UI side effects

const showStatus = ({ classList }) => ({ isValid }) => {
    classList.remove(isValid ? 'invalid' : 'valid');
    classList.add(isValid ? 'valid' : 'invalid');
};

const toggleAccess = (element) => ({ isValid }) => { 
    element.disabled = !isValid; 
};

// group validations
const signupValidation = Validation.group(

    Validation.group( Validation(firstName), Validation(lastName) )
        .constraint(isAlpha)
        .constraint(isLongerOrEqual(2))
        .constraint(isShorterOrEqual(32)),

    Validation.glue(

        Validation(password)
            .constraint(isStrongPassword),

        Validation(pwdConfirm),

    ).constraint(areTwoEqual),
);

// side effect for the grouping validation
signupValidation.changed(toggleAccess(submitBtn));

// side effects for the grouped (nested) validations
const [ firstAndLastNameV, pwdV ] = signupValidation.validations;

[ ...firstAndLastNameV.validations, pwdV, pwdV ].forEach(
    (validation, idx) => validation
        .valid(showStatus(fields[idx]))
        .invalid(showStatus(fields[idx]))
);

// side effects for execution of the predicate functions
[...signupValidation.constraints].forEach(
    ([, validator], idx) => validator
        .valid(showStatus(constraints[idx]))
        .invalid(showStatus(constraints[idx]))
);

form.addEventListener('input', signupValidation);