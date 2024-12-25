import { Validation, Predicate } from "isomorphic-validation";

// predicate function
const faultyCheckEmail = (value) => 
    fetch(`http://your-app.com/check-email/?q=${value}`)
        .then(res => res.json());

const errorHandler = ({message}) => { console.log(message); };

const validatableObject = { value: 'a@a.a' };

const validation = Validation(validatableObject)
    .constraint(
        Predicate(faultyCheckEmail)
            .error(errorHandler)
    );

await validation.validate();
await validation.validate();

// Output:
//
// fetch failed
// fetch failed