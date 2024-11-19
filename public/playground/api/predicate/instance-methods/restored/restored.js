import { Validation, Predicate } from "isomorphic-validation";

const { log } = console;

// predicate function
const isMeaningOfLife = (value) => { 
    log(`isMeaningOfLife("${value}")`); 
    return value === '42'; 
};

// state callbacks
const validCB = ({ isValid }) => { log(`validCB({ isValid: ${isValid} })`); };
const invalidCB = ({ isValid }) => { log(`invalidCB({ isValid: ${isValid} })`); };
const restoredCB = ({ isValid }) => { log(`restoredCB({ isValid: ${isValid} })`); };

const validatableObject = { value: '' };

const v = Validation(validatableObject)
    .constraint(
        Predicate(isMeaningOfLife)
            .valid(validCB)         // adding state callbacks
            .invalid(invalidCB)     // adding state callbacks
            .restored(restoredCB),  // adding state callbacks
        { keepValid: true }
    )
    .started(() => log('---'));

validatableObject.value = '🥇';
await v.validate();

validatableObject.value = '💲';
await v.validate();

validatableObject.value = '42';
await v.validate();

validatableObject.value = '💕';
await v.validate();

validatableObject.value = '🐣';
await v.validate();

validatableObject.value = ''; // initial value
await v.validate();

// Output:
// ---
// isMeaningOfLife("🥇")
// restoredCB({ isValid: false })
// isMeaningOfLife("")
// invalidCB({ isValid: false })
// ---
// isMeaningOfLife("💲")
// restoredCB({ isValid: false })
// isMeaningOfLife("")
// invalidCB({ isValid: false })
// ---
// isMeaningOfLife("42")
// validCB({ isValid: true })
// ---
// isMeaningOfLife("💕")
// restoredCB({ isValid: false })
// isMeaningOfLife("42")
// validCB({ isValid: true })
// ---
// isMeaningOfLife("🐣")
// restoredCB({ isValid: false })
// isMeaningOfLife("42")
// validCB({ isValid: true })
// ---
// isMeaningOfLife("")
// restoredCB({ isValid: false })
// isMeaningOfLife("")
// invalidCB({ isValid: false })