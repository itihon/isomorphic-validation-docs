import { Predicate, Validation } from "isomorphic-validation";
import { applyBox, renderFirstError, renderProperty } from 'isomorphic-validation/ui';
import i18next from 'i18next';

const emailField = document.form.email;
const locale = window.locale;

i18next.init({
    lng: locale.value,
    resources: {
        en: {
            translation: {
                promptMsg: 'Try to enter "john.doe@mail.me".',
                isEmailErrorMsg: 'Must be in the e-mail format.',
                isEmailRegisteredErrorMsg: 'The e-mail must be registered.',
                isEmailRegisteredWaitMsg: 'Checking registration...',
            },
        },
        ru: {
            translation: {
                promptMsg: 'Попробуйте набрать "john.doe@mail.me".',
                isEmailErrorMsg: 'Должен быть в формате эл.почты.',
                isEmailRegisteredErrorMsg: 'Эл.почта должна быть зарегистрирована.',
                isEmailRegisteredWaitMsg: 'Проверка регистрации...',
            },
        },
    },
});

// helpers

const i18nMsg = ([, validator, propName]) => {
    const msgKey = validator[propName];
    return `<div data-i18n="${msgKey}">${i18next.t(msgKey)}</div>`;
};

const i18nRerender = () => {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        element.innerText = i18next.t(element.dataset.i18n);
    });
};

// UI effects

const iconEID = 'ICON';
const msgEID = 'MSG';

const msgBoxCfg = { 
    position: 'BELOW_CENTER', 
    mode: 'MAX_SIDE',
    style: { width: '100%' },
};

const validityIcons = {
    true: { value: '✅' },
    false: { value: '⛔', delay: 2000 },
};

const editIcon = {
    true: { value: '🖊' },
    false: { value: '🖊' },
};

const waitIcon = {
    true: { value: '⏳', delay: 1000 },
    false: { value: '⏳', delay: 1000 },
};

const editMsg = {
    true: { value: '...' },
    false: { value: '...' },
    ...msgBoxCfg,
};

const waitMsg = {
    true: { value: renderProperty('waitMsgKey', i18nMsg), delay: 1000 },
    false: { value: renderProperty('waitMsgKey', i18nMsg), delay: 1000 },
    ...msgBoxCfg,
};

const errorMsg = {
    false: { value: renderFirstError('errorMsgKey', i18nMsg), delay: 2000 },
    ...msgBoxCfg,
};

// predicate functions

const isEmail = (value) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
const isEmailRegistered = (value) => new Promise(res => {
    console.log('Making a request...', value);
    setTimeout(res, 1500, value === 'john.doe@mail.me'); // mock request delay
});

// validations

const emailV = Validation(emailField)
    .constraint(
        isEmail,
        { 
            next: false, 
            errorMsgKey: 'isEmailErrorMsg', // i18n key
        },
    )
    .constraint(
        Predicate(isEmailRegistered)
            .started(applyBox(waitIcon, iconEID)) 
            .started(applyBox(waitMsg, msgEID)), 
        { 
            debounce: 5000, 
            waitMsgKey: 'isEmailRegisteredWaitMsg', // i18n key
            errorMsgKey: 'isEmailRegisteredErrorMsg', // i18n key
         },
    )
    .started(applyBox(editIcon, iconEID))
    .validated(applyBox(validityIcons, iconEID))
    .started(applyBox(editMsg, msgEID))
    .validated(applyBox(errorMsg, msgEID));

emailField.addEventListener('input', emailV);
locale.addEventListener('change', (e) => i18next.changeLanguage(e.target.value));
locale.addEventListener('change', i18nRerender);
window.addEventListener('load', i18nRerender);

