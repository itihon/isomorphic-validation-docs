import { Validation } from 'isomorphic-validation';

// predicate functions
const predicate1 = () => true;
const predicate2 = () => false;
const predicate3 = () => true;
const predicate4 = () => false;

// validatable objects
const obj1 = { value: 'obj1', name: 'obj1' };
const obj2 = { value: 'obj2', name: 'obj2' };

const validation1 = Validation(obj1);
const validation2 = Validation(obj2); // two validations bound to the same object
const validation3 = Validation(obj2); // two validations bound to the same object
const validationGr = Validation.group(validation1, validation2, validation3);

validation1.constraint(predicate1, { msg: 'validation1' });
validation2.constraint(predicate2, { msg: 'validation2' });
validation3.constraint(predicate3, { msg: 'validation3' });
validationGr.constraint(predicate4, { msg: 'validationGr' });

await validationGr.validate();

console.log(JSON.stringify(validationGr.constraints, undefined, 3));

// Output: 
//
// {
//    "isValid": false,
//    "obj1": [
//       {
//          "0": {
//             "name": "predicate1",
//             "msg": "validation1",
//             "isValid": true
//          },
//          "1": {
//             "name": "predicate4",
//             "msg": "validationGr",
//             "isValid": false
//          },
//          "name": "PredicateGroup",
//          "length": 2,
//          "isValid": false
//       }
//    ],
//    "obj2": [
//       {
//          "0": {
//             "name": "predicate2",
//             "msg": "validation2",
//             "isValid": false
//          },
//          "1": {
//             "name": "predicate4",
//             "msg": "validationGr",
//             "isValid": false
//          },
//          "name": "PredicateGroup",
//          "length": 2,
//          "isValid": false
//       },
//       {
//          "0": {
//             "name": "predicate3",
//             "msg": "validation3",
//             "isValid": true
//          },
//          "1": {
//             "name": "predicate4",
//             "msg": "validationGr",
//             "isValid": false
//          },
//          "name": "PredicateGroup",
//          "length": 2,
//          "isValid": false
//       }
//    ]
// }