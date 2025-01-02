import { Validation } from './libs/isomorphic-validation.mjs';

// predicate functions
const isFileLargerThan = (number) => ({size}) => size > number;
const isFileSmallerThan = (number) => ({size}) => size < number;
const isImage = ({type}) => type === 'image/jpeg' || type === 'image/png';

const fileValidation = Validation({}, { path: 'files.0', initValue: {} })
    .constraint(
        isFileLargerThan(200), 
        { msg: 'Must not be an empty file.' },
    )
    .constraint(
        isFileSmallerThan(1000001), 
        { msg: 'Must be smaller than 1MB.' },
    )
    .constraint(
        isImage, 
        { msg: 'Must be a .png or .jpeg image.'},
    );

const [, uploadValidation] = Validation.profile(
    '[name=upload]', ['file'], [fileValidation]
);

export default uploadValidation;