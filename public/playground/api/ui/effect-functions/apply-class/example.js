import { Validation } from 'isomorphic-validation';
import { applyClass } from 'isomorphic-validation/ui';
import isAlpha from 'validator/es/lib/isAlpha';

const { input1, input2, input3, input4, input5, input6, input7 } = document.form;

/** 1. Default class names */

input1.addEventListener(
    'input',
    Validation(input1)
        .constraint(isAlpha)
        .validated(applyClass())
);

/** 2. Specified class names */

const rightBorder = { 
    true: { value: 'valid_field'},
    false: { value: 'invalid_field', delay: 2000 },
};

input2.addEventListener(
    'input',
    Validation(input2)
        .constraint(isAlpha)
        .validated(applyClass(rightBorder))
);

/** 3. Overriden target */

input3.addEventListener(
    'input',
    Validation(input3)
        .constraint(isAlpha)
        .validated(applyClass(input3.parentNode, rightBorder))
);

/** 4. Indicate only valid state */

const onlyValid = {
    false: { value: ''},
};

input4.addEventListener(
    'input',
    Validation(input4)
        .constraint(isAlpha)
        .validated(applyClass(onlyValid))
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
        .validated(applyClass(delayed))
);

/** 6. The same effect ID */

const clear = { 
    true: { value: '' },
    false: { value: '' },
};

const underlineEID = 'UNDERLINE';

input6.addEventListener(
    'input',
    Validation(input6)
        .constraint(isAlpha)
        .started(applyClass(clear, underlineEID))
        .validated(applyClass(delayed, underlineEID))
);

/** 7. Clear only invalid state */

input7.addEventListener(
    'input',
    Validation(input7)
        .constraint(isAlpha)
        .started(applyClass(onlyValid, underlineEID))
        .validated(applyClass(delayed, underlineEID))
);