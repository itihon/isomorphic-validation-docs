import { Validation } from 'isomorphic-validation';
import { applyBox, renderProperty } from 'isomorphic-validation/ui';
import isAlpha from 'validator/es/lib/isAlpha';

const isLongerThan = (num) => (value) => value.length > num;
const hasJSLetters = (value) => /JS+/.test(value);

const isAlphaMsg = 'Must contain only letter characters.';
const isLongerThan5Msg = 'Must be at least 6 characters long.';
const hasJSLettersMsg = 'Must contain letters "J" and "S".';

const { input } = document.form;

const style = { 
    padding: '4px',
    fontSize: '12px',
    color: 'darkslategray',
    backgroundColor: 'white',
    boxShadow: 'rgba(0, 0, 0, 0.3) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px',
};

const msgBox = {
    mode: 'MAX_SIDE',
    position: 'BELOW_CENTER',
    style,
};

const renderLabel = (field) => 
    `<h4>The field "${field.previousElementSibling.innerText}"</h4><hr><br>`;

const renderError = (validator, propName) => 
    `<div>
        <span style="color: ${validator.isValid ? 'green' : 'red'}">
            ${validator.isValid ? '✔' : '✘'} 
        </span>
        <span>${validator[propName]}</span>
    </div>`;

const errToHTML = ([field, validator, propName], idx) => 
    idx === 0 
        ? renderLabel(field).concat(renderError(validator, propName))
        : renderError(validator, propName);

const allMsgs = {
    true: { value: renderProperty('err', errToHTML), delay: 0 },
    false: { value: renderProperty('err', errToHTML), delay: 0 },
    ...msgBox,
};

const allMsgsIfInvalid = {
    false: { value: renderProperty('err', errToHTML), delay: 0 },
    ...msgBox,
};

const allMsgsIfInvalidDelayed = {
    false: { value: renderProperty('err', errToHTML), delay: 1000 },
    ...msgBox,
};

const clearMsgsIfValidDelayed = {
    false: { value: renderProperty('err', errToHTML), delay: 1000 },
    true: { value: '', delay: 2000 },
    ...msgBox,
};

const msgBoxEID = 'MSG_BOX';

input.addEventListener(
    'input',
    Validation(input)
        .constraint(isAlpha, { err: isAlphaMsg })
        .constraint(isLongerThan(5), { err: isLongerThan5Msg })
        .constraint(hasJSLetters, { err: hasJSLettersMsg })
        .started(applyBox(allMsgsIfInvalid, msgBoxEID))
        .invalid(applyBox(allMsgsIfInvalidDelayed, msgBoxEID))
        .changed(applyBox(allMsgs, msgBoxEID))
        .changed(applyBox(clearMsgsIfValidDelayed, msgBoxEID))
);