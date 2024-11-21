import { Validation } from "isomorphic-validation";

// predicate functions
const isLessThan45 = (value) => Number(value) < 45;
const isGreaterThan21 = (value) => Number(value) > 21;
const isLessThan300k = (value) => Number(value) < 300000;
const isGreaterThan20k = (value) => Number(value) > 20000;

//  <form name="form">
//      <input type="number" name="age" placeholder="Age"/>
//      <input type="number" name="salary" placeholder="Salary"/>
//      <input type="submit" name="submitBtn" disabled />
//  </form>
const { form } = document;
const { age, salary, submitBtn } = form;

const validation = Validation.group(

    Validation(age)
        .constraint(isGreaterThan21)
        .constraint(isLessThan45),

    Validation(salary)
        .constraint(isGreaterThan20k)
        .constraint(isLessThan300k),
     
).changed(  // enable and disable the submit button
    ({isValid}) => submitBtn.disabled = !isValid
); 

form.addEventListener('input', validation);

// the line above is equivalent to this:
// form.addEventListener('input', (event) => validation.validate(event.target));