import { Predicate, Validation } from "isomorphic-validation";

const useCaretPos = (inputField) => {
    let caretPos;

    const save = () => { caretPos = inputField.selectionStart - 1; };
    const restore = () => { inputField.setSelectionRange(caretPos, caretPos); };

    return [save, restore];
};

// predicate function
const isOnlyLetters = (value) => /^[A-Za-z]+$/.test(value);

const firstNameField = document.form.name;

const [saveCaretPos, restoreCaretPos] = useCaretPos(firstNameField);

firstNameField.addEventListener(
    'input', 
    Validation(firstNameField)
        .constraint(
            Predicate(isOnlyLetters)
                .started(saveCaretPos)
                .restored(restoreCaretPos),
            { keepValid: true },
        ),
);

