import { Validation, Predicate } from "isomorphic-validation";

const { log } = console;

// predicate functions
const predicate1 = (value) => { log(`predicate1("${value}")`); return true; };
const predicate2 = (value) => { log(`predicate2("${value}")`); return false; };
const predicate3 = (value) => { log(`predicate3("${value}")`); return false; };

// state callbacks
const callback1 = ({ isValid }) => { log(`callback1({ isValid: ${isValid} })`); };
const callback2 = ({ isValid }) => { log(`callback2({ isValid: ${isValid} })`); };
const callback3 = ({ isValid }) => { log(`callback3({ isValid: ${isValid} })`); };
const callback4 = ({ isValid }) => { log(`callback4({ isValid: ${isValid} })`); };

const validatableObject = { value: 'obj1' };

Validation(validatableObject)
    .constraint(predicate1)
    .constraint(
        Predicate(predicate2)
            .invalid(callback1)             // adding state callbacks
            .invalid(callback2, callback3)  // adding state callbacks
    )
    .constraint(
        Predicate(predicate3)
            .invalid(callback4)             // adding state callbacks
    )
    .validate();

// Output:
// predicate1("obj1")
// predicate2("obj1")
// callback1({ isValid: false })
// callback2({ isValid: false })
// callback3({ isValid: false })
// predicate3("obj1")
// callback4({ isValid: false })