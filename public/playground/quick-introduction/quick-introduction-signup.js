import { Validation } from "isomorphic-validation";
import { applyOutline, applyAccess, applyBox, renderFirstError, renderProperty } from "isomorphic-validation/ui";
import isEmail from "validator/es/lib/isEmail";
import isStrongPassword from "validator/es/lib/isStrongPassword";
import equals from "validator/es/lib/equals";

// registered e-mail: emily.johnson@x.dummyjson.com
const isEmailNotRegistered = (value) => fetch(
  `https://dummyjson.com/users/filter?key=email&value=${value}`
).then(res => res.json()).then(res => res.total === 0);

const form = document.signupForm;

const delayedOutline = {
  false: { delay: 2000, value: '2px solid lightpink' },
  true: { delay: 500, value: '' },
};

const delayedAccess = {
  true: { delay: 600 },
};

const disabledAccess = {
  false: { value: true },
  true: { value: true },
};

const remainedOutline = {
  false: { delay: 20000, value: '' },
  true: { delay: 20000, value: '' },
};

const changedOutline = {
  false: { delay: 500, value: '2px solid lightpink' },
  true: { delay: 500, value: '' },
};

const editIcon = {
  false: { value: '🖊' },
  true: { value: '🖊' },
  position: 'LEVEL_RIGHT',
};

const loadImg = `
<img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDUwIDUwIj4KICA8Y2lyY2xlIGN4PSIyNSIgY3k9IjI1IiByPSIyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNjBBNUZBIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWRhc2hhcnJheT0iNjAgMTIwIj4KICAgIDxhbmltYXRlVHJhbnNmb3JtIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSIgdHlwZT0icm90YXRlIiBmcm9tPSIwIDI1IDI1IiB0bz0iMzYwIDI1IDI1IiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSI+PC9hbmltYXRlVHJhbnNmb3JtPgogIDwvY2lyY2xlPgo8L3N2Zz4=" alt="SVG Image" />
`;

const loadIcon = {
  false: { delay: 1000, value: loadImg },
  true: { delay: 1000, value: loadImg },
  position: 'LEVEL_RIGHT',
};

const validIcon = {
  false: { delay: 1000, value: '' },
  true: { delay: 500, value: '✔' },
  position: 'LEVEL_RIGHT_BESIDE',
  style: { color: 'green', left: '-8px' },
};

const errMsg = {
  false: { delay: 2000, value: renderFirstError('err') },
  position: 'BELOW_CENTER',
  mode: 'MAX_SIDE',
  style: { color: 'firebrick', fontSize: '12px', padding: '4px' },
};

const changedMsg = {
  false: { delay: 500, value: renderFirstError('err') },
  position: 'BELOW_CENTER',
  mode: 'MAX_SIDE',
  style: { color: 'firebrick', fontSize: '12px', padding: '4px' },
};

const waitMsg = {
  false: { delay: 1000, value: renderProperty('waitMsg') },
  true: { delay: 1000, value: renderProperty('waitMsg') },
  position: 'BELOW_CENTER',
  mode: 'MAX_SIDE',
  style: { color: 'steelblue', fontSize: '12px', padding: '4px' },
};

const validations = [
  Validation(form.email)
    .constraint(isEmail, { 
      err: 'Must be in the E-mail format.', 
      next: false 
    })
    .constraint(isEmailNotRegistered, { 
      err: 'The E-mail must not be already registered.',
      waitMsg: 'Wait a moment, we are checking your E-mail.',
      debounce: 5000,
    }),

  ...Validation.glue(

    Validation(form.password)
      .constraint(isStrongPassword, { 
        err: 'Min. 8 characters, 1 capital letter, 1 number, 1 special character.' 
      }),

    Validation(form.pwdConfirm),
  )
  .constraint(equals, { 
    err: 'Password and password confirmation must be the same.' 
  })
  .validations,
];

form.addEventListener(
  'input',
  Validation.group(

    validations.map(
      (validation, idx) => {

        const iconEID = form[idx].name + 'icon';
        const errMsgEID = form[idx].name + 'error';
        const outlineEID = form[idx].name + 'outline';
        const formField = form[idx].parentNode;

        return validation
          .started(
            applyOutline(formField, remainedOutline, outlineEID),
            applyBox(formField, editIcon, iconEID),
            applyBox(formField, loadIcon, iconEID),
            applyBox(formField, waitMsg, errMsgEID),
          )
          .changed(
            applyOutline(formField, changedOutline, outlineEID),
            applyBox(formField, validIcon, iconEID),
            applyBox(formField, changedMsg, errMsgEID),
          )
          .validated(
            applyOutline(formField, delayedOutline, outlineEID),
            applyBox(formField, validIcon, iconEID),
            applyBox(formField, errMsg, errMsgEID),
          );
      }
    )
  )
  .started(applyAccess(form.submitBtn, disabledAccess))
  .validated(applyAccess(form.submitBtn, delayedAccess))
);
