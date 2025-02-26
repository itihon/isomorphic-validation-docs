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
    width: '100%',
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

const renderError = (validator) => 
    `<div>
        <span style="color: ${validator.isValid ? 'green' : 'red'}">
            ${validator.isValid ? '✔' : '✘'} 
        </span>
        <span>${validator.err}</span>
    </div>`;

const errToHTML = ([field, validator], idx) => 
    idx === 0 
        ? renderLabel(field).concat(renderError(validator))
        : renderError(validator);

const allMsgs = {
    false: { value: renderProperty('err', errToHTML), delay: 0 },
    true: { value: renderProperty('err', errToHTML), delay: 0 },
    ...msgBox,
};

const allMsgsDelayed = {
    false: { value: renderProperty('err', errToHTML), delay: 1000 },
    true: { value: renderProperty('err', errToHTML), delay: 0 },
    ...msgBox,
};

const clearMsgsOnValid = {
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
        .started(applyBox(allMsgs, msgBoxEID))
        .validated(applyBox(allMsgsDelayed, msgBoxEID))
        .validated(applyBox(clearMsgsOnValid, msgBoxEID))
);