form.addEventListener(
    'input', 
    Validation.group(

        Validation(age)
            .constraint(isGreaterThan21)
            .constraint(isLessThan45),

        Validation(salary)
            .constraint(isGreaterThan20k)
            .constraint(isLessThan300k),

    ).changed(  // enable and disable the submit button
        ({isValid}) => submitBtn.disabled = !isValid
    )
);