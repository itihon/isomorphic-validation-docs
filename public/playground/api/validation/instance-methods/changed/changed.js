import { Validation } from "isomorphic-validation";

const { log } = console;
const logFn = (fn) => (value) => (log(`${fn.name}("${value}")`), fn(value)); 

// predicate functions
const hasLetterA = (value) => /[Aa]+/.test(value); 
const hasLetterB = (value) => /[Bb]+/.test(value); 
const hasLetterC = (value) => /[Cc]+/.test(value); 

// state callbacks
const startedCB = ({ isValid }) => { 
    log(`\nstartedCB({ isValid: ${isValid} }) <-- before`); 
};

const validCB = ({ isValid }) => { 
    log(`validCB({ isValid: ${isValid} }) <-- after`); 
};

const invalidCB = ({ isValid }) => { 
    log(`invalidCB({ isValid: ${isValid} }) <-- after`); 
};

const changedCB = ({ isValid }) => { 
    log(`changedCB({ isValid: ${isValid} }) <-- changes`); 
};

const validatableObject = { value: '' };

const v = Validation(validatableObject)
    .constraint( logFn(hasLetterA) )
    .constraint( logFn(hasLetterB) )
    .constraint( logFn(hasLetterC) )
    .started(startedCB)     // adding state callbacks
    .valid(validCB)         // adding state callbacks
    .invalid(invalidCB)     // adding state callbacks
    .changed(changedCB);    // adding state callbacks

validatableObject.value = 'A';
await v.validate(); // no validity state change

validatableObject.value = 'Abc';
await v.validate(); // changedCB will be called

validatableObject.value = 'ABCabc';
await v.validate(); // no validity state change

validatableObject.value = 'ABab';
await v.validate(); // changedCB will be called

// Output:
//
// startedCB({ isValid: false }) <-- before
// hasLetterA("A")
// hasLetterB("A")
// hasLetterC("A")
// invalidCB({ isValid: false }) <-- after
// 
// startedCB({ isValid: false }) <-- before
// hasLetterA("Abc")
// hasLetterB("Abc")
// hasLetterC("Abc")
// changedCB({ isValid: true }) <-- changes
// validCB({ isValid: true }) <-- after
// 
// startedCB({ isValid: true }) <-- before
// hasLetterA("ABCabc")
// hasLetterB("ABCabc")
// hasLetterC("ABCabc")
// validCB({ isValid: true }) <-- after
// 
// startedCB({ isValid: true }) <-- before
// hasLetterA("ABab")
// hasLetterB("ABab")
// hasLetterC("ABab")
// changedCB({ isValid: false }) <-- changes
// invalidCB({ isValid: false }) <-- after