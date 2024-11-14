import { Validation } from 'isomorphic-validation';

const textField = document.form.text;

const isOnlyLetters = (value) => /^[A-Za-z]+$/.test(value);
const isInitValue = (value) => value === '';

const paintField = (field, color) => () => { field.style.backgroundColor = color; };

const paintFieldGray = paintField(textField, 'gray');
const paintFieldGreen = paintField(textField, 'green');
const paintFieldRed = paintField(textField, 'red');

const initValueV = Validation(textField)
  .constraint(isInitValue)
  .valid(paintFieldGray);

const textFieldV = Validation(textField)
  .constraint(isOnlyLetters)
  .valid(paintFieldGreen)
  .invalid(paintFieldRed)
  .validated(initValueV);

form.text.addEventListener('input', textFieldV);
textField.style.backgroundColor = 'gray';