import { Validation } from 'isomorphic-validation';
import { applyOutline } from 'isomorphic-validation/ui';
import isAlpha from 'validator/es/lib/isAlpha';

const { input1, input2, input3, input4, input5, input6, input7 } = document.form;

/** 1. Default outline */

input1.addEventListener(
    'input',
    Validation(input1)
        .constraint(isAlpha)
        .validated(applyOutline())
);

/** 2. Specified outlines */

const double = { 
    true: { value: '3px double mediumspringgreen'},
    false: { value: '3px double deeppink', delay: 2000 },
};

input2.addEventListener(
    'input',
    Validation(input2)
        .constraint(isAlpha)
        .validated(applyOutline(double))
);

/** 3. Overriden target */

input3.addEventListener(
    'input',
    Validation(input3)
        .constraint(isAlpha)
        .validated(applyOutline(input3.parentNode, double))
);

/** 4. Indicate only valid state */

const onlyValid = {
    false: { value: ''},
};

input4.addEventListener(
    'input',
    Validation(input4)
        .constraint(isAlpha)
        .validated(applyOutline(onlyValid))
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
        .validated(applyOutline(delayed))
);

/** 6. The same effect ID */

const clear = { 
    true: { value: '' },
    false: { value: '' },
};

const outlineEID = 'OUTLINE';

input6.addEventListener(
    'input',
    Validation(input6)
        .constraint(isAlpha)
        .started(applyOutline(clear, outlineEID))
        .validated(applyOutline(delayed, outlineEID))
);

/** 7. Clear only invalid state */

input7.addEventListener(
    'input',
    Validation(input7)
        .constraint(isAlpha)
        .started(applyOutline(onlyValid, outlineEID))
        .validated(applyOutline(delayed, outlineEID))
);