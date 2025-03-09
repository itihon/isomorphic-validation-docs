import { Validation, Predicate } from 'isomorphic-validation';
import { applyAccess, applyBox, renderFirstError, renderProperty } from 'isomorphic-validation/ui';

/* validity states UI effects  */

const msgBoxStyle = { 
    padding: '4px',
    lineHeight: '12px',
    color: 'red', 
    fontSize: '10px',
    backgroundColor: 'white',
    boxShadow: '1px 1px 3px 1px rgba(0, 0, 0, .5)',
    borderRadius: '2px',
    zIndex: 1,
};

const invalidSignStyle = {
    color: 'red', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center' 
};

const validSign = {
    true: { value: '✔' }, // show when Validation().isValid === true, otherwise clear
    style: { color: 'green' },
};

const invalidSign = {
    false: { delay: 2000, value: '✖' }, // show when Validation().isValid === false, otherwise clear
    style: invalidSignStyle,
    position: 'LEVEL_RIGHT',
};

const errorMsgBox = {
    false: { delay: 2000, value: renderFirstError('invalidMsg') }, // show when Validation().isValid === false, otherwise clear
    mode: 'MAX_SIDE',
    position: 'BELOW_CENTER',
    style: msgBoxStyle, 
};

const startedMsgBox = {
    ...errorMsgBox,
    true: { delay: 1000, value: renderProperty('startedMsg') },  // show when Validation().isValid === true
    false: { delay: 1000, value: renderProperty('startedMsg') }, // the same is when Validation().isValid === false
    style: { ...msgBoxStyle, color: 'green' },
};

const disable = { true: { value: true }, false: { value: true } }; // always disable regarldless of validity

const msgBoxEID = 'MSG_BOX'; // message box effect id, one container will be used for showing messages on both forms

/* predicate functions */

const isNotTakenC = (value) => new Promise(res => { // the client side part of the predicate
    console.log('... Making a request to /check-login with the value:', value); // mock request to /check-login
    setTimeout(res, 3000, value !== 'admin');
});
const isNotTakenS = (value) => { // the server side part of the predicate
    // This function may be a wrapper around a database requesting function
    // dynamically imported from a backend module. 
    // In order to exclude that import from the frontend bundle, a module
    // bundler should be configured properly.
};
const areTwoEqual = (value1, value2) => value1 === value2;
const areAllowedChars = (value) => /^[A-Za-z0-9._\-]*$/.test(value);
const isLongerThan = (number) => (value) => value.length > number;
const isShorterThan = (number) => (value) => value.length < number;
const hasCapitalLetter = (value) => /[A-Z]+/.test(value);
const hasNumber = (value) => /[0-9]+/.test(value);
const hasSpecialChar = (value) => /[\W]+/.test(value);
const isStrongPassword = (value) => 
    hasCapitalLetter(value) && hasNumber(value) && hasSpecialChar(value);

/* adding constraints shared by both forms */

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

/* creating validation profiles */

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

/* additional constraints for the sign-up form */

Validation.glue(signupV.password, signupV.pwdConfirm)
    .constraint(
        areTwoEqual,
        { invalidMsg: 'Password and password confirmation must be the same.' },
    );

signupV.login
    .client.constraint( // This predicate will be added on the client side
        Predicate(isNotTakenC)
            .started(applyBox(startedMsgBox, msgBoxEID)), // show started message 
        { 
            startedMsg: '⏳ Checking login for existence...',
            invalidMsg: 'Login must not be already registered.', 
            debounce: 3000, 
        },
    )
    .server.constraint( // This predicate will be added on the server side
        isNotTakenS
    );

/* connecting ui effects to the validations */

[...signinV.validations, ...signupV.validations].forEach( // for grouped (nested) validations
    (validation, idx) => {
        const label = [...validation.constraints][0][0].previousElementSibling;
        const validSignEID = 'VALID_SIGN' + idx; // "valid" sign effect id
        const invalidSignEID = 'INVALID_SIGN' + idx; // "invalid" sign effect id

        validation
            .client // the following state callbacks will be added on the client side

            /* The "valid" sign for the field's label element */
            .started(applyBox(label, validSignEID))              // clear the "valid" sign
            .validated(applyBox(label, validSign, validSignEID)) // set the "valid" sign
            .changed(applyBox(label, validSign, validSignEID))   // set the "valid" sign (for glued validations)

            /* The "invalid" sign for a field element */
            .started(applyBox(invalidSignEID))                   // clear the "invalid" sign
            .validated(applyBox(invalidSign, invalidSignEID))    // set the "invalid" sign
            .changed(applyBox(invalidSign, invalidSignEID))      // set the "invalid" sign (for glued validations)

            /* The message box for a field element */
            .started(applyBox(msgBoxEID))                        // clear error message 
            .validated(applyBox(errorMsgBox, msgBoxEID))         // show error message
            .changed(applyBox(errorMsgBox, msgBoxEID));          // show error message (for glued validations)
        }
);

[[signinForm, signinV], [signupForm, signupV]].forEach( // for grouping validations
    ([form, validation]) => { 
        form.addEventListener('input', validation);
        validation
            .client // the following state callbacks will be added on the client side
            .started(applyAccess(form.submitBtn, disable)) // disable submit button regardless of validity
            .validated(applyAccess(form.submitBtn)) // enable/disable submit button depending on validity
            .error(console.error);
    }
);
    
/* export validations to use on the server side as middleware functions */
export { signinV, signupV };