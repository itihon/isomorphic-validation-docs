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

// binding validations to validatable objects and grouping into one
const validationGr = Validation.group(
  validation1.bind(obj1), validation2.bind(obj2)
)
.constraint(isMeaningOfLife); // adding the constraint to the grouped validations

// running validation1 by the bound object
await validationGr.validate(obj1);
console.table({ validation1, validation2, validationGr }, ['isValid']);

// running validation2 by the bound object
await validationGr.validate(obj2);
console.table({ validation1, validation2, validationGr }, ['isValid']);

// Output:
//
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
