textField.addEventListener(
  'input', 
  Validation(textField)
    .constraint(isOnlyLetters)
    .valid(paintFieldGreen)       // paint green if only letters
    .invalid(                     // otherwise check for the initial value
      Validation(textField)
        .constraint(isInitValue)
        .valid(paintFieldGray)    // paint gray if initial value
        .invalid(paintFieldRed)   // otherwise paint red 
    )       
);