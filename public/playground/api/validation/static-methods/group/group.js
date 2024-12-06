import { Validation } from 'isomorphic-validation';

const logFn = (fn) => (...args) => {
    const res = fn(...args);
    console.log(`${fn.name}(${args.join(',')})      \t--> ${res}`);
    return res;
};

const nameReturnedFn = (fn) => (...args) => 
    Object.defineProperty(
        fn(...args), 
        'name', 
        { value: `${fn.name}(${args.join(',')})` },
    );

// predicate functions
const isNaturalNumber = (value) => /^[1-9]+[0-9]*$/.test(value);
const isGreaterOrEqual = (number) => (value) => Number(value) >= Number(number);

// validatable objects
const obj1 = { value: 0 };
const obj2 = { value: 0 };

const validation1 = Validation(obj1)
    .started(() => console.log('started validation1...'));

const validation2 = Validation(obj2)
    .started(() => console.log('started validation2...'));

const validationGr = Validation.group(validation1, validation2)
    .started(() => console.log('started validationGr...'));

validation1.constraint(logFn(nameReturnedFn(isGreaterOrEqual)(1)));
validation2.constraint(logFn(nameReturnedFn(isGreaterOrEqual)(2)));
validationGr.constraint(logFn(isNaturalNumber)); // added to both validations

obj1.value = 1.1;
validationGr.validate(obj1);  // validating validation1 by its bound object
console.table({ validation1, validation2, validationGr}, ['isValid']);
console.log('');

obj1.value = 1;
validation1.validate();       // validating validation1 directly 
console.table({ validation1, validation2, validationGr}, ['isValid']);
console.log('');

obj2.value = 2.1;
validationGr.validate(obj2);  // validating validation2 by its bound object
console.table({ validation1, validation2, validationGr}, ['isValid']);
console.log('');

obj2.value = 2;
validation2.validate();       // validating validation2 directly 
console.table({ validation1, validation2, validationGr}, ['isValid']);
console.log('');

obj2.value = 3.1;
validationGr.validate();      // validating both validation objects
console.table({ validation1, validation2, validationGr}, ['isValid']);
console.log('');

// output:
//
// started validationGr...
// started validation1...
// isGreaterOrEqual(1)(1.1)        --> true
// isNaturalNumber(1.1)            --> false
// ┌──────────────┬─────────┐
// │ (index)      │ isValid │
// ├──────────────┼─────────┤
// │ validation1  │ false   │
// │ validation2  │ false   │
// │ validationGr │ false   │
// └──────────────┴─────────┘
// 
// started validation1...
// isGreaterOrEqual(1)(1)          --> true
// isNaturalNumber(1)              --> true
// ┌──────────────┬─────────┐
// │ (index)      │ isValid │
// ├──────────────┼─────────┤
// │ validation1  │ true    │
// │ validation2  │ false   │
// │ validationGr │ false   │
// └──────────────┴─────────┘
// 
// started validationGr...
// started validation2...
// isGreaterOrEqual(2)(2.1)        --> true
// isNaturalNumber(2.1)            --> false
// ┌──────────────┬─────────┐
// │ (index)      │ isValid │
// ├──────────────┼─────────┤
// │ validation1  │ true    │
// │ validation2  │ false   │
// │ validationGr │ false   │
// └──────────────┴─────────┘
// 
// started validation2...
// isGreaterOrEqual(2)(2)          --> true
// isNaturalNumber(2)              --> true
// ┌──────────────┬─────────┐
// │ (index)      │ isValid │
// ├──────────────┼─────────┤
// │ validation1  │ true    │
// │ validation2  │ true    │
// │ validationGr │ true    │
// └──────────────┴─────────┘
// 
// started validationGr...
// started validation1...
// started validation2...
// isGreaterOrEqual(1)(1)          --> true
// isNaturalNumber(1)              --> true
// isGreaterOrEqual(2)(3.1)        --> true
// isNaturalNumber(3.1)            --> false
// ┌──────────────┬─────────┐
// │ (index)      │ isValid │
// ├──────────────┼─────────┤
// │ validation1  │ true    │
// │ validation2  │ false   │
// │ validationGr │ false   │
// └──────────────┴─────────┘