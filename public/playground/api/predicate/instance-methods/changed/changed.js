import { Validation, Predicate } from "isomorphic-validation";

const { log } = console;
const logFn = (fn) => (value) => (log(`${fn.name}("${value}")`), fn(value)); 

// predicate functions
const hasLetterA = (value) => /[Aa]+/.test(value); 
const hasLetterB = (value) => /[Bb]+/.test(value); 
const hasLetterC = (value) => /[Cc]+/.test(value); 

// state callbacks
const startedCB = ({ isValid }) => { 
    log(`startedCB({ isValid: ${isValid} }) <-- before`); 
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
    .constraint( 
        Predicate( logFn(hasLetterC) )
            .started(startedCB)     // adding state callbacks
            .valid(validCB)         // adding state callbacks
            .invalid(invalidCB)     // adding state callbacks
            .changed(changedCB)     // adding state callbacks
    )
    .started(() => log('---'));

validatableObject.value = 'A';
await v.validate(); // hasLetterC() -> false

validatableObject.value = 'Abc';
await v.validate(); // hasLetterC() -> true, changedCB will be called

validatableObject.value = 'ABCabc';
await v.validate(); // hasLetterC() -> true

validatableObject.value = 'ABab';
await v.validate(); // hasLetterC() -> false, changedCB will be called

// Output:
// ---
// hasLetterA("A")
// hasLetterB("A")
// startedCB({ isValid: false }) <-- before
// hasLetterC("A")
// invalidCB({ isValid: false }) <-- after
// ---
// hasLetterA("Abc")
// hasLetterB("Abc")
// startedCB({ isValid: false }) <-- before
// hasLetterC("Abc")
// changedCB({ isValid: true }) <-- changes
// validCB({ isValid: true }) <-- after
// ---
// hasLetterA("ABCabc")
// hasLetterB("ABCabc")
// startedCB({ isValid: true }) <-- before
// hasLetterC("ABCabc")
// validCB({ isValid: true }) <-- after
// ---
// hasLetterA("ABab")
// hasLetterB("ABab")
// startedCB({ isValid: true }) <-- before
// hasLetterC("ABab")
// changedCB({ isValid: false }) <-- changes
// invalidCB({ isValid: false }) <-- after