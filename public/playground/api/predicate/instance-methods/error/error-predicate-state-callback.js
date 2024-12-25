import { Validation, Predicate } from "isomorphic-validation";

// predicate function
const isMeaningOfLife = (value) => value === 42;

// state callbacks
const faultyCallback = (res) => { res.a.b.c }; // accessing a non existing property
const errorHandler = ({message}) => { console.log(message); };

const validatableObject = { value: 42 };

const validation = Validation(validatableObject)
    .constraint(
        Predicate(isMeaningOfLife)
            .validated(faultyCallback)
            .error(errorHandler)
    );

await validation.validate();
await validation.validate();

// Output:
//
// Cannot read properties of undefined (reading 'b')
// Cannot read properties of undefined (reading 'b')