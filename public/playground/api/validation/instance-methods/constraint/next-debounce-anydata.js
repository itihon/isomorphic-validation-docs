import { Predicate, Validation } from "isomorphic-validation";

const iconAfter = (element, icon) => {
    let timeout;

    const show = (delay) => () => {
        timeout = setTimeout(() => {
            element.nextSibling.remove();
            element.insertAdjacentHTML('afterend', icon);
        }, delay);
    };

    const cancel = () => clearTimeout(timeout);

    return [show, cancel];
};

// predicate functions
const isEmail = (value) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
const isEmailRegistered = (value) => new Promise(res => {
    console.log('Making a request...', value);
    setTimeout(res, 1500, value === 'john.doe@mail.me'); // mock request delay
});

const emailField = document.form.email;

const log = (mark) => ([[,validator]]) => 
    console.log(
        mark, validator[Symbol.toStringTag], validator.msg, validator.isValid,
    );

const [showInitialIcon, /* not used */]     = iconAfter(emailField, '✔');
const [showWaitIcon, cancelWaitIcon]        = iconAfter(emailField, '⏳');
const [showValidIcon, /* not used */]       = iconAfter(emailField, '✅');
const [showInvalidIcon, cancelInvalidIcon]  = iconAfter(emailField, '⛔');

const emailV = Validation(emailField)
    .constraint(
        Predicate(isEmail)
            .validated(log('📧')), 
        { next: false, msg: 'Must be an E-mail'},
    )
    .constraint(
        Predicate(isEmailRegistered)
            .started(showWaitIcon(1000)) // delayed icon show
            .validated(log('📝')), 
        { debounce: 5000, msg: 'Must be registered'},
    )
    .started(cancelWaitIcon, cancelInvalidIcon) // cancel delayed icon shows
    .started(showInitialIcon())
    .valid(showValidIcon())
    .invalid(showInvalidIcon(500)); // delayed icon show

emailV.constraints.forEach(constraint => {
    console.log('Added:', constraint[Symbol.toStringTag], constraint.msg);
});

emailField.addEventListener('input', emailV);

