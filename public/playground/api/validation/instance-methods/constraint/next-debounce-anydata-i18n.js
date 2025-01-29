import { Predicate, Validation } from "isomorphic-validation";
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
                isEmailRegisteredStartedMsg: 'Checking registration...',
            },
        },
        ru: {
            translation: {
                promptMsg: 'Попробуйте набрать "john.doe@mail.me".',
                isEmailErrorMsg: 'Должен быть в формате эл.почты.',
                isEmailRegisteredErrorMsg: 'Эл.почта должна быть зарегистрирована.',
                isEmailRegisteredStartedMsg: 'Проверка регистрации...',
            },
        },
    },
});

// helpers

const firstInvalid = (res) => {
    for (let [,validator] of res) {
        if (!validator.isValid) {
            return validator;
        }
    }
};

const theFirstOne = (res) => {
    const [[,validator]] = res;
    return validator;
};

const i18nMsg = (res) => {
    const { type } = res;
    const validator = firstInvalid(res) || theFirstOne(res);
    const msgKey = validator[`${type}MsgKey`];

    return `<div data-i18n="${msgKey}">${i18next.t(msgKey)}</div>`;
};

const i18nRerender = () => {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        element.innerText = i18next.t(element.dataset.i18n);
    });
};

// UI effects

const msgAfter = (element, msgRetreiver = () => '') => {
    let timeout;

    const show = (delay) => (res) => {
        timeout = setTimeout(() => {
            element?.nextSibling?.remove();
            element.insertAdjacentHTML('afterend', msgRetreiver(res));
        }, delay);
    };

    const cancel = () => clearTimeout(timeout);

    return [show, cancel];
};

const [showInitialIcon, /* not used */]    = msgAfter(emailField, () => '✔');
const [showWaitIcon, cancelWaitIcon]       = msgAfter(emailField, () => '⏳');
const [showValidIcon, /* not used */]      = msgAfter(emailField, () => '✅');
const [showInvalidIcon, cancelInvalidIcon] = msgAfter(emailField, () => '⛔');

const [showInitialMsg, /* not used */]   = msgAfter(document.form, () => '...');
const [showStartedMsg, cancelStartedMsg] = msgAfter(document.form, i18nMsg);
const [showInvalidMsg, cancelInvalidMsg] = msgAfter(document.form, i18nMsg);
const [clearMsg, /* not used */]         = msgAfter(document.form);

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
            invalidMsgKey: 'isEmailErrorMsg', // i18n key
        },
    )
    .constraint(
        Predicate(isEmailRegistered)
            .started(showWaitIcon(1000)) // delayed icon show
            .started(showStartedMsg(1000)), // delayed message show
        { 
            debounce: 5000, 
            startedMsgKey: 'isEmailRegisteredStartedMsg', // i18n key
            invalidMsgKey: 'isEmailRegisteredErrorMsg', // i18n key
         },
    )
    .started(cancelWaitIcon, cancelInvalidIcon) // cancel delayed icon shows
    .started(showInitialIcon())
    .valid(showValidIcon())
    .invalid(showInvalidIcon(500)) // delayed icon show

    .started(cancelStartedMsg, cancelInvalidMsg) // cancel delayed message shows
    .started(showInitialMsg())
    .valid(clearMsg())
    .invalid(showInvalidMsg(500)); // delayed message show

emailField.addEventListener('input', emailV);
locale.addEventListener('change', (e) => i18next.changeLanguage(e.target.value));
locale.addEventListener('change', i18nRerender);
window.addEventListener('load', i18nRerender);

