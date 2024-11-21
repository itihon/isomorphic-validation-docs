import { Validation } from "isomorphic-validation";

// predicate functions
const isString = (value) => {
    console.log('isString(), value:', value);
    return typeof value === 'string';
};
const isObj = (num) => (value) => {
    console.log(`isObj(${num}), value:`, value);
    return value === `isObj${num}`;
};

// validatable objects
const obj1 = { value: 'obj1' };
const obj2 = { value: 'obj2' };

const v = Validation.group( 

    Validation(obj1)
        .constraint(isObj(1)), 

    Validation(obj2) 
        .constraint(isObj(2))
)
.constraint(isString);

console.log('\n--> executing a predicate group, associated with obj1');
const { target: target1 } = await v.validate(obj1); 

console.log('\n--> executing a predicate group, associated with obj2');
const { target: target2 } = await v.validate(obj2);

console.log('\n--> executing all predicate groups');
const { target: target3 } = await v.validate();

console.log('\n--> no predicate group associated with this object');
await v.validate({ value: 'dummy' }).catch(err => console.log(err.message));

console.log('\n--> targets:', target1, target2, target3);

// Output:
// --> executing a predicate group, associated with obj1
// isObj(1), value: obj1
// isString(), value: obj1
// 
// --> executing a predicate group, associated with obj2
// isObj(2), value: obj2
// isString(), value: obj2
// 
// --> executing all predicate groups
// isObj(1), value: obj1
// isString(), value: obj1
// isObj(2), value: obj2
// isString(), value: obj2
// 
// --> no predicate group associated with this object
// There are no predicates assosiated with the target {"value":"dummy"}
// 
// --> targets: { value: 'obj1' } { value: 'obj2' } undefined