import { Validation } from "isomorphic-validation";

const { log } = console;

// predicate functions
const predicate1 = (value) => { log(`predicate1(${value})`); return true; };
const predicate2 = (value) => { log(`predicate2(${value})`); return true; };
const predicate3 = (value) => { log(`predicate3(${value})`); return true; };

// state callbacks
const callback1 = (value) => { log(`callback1(${value})`); };
const callback2 = (value) => { log(`callback2(${value})`); };
const callback3 = (value) => { log(`callback3(${value})`); };

const validatableObject = { value: 'obj1' };

Validation(validatableObject)
    .constraint(predicate1)
    .constraint(predicate2)
    .constraint(predicate3)
    .started(callback1)
    .started(callback2, callback3)
    .validate();

// Output:
// callback1([object ValidationResult])
// callback2([object ValidationResult])
// callback3([object ValidationResult])
// predicate1(obj1)
// predicate2(obj1)
// predicate3(obj1)