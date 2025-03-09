import { Validation } from 'isomorphic-validation';
import { applyBox, renderFirstError } from 'isomorphic-validation/ui';
import isAlpha from 'validator/es/lib/isAlpha';

const isLongerThan = (num) => (value) => value.length > num;
const hasJSLetters = (value) => /JS+/.test(value);

const isAlphaMsg = 'Must contain only letter characters.';
const isLongerThan5Msg = 'Must be at least 6 characters long.';
const hasJSLettersMsg = 'Must contain letters "J" and "S".';

const { input1, input2 } = document.form;

const style = { 
    padding: '4px',
    fontSize: '12px',
    color: 'firebrick',
    backgroundColor: 'white',
    boxShadow: 'rgba(0, 0, 0, 0.3) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px',
};

const msgBox = {
    mode: 'MAX_SIDE',
    position: 'BELOW_CENTER',
    style,
};

/** 1. Default */

const firstError = {
    false: { value: renderFirstError() },
    ...msgBox,
};

input1.addEventListener(
    'input',
    Validation(input1)
        .constraint(isAlpha, { msg: isAlphaMsg })
        .constraint(isLongerThan(5), { msg: isLongerThan5Msg })
        .constraint(hasJSLetters, { msg: hasJSLettersMsg })
        .validated(applyBox(firstError))
);

/** 2. Custom property name and "toString" function */

const renderLabel = (field) => 
    `<h4>The field "${field.previousElementSibling.innerText}"</h4><hr><br>`;

const renderError = (err) => 
    `<div><span>❗ </span><span>${err}</span></div>`;

const errToHTML = ([field, validator, propName], idx) => 
    idx === 0 
        ? renderLabel(field).concat(renderError(validator[propName]))
        : renderError(validator[propName]);

const firstErrorDelayed = {
    false: { value: renderFirstError('err', errToHTML), delay: 2000 },
    ...msgBox,
};

input2.addEventListener(
    'input',
    Validation(input2)
        .constraint(isAlpha, { err: isAlphaMsg })
        .constraint(isLongerThan(5), { err: isLongerThan5Msg })
        .constraint(hasJSLetters, { err: hasJSLettersMsg })
        .validated(applyBox(firstErrorDelayed))
);