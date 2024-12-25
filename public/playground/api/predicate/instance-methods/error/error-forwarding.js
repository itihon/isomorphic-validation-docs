import { Validation, Predicate } from "isomorphic-validation";

const { log } = console;

// predicate functions

const faultyCheckEmail = (value) => 
    fetch(`http://your-app.com/check-email/?q=${value}`)
        .then(res => res.json());

const areAllowedChars = (value) => /^[A-Za-z\s]+$/.test(value);

// state callbacks

const emailValidHandler = () => { log('The e-mail is available.'); };
const emailInvalidHandler = () => { log('The e-mail is taken.'); };
const emailErrorHandler = ({message}) => { log('e-mail:', message, '\n'); };

const nameValidHandler = () => { log('The name has valid characters.'); };
const nameInvalidHandler = () => { log('The name has invalid characters.'); };
const nameErrorHandler = ({message}) => { log('name:', message); };

const predicateErrorHandler = (err, next) => { log('Predicate:', err.message); next() };
const groupErrorHandler = (err, next) => { log('group:', err.message); next() };
const promiseRejectHandler = ({ message }) => { log('Promise:', message, '\n'); };

// validatable objects
const email = { value: 'a@a.a' };
const name = { value: 'John Doe' };

const emailValidation = Validation(email)
    .constraint(
        Predicate(faultyCheckEmail)
            .error(predicateErrorHandler)
    )
    .valid(emailValidHandler)
    .invalid(emailInvalidHandler)
    .error(emailErrorHandler);

const nameValidation = Validation(name)
    .constraint(areAllowedChars)
    .valid(nameValidHandler)
    .invalid(nameInvalidHandler)
    .error(nameErrorHandler);

const validation = Validation.group(emailValidation, nameValidation)
    .error(groupErrorHandler);

// catching the forwarded error
await validation.validate().catch(promiseRejectHandler); // predicateErrorHandler, groupErrorHandler and promiseRejectHandler will be called

await emailValidation.validate(); // predicateErrorHandler and emailErrorHandler will be called
await nameValidation.validate(); // nameValidHandler will be called (no errors)

// Output:
//
// Predicate: fetch failed
// group: fetch failed
// Promise: fetch failed 
// 
// Predicate: fetch failed
// e-mail: fetch failed 
// 
// The name has valid characters.