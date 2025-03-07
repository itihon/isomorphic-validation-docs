import { Validation } from 'isomorphic-validation';
import { applyAccess, applyBackground } from 'isomorphic-validation/ui';

const { login, password, pwdconfirm, submitBtn } = document.form;
const greenAndGray = { false: { value: 'lightgray' } };
const [, highlight] = applyBackground(greenAndGray);

// predicate functions
const areTwoEqual = (value1, value2) => value1 === value2;
const isLongerThan = (number) => (value) => value.length > number;

document.form.addEventListener(
    'input',
    Validation.group(

        Validation(login)
            .constraint(isLongerThan(2))
            .changed(highlight),

        Validation.glue( // "glue" password and password confirmation validations

            Validation(password)
                .constraint(isLongerThan(5))
                .changed(highlight),

            Validation(pwdconfirm)
                .changed(highlight),

        ).constraint(areTwoEqual) // accepts values from both fields

    ).changed(applyAccess(submitBtn))
);

// initial paint
highlight({ target: login, isValid: false });
highlight({ target: password, isValid: false });
highlight({ target: pwdconfirm, isValid: false });