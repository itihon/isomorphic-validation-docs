import { Validation } from 'isomorphic-validation';
import { applyBackground } from 'isomorphic-validation/ui';
import isAlpha from 'validator/es/lib/isAlpha';

const { input1, input2, input3, input4, input5, input6, input7 } = document.form;

/** 1. Default background */

input1.addEventListener(
    'input',
    Validation(input1)
        .constraint(isAlpha)
        .validated(applyBackground())
);

/** 2. Specified backgrounds */

const gradient = { 
    true: { value: 'radial-gradient(#d9ffd9, whitesmoke)'},
    false: { value: 'radial-gradient(mistyrose, whitesmoke)', delay: 2000 },
};

input2.addEventListener(
    'input',
    Validation(input2)
        .constraint(isAlpha)
        .validated(applyBackground(gradient))
);

/** 3. Overriden target */

input3.addEventListener(
    'input',
    Validation(input3)
        .constraint(isAlpha)
        .validated(applyBackground(input3.parentNode, gradient))
);

/** 4. Indicate only valid state */

const onlyValid = {
    false: { value: ''},
};

input4.addEventListener(
    'input',
    Validation(input4)
        .constraint(isAlpha)
        .validated(applyBackground(onlyValid))
);

/** 5. Delayed effect */

const delayed = {
    true: { delay: 300 },
    false: { delay: 2000 },
};

input5.addEventListener(
    'input',
    Validation(input5)
        .constraint(isAlpha)
        .validated(applyBackground(delayed))
);

/** 6. The same effect ID */

const clear = { 
    true: { value: '' },
    false: { value: '' },
};

const bgEID = 'BACKGROUND';

input6.addEventListener(
    'input',
    Validation(input6)
        .constraint(isAlpha)
        .started(applyBackground(clear, bgEID))
        .validated(applyBackground(delayed, bgEID))
);

/** 7. Clear only invalid state */

input7.addEventListener(
    'input',
    Validation(input7)
        .constraint(isAlpha)
        .started(applyBackground(onlyValid, bgEID))
        .validated(applyBackground(delayed, bgEID))
);