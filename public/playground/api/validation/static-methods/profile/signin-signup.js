import { Validation, Predicate } from 'isomorphic-validation';
import { firstInvalid, applyAccess } from 'isomorphic-validation/ui';

// ui effects functions

const markValidity = ({target, isValid}) => {
    const label = target.previousElementSibling;
    const haveMark = label.innerText[label.innerText.length - 1] === '✔';

    if (isValid) {
        if (!haveMark) {
            label.innerText = label.innerText + ' ✔';
        }
    }
    else {
        if (haveMark) {
            label.innerText = label.innerText.slice(0, -2);
        }
    }
}

const useMsgBox = (selector) => {
    const getBoxNextTo = (target) => {
        const { parentNode, name } = target;
        return parentNode.querySelector(`[name=${name}]+${selector}`);
    };

    const show = ({ target }) => { getBoxNextTo(target).style.opacity = 1; };
    const hide = ({ target }) => { getBoxNextTo(target).style.opacity = 0; };
    const set = ({ target, msg }) => { getBoxNextTo(target).innerText = msg; };
    const reset = ({ target }) => { getBoxNextTo(target).innerText = ''; };

    return [ show, hide, set, reset ];
};

const [showMsg, hideMsg, setMsg, resetMsg] = useMsgBox('.msg-box');

// helper functions

const preserveFirstErrMsg = (result) => {
    const [, validator] = firstInvalid(result);
    result.msg = validator ? validator.invalidMsg : '';
};

const preserveStartedMsg = (result) => {
    const [[, { startedMsg }]] = result;
    result.msg = startedMsg;
}

// predicate functions

const isNotTaken = (value) => new Promise(res => { 
    setTimeout(res, 3000, value !== 'admin'); // mock request
});
const areTwoEqual = (value1, value2) => value1 === value2;
const areAllowedChars = (value) => /^[A-Za-z0-9._\-]*$/.test(value);
const isLongerThan = (number) => (value) => value.length > number;
const isShorterThan = (number) => (value) => value.length < number;
const hasCapitalLetter = (value) => /[A-Z]+/.test(value);
const hasNumber = (value) => /[0-9]+/.test(value);
const hasSpecialChar = (value) => /[\W]+/.test(value);
const isStrongPassword = (value) => 
    hasCapitalLetter(value) && hasNumber(value) && hasSpecialChar(value);

// adding constraints shared by both forms

const loginV = Validation();
const passwordV = Validation();
const pwdConfirmV = Validation();

loginV
    .constraint(
        areAllowedChars, 
        { 
            invalidMsg: 'Allowed characters are: letters, numbers, ".", "_", "-".',
            next: false,
        },
    )
    .constraint(
        isLongerThan(4),
        { invalidMsg: 'Minimal length is 5 characters.', next: false },
    )
    .constraint(
        isShorterThan(33),
        { invalidMsg: 'Maximum length is 32 characters.' },
    );

passwordV
    .constraint(
        isStrongPassword,
        { 
            invalidMsg: 'Should contain at least 1 capital letter, 1 number,' 
                + ' and 1 special character ("!", "@", "#", etc).',
        }
    )
    .constraint(
        isLongerThan(7),
        { invalidMsg: 'Minimal length is 8 characters.' },
    );

// creating validation profiles

const [signinForm, signinV] = Validation.profile(
    '[name=signinForm]', 
    ['login', 'password'], 
    [loginV, passwordV],
);

const [signupForm, signupV] = Validation.profile(
    '[name=signupForm]', 
    ['login', 'password', 'pwdConfirm'], 
    [loginV, passwordV, pwdConfirmV],
);

// additional constraints for the sign-up form

Validation.glue(signupV.password, signupV.pwdConfirm)
    .constraint(
        areTwoEqual,
        { invalidMsg: 'Password and password confirmation must be the same.' },
    );

signupV.login
    .constraint(
        Predicate(isNotTaken)
            .client // the following state callback will be added on the client side
            .started(preserveStartedMsg, setMsg, showMsg),
        { 
            startedMsg: '⏳ Checking login for existence...',
            invalidMsg: 'Login must not be already registered.', 
            debounce: 3000, 
        },
    );

// connecting ui effects to the validations

[...signinV.validations, ...signupV.validations].forEach(
    validation => validation
        .client // the following state callbacks will be added on the client side
        .invalid(preserveFirstErrMsg, setMsg)
        .changed(preserveFirstErrMsg)
        .changed(({ target, isValid, msg }) => { // for password and password confirmation
            isValid ?  resetMsg({ target }) : setMsg({ target, msg });
        })
        .changed(markValidity)
        .valid(resetMsg)
);

[[signinForm, signinV], [signupForm, signupV]]
    .map(
        ([form, validation]) => [ 
            form, 
            validation
                .client // the following state callbacks will be added on the client side
                .started(applyAccess(form.submitBtn, { disabled: true })) // always disable submit button regardless of validity
                .validated(applyAccess(form.submitBtn)) // enable/disable submit button depending on validity
                .error(console.error),
        ]
    )
    .forEach(
        ([form, validation]) => {
            form.addEventListener('input', validation);
            [...form].forEach(input => {
                if (input !== form.submitBtn) {
                    input.addEventListener('focusin', hideMsg);
                    input.addEventListener('focusout', showMsg);
                }
            });
        }
    );
    
// export validations to use on the server side as middleware functions
export { signinV, signupV };