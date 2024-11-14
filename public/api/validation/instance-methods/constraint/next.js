import { Validation, Predicate } from "isomorphic-validation";

// predicate functions
const isEmail = (value) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
const isEmailRegistered = (value) => new Promise(res => {
    setTimeout(res, 1500, false); // mock request delay
});

const emailField = document.form.email;

const log = (mark) => ({isValid}) => console.log(mark, isValid);

const emailV = Validation(emailField)
    .constraint(
        Predicate(isEmail)
            .validated(log(`📧 isEmail: ${emailField.value}`)), 
            { next: false } // cancel validating the next constraint
    )                       // until the current one is valid
    .constraint( 
        Predicate(isEmailRegistered) // costly operation
            .started(log(`📝 isEmailRegistered: ${emailField.value}`)), 
    ); 

emailField.addEventListener('input', emailV);