import { Validation } from "isomorphic-validation";

// predicate function
const faultyCheckEmail = (value) => 
    fetch(`http://your-app.com/check-email/?q=${value}`)
        .then(res => res.json());

// state callbacks
const validStateCallback = () => { console.log('The e-mail is available.'); };
const invalidStateCallback = () => { console.log('The e-mail is taken.'); };
const errorHandler = ({message}) => { console.log(message); };

const validatableObject = { value: 'a@a.a' };

const validation = Validation(validatableObject)
    .constraint(faultyCheckEmail)
    .valid(validStateCallback)
    .invalid(invalidStateCallback)
    .error(errorHandler);

await validation.validate();
await validation.validate();

// Output:
//
// fetch failed
// fetch failed