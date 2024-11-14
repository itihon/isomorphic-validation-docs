import { Validation, Predicate } from "isomorphic-validation";

// predicate function
const isMeaningOfLife = (value) => value === 42;

// state callbacks
const logValid = () => console.log('Right.');
const logInvalid = () => console.log('Sorry, return in 7.5 milliones years.');

const validatableObject = {
    value: 42,
};

Validation(validatableObject)
    .constraint(
        Predicate(isMeaningOfLife)
            .valid(logValid)
            .invalid(logInvalid)
    )
    .validate(); // -> "Right."