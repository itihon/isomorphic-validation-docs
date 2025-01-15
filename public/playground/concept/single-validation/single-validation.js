import { Validation, Predicate } from 'isomorphic-validation';
import isAlpha from 'validator/es/lib/isAlpha';

const isLongerOrEqual = (min) => (value) => String(value).length >= min;
const isShorterOrEqual = (max) => (value) => String(value).length <= max;

// UI side effect
const showStatus = ({ classList }) => ({ isValid }) => {
    classList.remove(isValid ? 'invalid' : 'valid');
    classList.add(isValid ? 'valid' : 'invalid');
};

const { form } = document;
const { firstName } = form;
const firstNameConstraints = form.querySelectorAll('.constraint.firstName');

form.addEventListener(
    'input', 
    Validation(firstName)
        .constraint(
            Predicate(isAlpha)
                .valid(showStatus(firstNameConstraints[0]))
                .invalid(showStatus(firstNameConstraints[0]))
        )
        .constraint(
            Predicate(isLongerOrEqual(2))
                .valid(showStatus(firstNameConstraints[1]))
                .invalid(showStatus(firstNameConstraints[1]))
        )
        .constraint(
            Predicate(isShorterOrEqual(32))
                .valid(showStatus(firstNameConstraints[2]))
                .invalid(showStatus(firstNameConstraints[2]))
        )
        .valid(showStatus(firstName.parentElement))
        .invalid(showStatus(firstName.parentElement))
);