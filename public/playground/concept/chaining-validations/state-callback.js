import { Validation } from 'isomorphic-validation';

const textField = document.form.text;
const paintField = (field, color) => () => { field.style.backgroundColor = color; };

// predicate funtions
const isOnlyLetters = (value) => /^[A-Za-z]+$/.test(value);
const isInitValue = (value) => value === '';

// state callbacks
const paintFieldGray = paintField(textField, '#b0b0b0');
const paintFieldGreen = paintField(textField, '#b0ffb0');
const paintFieldRed = paintField(textField, '#ffb0b0');

const initValueV = Validation(textField)
  .constraint(isInitValue)
  .valid(paintFieldGray)      // paint gray if initial value
  .invalid(paintFieldRed);    // otherwise paint red 

const textFieldV = Validation(textField)
  .constraint(isOnlyLetters)
  .valid(paintFieldGreen)     // paint green if only letters
  .invalid(initValueV);       // otherwise check for the initial value

textField.addEventListener('input', textFieldV);
paintFieldGray();