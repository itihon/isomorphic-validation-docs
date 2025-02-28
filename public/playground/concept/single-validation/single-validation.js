import { Validation, Predicate } from 'isomorphic-validation';
import { applyClass as showStatus } from 'isomorphic-validation/ui';
import isAlpha from 'validator/es/lib/isAlpha';

const isLongerOrEqual = (min) => (value) => value.length >= min;
const isShorterOrEqual = (max) => (value) => value.length <= max;

const { form } = document;
const { firstName } = form;
const firstNameConstraints = form.querySelectorAll('.constraint.firstName');

form.addEventListener(
    'input', 
    Validation(firstName)
        .constraint(
            Predicate(isAlpha)
                .validated(showStatus(firstNameConstraints[0]))
        )
        .constraint(
            Predicate(isLongerOrEqual(2))
                .validated(showStatus(firstNameConstraints[1]))
        )
        .constraint(
            Predicate(isShorterOrEqual(32))
                .validated(showStatus(firstNameConstraints[2]))
        )
        .validated(showStatus(firstName.parentElement))
);