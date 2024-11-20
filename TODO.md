## Bugs

- [ ] index.html in the url of the 'Edit in LiveCodes' button, (on localhost).
- [ ] http://localhost:4321/api/validation/instance-methods/constraint/#parameter-keepvalid
        http://localhost:4321/api/validation/instance-methods/constraint/#optional
    in Firefox the html renders twice in the playground
- [ ] The edit page link in every page's footer should lead to the docs repository whereas the social link should lead to the library's repository

## Docs

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

- [ ] credits
    - [ ] astro, starlight
    - [ ] livecodes
    - [ ] logo svg icons https://www.svgrepo.com

- [x] API
    - [ ] ValidationResult

- [ ] .restored() docs: isValid property of the passed in ValidationResult object is always `false`.

- [x] Use <Code> component from Starlight instead of markdown code blocks
- [x] Override Starlight's Hero component so it renders links with regard to the base url
- [ ] Use Vite's `raw` parameter to pass examples to Playground instead of fetching them.