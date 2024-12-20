import { Validation } from 'isomorphic-validation';

// validatable objects are not accessible in this context
// creating validations
const validation1 = Validation();
const validation2 = Validation();

// predicate function
const isMeaningOfLife = (value) => (console.log('value:', value), value === 42);

// ...

// later in the code or in another module
// validatable objects
const obj1 = { value: 41 };
const obj2 = { value: 42 };

// grouping validations into one
const validationGr = Validation.group(validation1, validation2)
    .constraint(isMeaningOfLife) // adding the constraint to the grouped validations
    .error((err) => console.error(err.message)); // catching errors

// !!! binding validations after grouping
validation1.bind(obj1); validation2.bind(obj2);

// running validation1 by the bound object
await validationGr.validate(obj1); // Error! No predicates associated with obj1

// running validation2 by the bound object
await validationGr.validate(obj2); // Error! No predicates associated with obj2

// running validation1
await validation1.validate();
console.table({ validation1, validation2, validationGr }, ['isValid']);

// running validation2
await validation2.validate();
console.table({ validation1, validation2, validationGr }, ['isValid']);

// Output: 
//
// There are no predicates associated with the target {"value":41}
// There are no predicates associated with the target {"value":42}
// value: 41
// ┌──────────────┬─────────┐
// │ (index)      │ isValid │
// ├──────────────┼─────────┤
// │ validation1  │ false   │
// │ validation2  │ false   │
// │ validationGr │ false   │
// └──────────────┴─────────┘
// value: 42
// ┌──────────────┬─────────┐
// │ (index)      │ isValid │
// ├──────────────┼─────────┤
// │ validation1  │ false   │
// │ validation2  │ true    │
// │ validationGr │ false   │
// └──────────────┴─────────┘