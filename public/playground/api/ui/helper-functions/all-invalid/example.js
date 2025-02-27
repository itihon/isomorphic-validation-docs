import { Validation } from 'isomorphic-validation';
import { allInvalid, applyOutline } from 'isomorphic-validation/ui';
import isAlpha from 'validator/es/lib/isAlpha';
import isStrongPassword from 'validator/es/lib/isStrongPassword';

const isLongerThan = (num) => (value) => value.length > num;

const isAlphaMsg = 'Must contain only letter characters.';
const isLongerThan1Msg = 'Must be at least 2 characters long.';
const isStrongPasswordMsg = 'Min. 8 symbols, 1 capital letter, 1 number, 1 special symbol.';

const { firstName, lastName,  password, submitBtn } = document.form;

const validation = Validation.group(

    Validation.group( 

        Validation(firstName)
            .validated(applyOutline()),

        Validation(lastName)
            .validated(applyOutline()),
    )
    .constraint(isAlpha, { msg: isAlphaMsg })
    .constraint(isLongerThan(1), { msg: isLongerThan1Msg }),

    Validation(password)
        .constraint(isStrongPassword, { msg: isStrongPasswordMsg })
        .validated(applyOutline()),
);

submitBtn.addEventListener('click', async (event) => {
    event.preventDefault();

    Array.prototype.forEach.call(document.form, field => {
        if (field !== submitBtn) field.nextElementSibling.innerHTML = '';
    });

    const result = await validation.validate();

    allInvalid(result).forEach(([field, { msg }]) => {
        const { innerHTML } = field.nextElementSibling;
        field.nextElementSibling.innerHTML = innerHTML + `<div>❗ ${msg}</div>`;
    });
});

