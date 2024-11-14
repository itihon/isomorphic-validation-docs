import { Validation } from "isomorphic-validation";

const validatableObject = {
    value: '42',
};

// will validate validatableObject.value
const validation = Validation(validatableObject);