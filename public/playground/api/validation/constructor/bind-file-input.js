import { Validation } from "isomorphic-validation";

const inputFile = document.form.file;

// will validate metadata of inputFile.files[0] - which does not exist yet
const fileValidation = Validation(inputFile, { path: 'files.0' });

// ... add file type and size constraints

// validate on change
inputFile.addEventListener('change', (e) => {
    // now inputFile.files[0] exists
    if (inputFile.files.length) {
        fileValidation.validate();
    }
});