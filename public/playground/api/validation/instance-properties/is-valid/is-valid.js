import { Validation } from 'isomorphic-validation';

// validatable objects
const obj1 = { value: '' };
const obj2 = { value: '' };

// predicate functions
const hasCapitalLetters = (value) => /[A-Z]/.test(value);
const hasNumbers = (value) => /[0-9]/.test(value);

const validation1 = Validation(obj1)
    .constraint(hasCapitalLetters);

const validation2 = Validation(obj2)
    .constraint(hasNumbers);

const validationGr = Validation.group(validation1, validation2);

const validations = { validation1, validation2, validationGr };

obj1.value = 'asdf';
obj2.value = 'asdf';
await validationGr.validate();
console.table(validations, ['isValid']);

obj1.value = 'asdf';
obj2.value = 'asdf1';
await validationGr.validate();
console.table(validations, ['isValid']);

obj1.value = 'asdfG';
obj2.value = 'asdf1';
await validationGr.validate();
console.table(validations, ['isValid']);

// Output:
//
// ┌──────────────┬─────────┐
// │ (index)      │ isValid │
// ├──────────────┼─────────┤
// │ validation1  │ false   │
// │ validation2  │ false   │
// │ validationGr │ false   │
// └──────────────┴─────────┘
// ┌──────────────┬─────────┐
// │ (index)      │ isValid │
// ├──────────────┼─────────┤
// │ validation1  │ false   │
// │ validation2  │ true    │
// │ validationGr │ false   │
// └──────────────┴─────────┘
// ┌──────────────┬─────────┐
// │ (index)      │ isValid │
// ├──────────────┼─────────┤
// │ validation1  │ true    │
// │ validation2  │ true    │
// │ validationGr │ true    │
// └──────────────┴─────────┘