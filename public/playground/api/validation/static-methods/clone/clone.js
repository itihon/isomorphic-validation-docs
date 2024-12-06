import { Validation } from 'isomorphic-validation';

const makePredicateFn = (name) => ({
    [name]: (value) => (console.log(`${name}("${value}")`), true),
}[name]);

const makeValidatedCB = (name) => () => console.log(name, 'validated');

const obj1 = { value: 'obj1' };
const obj2 = { value: 'obj2' };
const obj3 = { value: 'obj3' };

const validation1 = Validation(obj1)
    .constraint(makePredicateFn('✅ predicate1'))
    .validated(makeValidatedCB('validation1'));

const validation2 = Validation(obj2)
    .constraint(makePredicateFn('✅ predicate2'))
    .validated(makeValidatedCB('validation2'));

const validation3 = Validation(obj3)
    .constraint(makePredicateFn('✅ predicate3'))
    .validated(makeValidatedCB('validation3'));

const validationGr1 = Validation.group(validation1, validation2)
    .constraint(makePredicateFn('✅ predicateGr1'))
    .validated(makeValidatedCB('validationGr1'));

const validationGr2 = Validation.group(validationGr1, validation3)
    .constraint(makePredicateFn('✅ predicateGr2'))
    .started(() => console.log(''))
    .validated(makeValidatedCB('validationGr2'));

const validationCl1 = Validation.clone(validationGr2)
    .constraint(makePredicateFn('☑️  predicateCl1'))
    .validated(makeValidatedCB('validationCl1'));

await validationGr2.validate();
await validationCl1.validate();

// Output:
//
// ✅ predicate1("obj1")
// ✅ predicateGr1("obj1")
// ✅ predicateGr2("obj1")
// ✅ predicate2("obj2")
// ✅ predicateGr1("obj2")
// ✅ predicateGr2("obj2")
// ✅ predicate3("obj3")
// ✅ predicateGr2("obj3")
// validation1 validated
// validation2 validated
// validationGr1 validated
// validation3 validated
// validationGr2 validated
// 
// ✅ predicate1("obj1")
// ✅ predicateGr1("obj1")
// ✅ predicateGr2("obj1")
// ☑️  predicateCl1("obj1")
// ✅ predicate2("obj2")
// ✅ predicateGr1("obj2")
// ✅ predicateGr2("obj2")
// ☑️  predicateCl1("obj2")
// ✅ predicate3("obj3")
// ✅ predicateGr2("obj3")
// ☑️  predicateCl1("obj3")
// validation1 validated
// validation2 validated
// validationGr1 validated
// validation3 validated
// validationGr2 validated
// validationCl1 validated