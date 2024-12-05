import { Validation } from "isomorphic-validation";

const obj = {
    a: [
        {
            b: 'b', // obj.a[0].b
        },
    ],
};

// will validate obj.a[1].c - which does not exist yet
const validation = Validation(obj, { path: 'a.1.c' });

// ...

// later
obj.a.push({ c: 'c' });

validation.validate();