import { Validation } from "isomorphic-validation";

const { log } = console;

// predicate functions
const predicate1 = (value) => { log(`predicate1(${value})`); return true; };
const predicate2 = (value) => { log(`predicate2(${value})`); return true; };
const predicate3 = (value) => { log(`predicate3(${value})`); return true; };

// state callbacks
const callback1 = ({ isValid }) => { log(`callback1({ isValid: ${isValid} })`); };
const callback2 = ({ isValid }) => { log(`callback2({ isValid: ${isValid} })`); };
const callback3 = ({ isValid }) => { log(`callback3({ isValid: ${isValid} })`); };

const validatableObject = { value: 'obj1' };

Validation(validatableObject)
    .constraint(predicate1)
    .constraint(predicate2)
    .constraint(predicate3)
    .valid(callback1)             // adding state callbacks
    .valid(callback2, callback3)  // adding state callbacks
    .validate();

// Output:
// predicate1(obj1)
// predicate2(obj1)
// predicate3(obj1)
// callback1({ isValid: true })
// callback2({ isValid: true })
// callback3({ isValid: true })