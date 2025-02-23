import { Validation } from 'isomorphic-validation';
import { applyAccess, applyBox } from 'isomorphic-validation/ui';
import isAlpha from 'validator/es/lib/isAlpha';

const { input1, button1, input2, button2, input3, input3_1 } = document.form;

/** 1. Default */

input1.addEventListener(
    'input',
    Validation(input1)
        .constraint(isAlpha)
        .validated(applyAccess(button1))
);

/** 2. Disable an element */

const disabled = { 
    true: { value: true },
    false: { value: true },
};

const iconEID = 'WAIT_ICON';

const waitIcon = {
  true: { value: '⌛', delay: 2000 },
  false: { value: '⌛', delay: 2000 },
  position: 'LEVEL_RIGHT',
};

const isNotProfanity = async (message) => {
    console.log('... Profanity check. Making a request:', message);
    
    const resp = await fetch('https://vector.profanity.dev', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
    });

    const obj = await resp.json();

    return !obj.isProfanity;
};

input2.addEventListener(
    'input',
    Validation(input2)
        .constraint(isAlpha, { next: false })
        .constraint(isNotProfanity, { debounce: 3000 })

        .started(applyAccess(button2, disabled))
        .validated(applyAccess(button2))

        .started(applyBox(iconEID))
        .started(applyBox(waitIcon, iconEID))
        .validated(applyBox(iconEID))
);

/** 3. Delayed */

const delayedEnabled = {
    true: { delay: 2000 },
};

input3.addEventListener(
    'input',
    Validation(input3)
        .constraint(isAlpha)
        .validated(applyAccess(input3_1, delayedEnabled))
);