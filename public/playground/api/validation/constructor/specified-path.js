import { Validation } from "isomorphic-validation";

const validatableObject = {
    meaningOfLife: '42',
};

// will validate validatableObject.meaningOfLife
const validation = Validation(validatableObject, 'meaningOfLife');