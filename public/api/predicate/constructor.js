import { Validation, Predicate } from "isomorphic-validation";

//------------------------------------------------------------------------------------------------------------------
((run=0, module_name = '') => {if (!run) return;
console.log('%c-------------------start of module '+module_name+'--------------------', 'color: orange; background-color: teal; font-size: 18px; font-style: italic; border: 1px solid orange');
    
// predicate function
const isMeaningOfLife = (value) => value === 42;

// state callbacks
const logValid = () => console.log('Right.');
const logInvalid = () => console.log('Sorry, return in 7.5 milliones years.');

const validatableObject = {
    value: 42,
};

Validation(validatableObject)
    .constraint(
        Predicate(isMeaningOfLife)
            .valid(logValid)
            .invalid(logInvalid)
    )
    .validate();  // -> "Right."  
    
console.log('%c--------------------end of module '+module_name+'---------------------\r\n', 'color: orange; background-color: teal; font-size: 18px; font-style: italic; border: 1px solid orange');
})(1, 'Passing predicate functions with state callbacks');
//------------------------------------------------------------------------------------------------------------------ 


//------------------------------------------------------------------------------------------------------------------
((run=0, module_name = '') => {if (!run) return;
console.log('%c-------------------start of module '+module_name+'--------------------', 'color: orange; background-color: teal; font-size: 18px; font-style: italic; border: 1px solid orange');
    
// predicate function
const isMeaningOfLife = (value) => value === 42;

// state callbacks
const logValid = () => console.log('Right.');
const logInvalid = () => console.log('Sorry, return in 7.5 milliones years.');
const logStarted = () => console.log('Start processing...')
const logValidated = () => console.log('Processing ended.');

const obj1 = { value: 42 };
const obj2 = { value: null };

const p1 = Predicate(isMeaningOfLife)
            .valid(logValid)
            .invalid(logInvalid);

// We could rewrite the code of p1 and add two more callbacks
// const p2 = Predicate(isMeaningOfLife)
//             .valid(logValid)
//             .invalid(logInvalid)
//             .started(logStarted)
//             .validated(logValidated);

// But instead
const p2 = Predicate(p1)                // we clone p1 with its predicate function and state callbacks,
            .started(logStarted)        // add started state callback
            .validated(logValidated);   // and validated state callback

const v1 = Validation(obj1)
            .constraint(p1);

const v2 = Validation(obj2)
            .constraint(p2);

v1.validate();  // -> "Right."

v2.validate();  // -> "Start processing..."
                // -> "Sorry, return in 7.5 milliones years."
                // -> "Processing ended."
    
console.log('%c--------------------end of module '+module_name+'---------------------\r\n', 'color: orange; background-color: teal; font-size: 18px; font-style: italic; border: 1px solid orange');
})(1, 'Cloning a Predicate');
//------------------------------------------------------------------------------------------------------------------