import { Validation } from "isomorphic-validation";
import { applyOutline, applyAccess, applyBox, renderFirstError } from "isomorphic-validation/ui";
import isEmail from "validator/es/lib/isEmail";
import isStrongPassword from "validator/es/lib/isStrongPassword";

const form = document.signinForm;

const delayedOutline = {
  false: { delay: 2000, value: '2px solid lightpink' },
  true: { delay: 500, value: '' },
};

const delayedAccess = {
  true: { delay: 600 },
};

const changedOutline = {
  false: { value: '2px solid lightpink' },
  true: { delay: 500, value: '' },
};

const editIcon = {
  false: { value: '🖊' },
  true: { value: '🖊' },
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

const emailIconEID = form.email.name;
const pwdIconEID = form.password.name;

form.addEventListener(
  'input',
  Validation.group(

    Validation(form.email)
      .constraint(isEmail, { err: 'Must be in the E-mail format.' })
      .validated(applyOutline(form.email.parentNode, delayedOutline))
      .changed(applyOutline(form.email.parentNode, changedOutline))
      .started(applyBox(form.email.parentNode, editIcon, emailIconEID))
      .validated(applyBox(form.email.parentNode, validIcon, emailIconEID))
      .validated(applyBox(form.email.parentNode, errMsg)),

    Validation(form.password)
      .constraint(isStrongPassword, { err: 'Min. 8 characters, 1 capital letter, 1 number, 1 special character.' })
      .validated(applyOutline(form.password.parentNode, delayedOutline))
      .changed(applyOutline(form.password.parentNode, changedOutline))
      .started(applyBox(form.password.parentNode, editIcon, pwdIconEID))
      .validated(applyBox(form.password.parentNode, validIcon, pwdIconEID))
      .validated(applyBox(form.password.parentNode, errMsg)),

  )
  .changed(applyAccess(form.submitBtn, delayedAccess))
);
