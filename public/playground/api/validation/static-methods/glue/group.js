import { Validation } from 'isomorphic-validation';

// validatable objects
const obj1 = { value: 'obj1' };
const obj2 = { value: 'obj2' };

// predicate function
const predicate = (...args) => {
    console.log('executing predicate with args:', ...args);
    return true;
};

const validation1 = Validation(obj1); 
const validation2 = Validation(obj2);

const validationGr = Validation.group(validation1, validation2)
    .constraint(predicate); // adding predicate to the grouped validations

console.table({validation1, validation2, validationGr}, ['isValid']);
console.log('validating validation1:'); validation1.validate(); 
console.table({validation1, validation2, validationGr}, ['isValid']);
console.log('validating validation2:'); validation2.validate(); 
console.table({validation1, validation2, validationGr}, ['isValid']);

// Output
// ┌──────────────┬─────────┐
// │ (index)      │ isValid │
// ├──────────────┼─────────┤
// │ validation1  │ false   │
// │ validation2  │ false   │
// │ validationGr │ false   │
// └──────────────┴─────────┘
// validating validation1:
// executing predicate with args: obj1
// ┌──────────────┬─────────┐
// │ (index)      │ isValid │
// ├──────────────┼─────────┤
// │ validation1  │ true    │
// │ validation2  │ false   │
// │ validationGr │ false   │
// └──────────────┴─────────┘
// validating validation2:
// executing predicate with args: obj2
// ┌──────────────┬─────────┐
// │ (index)      │ isValid │
// ├──────────────┼─────────┤
// │ validation1  │ true    │
// │ validation2  │ true    │
// │ validationGr │ true    │
// └──────────────┴─────────┘