## Bugs

- [ ] index.html in the url of the 'Edit in LiveCodes' button, (on localhost).
- [x] http://localhost:4321/api/validation/instance-methods/constraint/#parameter-keepvalid
        http://localhost:4321/api/validation/instance-methods/constraint/#optional
    in Firefox the html renders twice in the playground
    FIXED: Livecodes' params { console: 'closed' };
    CAUSE: Livecodes' params { console: 'none' };

## Docs

- [ ] installation (npm, CDN, minified), additionally setting up a module bundler
    in the npm package, CJS and ESM modules are shipped uncompressed.

- [x] concept 
    - [ ] Validation and Predicate api
    - [ ] state callbacks
    - [ ] single Validation
    - [ ] grouping Validations
            - same predicate group instances in a grouping validation and grouped validations
            - constraints added to a grouping validation are added to the grouped validations
    - [ ] cloning Validations
    - [ ] cloning Predicates
    - [ ] middleware and event handler
    - [ ] isomorphic api and execution environment separation
    - [x] chaining and conditional execution validations as state callbacks
    - [ ] environment separation
        separation predicates and callbacks for environments
        execution of .validate() method on client side only for prefilled with saved by browser values form fields. Validation().client.validate();

- [ ] credits
    - [ ] astro 
    - [x] starlight
    - [ ] livecodes
    - [ ] logo svg icons https://www.svgrepo.com
    - [ ] inspiration

- [ ] /api/concept/grouping-validations `Validation.group().changed()`, "changed" state callbacks of a grouping validations doesn't require the `Validation().validate()` method to be invoked
    in comparison to the rest state callbacks

- [ ] /api/concept/state-callbacks started, valid, invalid, validated state callbacks can be thought of as "hooks" whereas changed callbacks are more like a notification for subscribers.

- [ ] /api/validation/static-methods/profile parameters path and initValue are used to recreate form fields structure
- [ ] /api/validation/static-methods/profile exceptions: empty string field name

- [ ] state callbacks run synchronously, they are not awaited

- [x] API
    - [ ] ValidationResult

- [ ] .restored() docs: isValid property of the passed in ValidationResult object is always `false`.

- [x] Use <Code> component from Starlight instead of markdown code blocks
- [x] Override Starlight's Hero component so it renders links with regard to the base url
- [x] Use Vite's `raw` parameter to pass examples to Playground instead of fetching them.
- [ ] keywords: functional

- [ ] Validation() example: validating a particular string character: Validation('asdf', { path: '0'}).constraint(function isCharA(value){ return value === 'a'; });

## Examples
   
    - [ ] add `.error()` state callbacks to all playground examples
    - [ ] client and server side specific constraints in /concept/execution-environment-separation/