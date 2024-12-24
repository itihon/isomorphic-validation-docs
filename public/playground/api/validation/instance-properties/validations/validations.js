import { Validation } from "isomorphic-validation";

// predicate function
const predicate1 = () => true; 

// validatable objects
const obj1 = { value: 'obj1' };
const obj2 = { value: 'obj2' };

const validatedStateCallback = ([[obj]]) => console.log(obj);

const validation1 = Validation(obj1);
const validation2 = Validation(obj2);

const validationGr = Validation.group(validation1, validation2);

validationGr
    .constraint(predicate1)
    .validations.forEach(
        validation => validation
            .validated(validatedStateCallback)
    );

await validationGr.validate();

// Output:
//
// { value: 'obj1' }
// { value: 'obj2' }