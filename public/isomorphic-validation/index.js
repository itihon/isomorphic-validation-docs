const SINGLE = Symbol('Validation.single');
const GROUPED = Symbol('Validation.grouped');
const GLUED = Symbol('Validation.glued');

const PROPNAME = 'value';
const INITVAL = '';

var preventCyclicSubscription = ((registry) =>
  function preventCyclicSubsription(subscriberID, subjectID) {
    const subscriberSubscriptions = registry.get(subscriberID) || new Set();
    const subjectSubscriptions = registry.get(subjectID) || new Set();

    if (subscriberID === subjectID) {
      throw new Error('Self subscription');
    }

    if (subjectSubscriptions.has(subscriberID)) {
      throw new Error('Cyclic subscription');
    }

    subscriberSubscriptions.add(subjectID);

    subjectSubscriptions.forEach((id) => {
      subscriberSubscriptions.add(id);
    });

    registry.set(subscriberID, subscriberSubscriptions);
  })(new Map());

function isFunction(arg) {
  return typeof arg === 'function' && arg.toString().slice(0, 5) !== 'class';
}

function Functions(iterable = [][Symbol.iterator]()) {
  const obj = { ...iterable, length: 0 };
  obj.length = Object.keys(obj).length - 1;

  const fns = Array.from(obj).filter(isFunction);

  function push(...args) {
    Array.prototype.push.call(fns, ...args.filter(isFunction));
    return this;
  }

  function run(...args) {
    return fns.map((fn) => fn(...args));
  }

  return Object.defineProperties(fns, {
    push: { value: push },
    run: { value: run },
    [Symbol.toStringTag]: { value: Functions.name },
  });
}

function ObserverAnd(initVal = false) {
  if (!ObserverAnd.slotCount) {
    ObserverAnd.slotCount = 0;
  }

  const ID = ++ObserverAnd.slotCount;
  const onChangedCBs = Functions();
  const slots = new Map().set(ID, initVal);

  let sum = initVal ? ID : 0;
  let depSum = ID;
  let ownValue = sum === depSum;
  let oldValue = initVal;

  return {
    subscribe(subject = ObserverAnd()) {
      const subjectID = subject.getID();

      preventCyclicSubscription(ID, subjectID);

      if (!slots.has(subjectID)) {
        depSum += subjectID;
        slots.set(subjectID, false);
        subject.onChanged(this.update);
        this.update(subject.getValue(), undefined, subjectID);

        // unsubscribe from ourselves
        // from now on our own state depends only on the subjects
        if (slots.has(ID)) {
          this.update(true);
          slots.delete(ID);
        }
      }
      return this;
    },
    update(value = false, args = undefined, id = ID) {
      if (value === true) {
        if (slots.get(id) === false) {
          sum += id;
          slots.set(id, value);
        }
      } else if (slots.get(id) === true) {
        sum -= id;
        slots.set(id, value);
      }

      oldValue = ownValue;
      ownValue = sum === depSum;

      if (ownValue !== oldValue) {
        onChangedCBs.run(value, args, ID);
      }

      return ownValue;
    },
    getID() {
      return ID;
    },
    getValue: () => ownValue,
    onChanged: onChangedCBs.push,
    [Symbol.toStringTag]: ObserverAnd.name,
  };
}

// !refactor to ValidityEvents
// set() -> emit()
function ValidityCallbacks(
  initVal = false,
  CBs = ValidityCallbacks(false, {}),
) {
  let isValid = initVal;
  let { validCBs, invalidCBs, changedCBs, validatedCBs, startedCBs, errorCBs } =
    CBs ? CBs.valueOf() : {};

  validCBs = Functions(validCBs);
  invalidCBs = Functions(invalidCBs);
  changedCBs = Functions(changedCBs);
  validatedCBs = Functions(validatedCBs);
  startedCBs = Functions(startedCBs);
  errorCBs = Functions(errorCBs);

  return {
    set(value = false, cbArgs = undefined) {
      if (value) {
        validCBs.run(cbArgs);
      } else {
        invalidCBs.run(cbArgs);
      }

      isValid = value;

      validatedCBs.run(cbArgs);

      return isValid;
    },
    change(value = false, cbArgs = undefined) {
      isValid = value;
      changedCBs.run(cbArgs);
      return isValid;
    },
    valueOf() {
      return {
        validCBs,
        invalidCBs,
        changedCBs,
        validatedCBs,
        startedCBs,
        errorCBs,
      };
    },
    start: startedCBs.run,
    started: startedCBs.push,
    valid: validCBs.push,
    invalid: invalidCBs.push,
    changed: changedCBs.push,
    validated: validatedCBs.push,
    catch: errorCBs.run,
    error: errorCBs.push,
    [Symbol.toStringTag]: ValidityCallbacks.name,
  };
}

function ManyToManyMap() {
  const values = new Set(); // for faster access to all unique values
  const map = new Map();
  const orderedSet = new Set(); // for consistency of mapping and merging order

  Object.defineProperties(map, {
    [Symbol.toStringTag]: {
      value: ManyToManyMap.name,
      configurable: true,
    },
  });

  return Object.assign(map, {
    add(key, value, keepOrder = true) {
      values.add(value);

      if (map.has(key)) {
        const set = map.get(key);
        const { size } = set;

        set.add(value);

        if (size !== set.size) {
          if (keepOrder) orderedSet.add([key, value]);
        }
      } else {
        map.set(key, new Set().add(value));
        if (keepOrder) orderedSet.add([key, value]);
      }

      return this;
    },
    changeKey(oldKey, newKey) {
      if (oldKey === newKey) {
        throw new Error('Old key must not be the same as new key');
      }
      if (map.has(oldKey)) {
        map.get(oldKey).forEach((value) => map.add(newKey, value, false));
        map.delete(oldKey);
        orderedSet.forEach((entry) => {
          if (entry[0] === oldKey) {
            entry[0] = newKey;
          }
        });
      } else {
        throw new Error('There is no such old key');
      }
      return this;
    },
    getAll() {
      return values;
    },
    mergeWith(mtmm = ManyToManyMap()) {
      mtmm.forEach((value, key) => this.add(key, value));
      return this;
    },
    forEach(cbfunction = (/* value, key, values */) => {}) {
      orderedSet.forEach(([key, value]) => {
        cbfunction(value, key, map);
      });
    },
    map(cbfunction = (/* value, key, values */) => {}) {
      const mtmm = ManyToManyMap();
      this.forEach((value, key, valuesSet) =>
        mtmm.add(key, cbfunction(value, key, valuesSet)),
      );
      return mtmm;
    },
  });
}

// !think through how to move out same usage of this function
//  from ObservablePredicate and ObservablePredicates below
function ConsoleRepresentation(
  name = 'Representation',
  obj = {},
  descriptors = Object.getOwnPropertyDescriptors({}),
) {
  return Object.defineProperties(Object.defineProperties(obj, descriptors), {
    [Symbol.toStringTag]: { value: name, configurable: true },
  });
}

// !JSON representation should be generated in advance.
// ! when toJSON is being called, the representation should be ready to use

const SERVER = Symbol('server');
const CLIENT = Symbol('client');

const getEnv = () =>
  typeof document !== 'undefined'
    ? CLIENT
    : typeof process !== 'undefined'
      ? SERVER
      : undefined;

const ENV = getEnv();
const IS_SERVER = ENV === SERVER;
const IS_CLIENT = ENV === CLIENT;

const ifSide = (onServer, onClient) => {
  if (IS_CLIENT) {
    return onClient;
  }

  if (IS_SERVER) {
    return onServer;
  }

  throw new Error("Couldn't define if it is a client or a server.");
};

function makeIsomorphicAPI(
  api = {},
  {
    serverPropName = 'server',
    clientPropName = 'client',
    selfPropName = 'isomorphic',
    redefine = false,
    excludeFunctions = ['valueOf'],
  } = {},
) {
  const propNames = new Set([serverPropName, clientPropName, selfPropName]);

  if (propNames.size !== 3) {
    throw new Error('Isomorphic API property names must be unique');
  }

  if (!redefine) {
    propNames.forEach((propName) => {
      if (propName in api) {
        throw new Error(
          `Property name "${propName}" exists in ${JSON.stringify(api)}.` +
            ` Set another property name or redefine=true`,
        );
      }
    });
  }

  const exclude = new Set([...excludeFunctions, ...propNames]);

  let originalAPI = api;

  function ignored() {
    if (this !== ignored) originalAPI = this;
    return ignored;
  }

  function original() {
    if (this !== ignored) originalAPI = this;
    return originalAPI;
  }

  const makePropDescrForExecEnv = (isInExecEnv) => ({
    get: isInExecEnv ? original : ignored,
    configurable: true,
  });

  Reflect.setPrototypeOf(
    ignored,
    new Proxy(api, {
      get(target, propName, receiver) {
        if (!exclude.has(propName)) {
          return ignored;
        }

        return Reflect.get(target, propName, receiver);
      },
    }),
  );

  return Object.defineProperties(api, {
    [serverPropName]: makePropDescrForExecEnv(IS_SERVER),
    [clientPropName]: makePropDescrForExecEnv(IS_CLIENT),
    [selfPropName]: makePropDescrForExecEnv(true),
  });
}

function Predicate(fnOrPred) {
  if (!isFunction(fnOrPred) && !(fnOrPred instanceof Predicate)) return null;

  let restoredCBs;
  let validityCBs;

  const fn = ({ restoredCBs, validityCBs } = fnOrPred.valueOf()).valueOf();

  restoredCBs = Functions(restoredCBs);
  validityCBs = ValidityCallbacks(false, validityCBs);

  const predicate = {
    valueOf() {
      return { restoredCBs, validityCBs, valueOf: () => fn };
    },
    valid: validityCBs.valid,
    invalid: validityCBs.invalid,
    changed: validityCBs.changed,
    validated: validityCBs.validated,
    started: validityCBs.started,
    restored: restoredCBs.push,
    error: validityCBs.error,
    // !consider for adding: deferred (or delayed), canceled???
    [Symbol.toStringTag]: Predicate.name,
  };

  Reflect.setPrototypeOf(predicate, Predicate.prototype);

  return makeIsomorphicAPI(predicate);
}

// const randomID = (prefix = '') => prefix + (Math.random()*1e6).toString().replace('.', '_');
var indexedName = (function indexedName() {
  let counter = 0;
  return (name = '', delim = '_') => name + delim + counter++;
})();

const pathError = (obj, path) => {
  throw new Error(
    `There is no path '${path}' in object ${JSON.stringify(obj)}`,
  );
};

const traverse = (object, propName) => object[propName];

function getByPath(
  obj = {},
  path = '',
  delim = '.',
  isPath = path.includes(delim),
) {
  if (isPath) {
    try {
      // ! split it in ValidatableItem in init()
      return path.split(delim).reduce(traverse, obj);
    } catch {
      pathError(obj, path);
    }
  }
  return obj[path];
}

function setByPath(
  obj = {},
  path = '',
  value = '',
  delim = '.',
  isPath = path.includes(delim),
) {
  if (isPath) {
    const arr = path.split(delim);
    const lastIdx = arr.length - 1;

    arr.reduce((object, propName, idx) => {
      if (idx === lastIdx) {
        object[propName] = value;
      }
      return object[propName];
    }, obj);
  } else {
    obj[path] = value;
  }
}

ValidatableItem.keepValid = (
  items = [],
  validationResult = { isValid: false },
) => {
  const { isValid } = validationResult;
  if (isValid === true) {
    items.forEach((item) => item.saveValue());
  } else {
    items.forEach((item) => item.restoreValue(validationResult));
  }
  return !isValid;
};

function ValidatableItem(
  obj = {},
  path = '',
  initVal = undefined,
  onRestoredCBs = Functions(),
) {
  const ownOnRestoredCBs = Functions(onRestoredCBs);
  const values = new Map();
  const delim = '.';

  let ownObj;
  let ownPath;
  let ownInitVal;
  let isPath;
  let isInitVal;
  let savedValue;

  const init = (object = ownObj, pathName = ownPath, initValue = undefined) => {
    [ownObj, ownPath, ownInitVal, isPath, savedValue] = [
      object,
      pathName,
      initValue,
      pathName.includes(delim),
      initValue,
    ];
  };

  init(obj, path, initVal);

  return {
    setObject: init,
    getObject: () => ownObj,
    getPath: () => ownPath,
    getInitValue: () => ownInitVal,
    getValue: (key) =>
      key ? values.get(key) : getByPath(ownObj, ownPath, delim, isPath),
    saveValue: () => {
      savedValue = getByPath(ownObj, ownPath, delim, isPath);
    },
    restoreValue: (cbArgs) => {
      if (getByPath(ownObj, ownPath, delim, isPath) !== ownInitVal) {
        setByPath(ownObj, ownPath, savedValue, delim, isPath);
      } else {
        savedValue = ownInitVal;
      }
      ownOnRestoredCBs.run(cbArgs);
    },
    preserveValue(key = Symbol('ValidatableItem.value')) {
      const currValue = getByPath(ownObj, ownPath, delim, isPath);
      values.set(key, currValue);
      isInitVal = currValue === ownInitVal || currValue === undefined;
      return key;
    },
    clearValue(key) {
      isInitVal = undefined;
      return values.delete(key);
    },
    isInitValue() {
      return isInitVal;
    },
    clone: () => ValidatableItem(ownObj, ownPath, ownInitVal),
    onRestored: ownOnRestoredCBs.push,
    [Symbol.toStringTag]: ValidatableItem.name,
  };
}

function CloneRegistry() {
  const cloneRegistry = new Map();
  const retrieveIfHas = (item, factoryFn) =>
    cloneRegistry.get(item) || cloneRegistry.set(item, factoryFn()).get(item);

  return {
    cloneOnce(item, registry) {
      return retrieveIfHas(item, () => item.clone(registry));
    },
    cloneMapOnce(items = [], registry = CloneRegistry()) {
      return retrieveIfHas(items, () =>
        items.map((item) => registry.cloneOnce(item, registry)),
      );
    },
  };
}

function acceptOnlyBoolean(value) {
  if (typeof value !== 'boolean') {
    throw new Error(
      'The returned value of a predicate must be a Boolean ' +
        'or a Promise that resolves to a Boolean.',
    );
  }

  return value;
}

// !consider for adding firing canceled??? and deferred (or delayed) events
function debounceP(fn = Function.prototype, delay = 0) {
  let timeout;
  let promise;
  let resolve = () => {};
  let reject = () => {};
  const suffix = '_DP';
  const debouncedFnName = fn.name + suffix;

  const deferredFn = (...args) => {
    try {
      resolve(fn(...args));
    } catch (err) {
      reject(err);
    }
    promise = null;
  };

  const debouncedFn = {
    [debouncedFnName]: (...args) => {
      clearTimeout(timeout);

      timeout = setTimeout(deferredFn, delay, ...args);

      if (!promise) {
        promise = new Promise((res, rej) => {
          resolve = res;
          reject = rej;
        });
      }

      return promise;
    },
  }[debouncedFnName];

  debouncedFn.cancel = (retVal) => {
    clearTimeout(timeout);
    resolve(retVal);
    promise = null;
  };

  debouncedFn.valueOf = () => ({ fn, delay, valueOf: () => fn });

  return debouncedFn;
}

function tryCatch(
  tryFn = Function.prototype,
  catchFn = Function.prototype, // catches error if enabled
  enableCatchFn = () => true, // enables catching errors
  catchFn2 = Function.prototype, // the second level of error catching in case catchFn or onCatchedCB is also faulty
  onCatchedCB = Function.prototype, // executes on error regardles of enabling catching, does not catch the error
  promisifySyncErrors = false,
) {
  let allowNext = false;
  let fallbackValue = null;

  function next() {
    // ignore catchFn2
    allowNext = true;
  }

  function catcher(err) {
    const res = catchFn(err, next);
    if (allowNext) throw err;
    return res;
  }

  function catcher2(err) {
    if (allowNext) {
      if (promisifySyncErrors) {
        return Promise.reject(err);
      }

      throw err;
    }
    fallbackValue = catchFn2(err);
    return fallbackValue;
  }

  function callback(err) {
    fallbackValue = onCatchedCB(err);
    return fallbackValue;
  }

  function tryCatchWrapper(...args) {
    allowNext = false;
    fallbackValue = null;

    try {
      const result = tryFn(...args);

      if (result.then) {
        result
          .catch(callback)
          .catch(catcher2)
          .catch(() => {}); // the last catch is because catcher2 forwards the error if next() was called in the catchFn

        if (enableCatchFn()) {
          return result
            .catch(catcher)
            .catch(catcher2)
            .then((res) => fallbackValue || res); // in case catchFn is also faulty
        }
      }

      return result;
    } catch (err) {
      try {
        callback(err);
      } catch (err2) {
        catcher2(err2);
      }

      if (enableCatchFn()) {
        try {
          catcher(err);
          return fallbackValue;
        } catch (err2) {
          // in case catchFn is also faulty
          return catcher2(err2);
        }
      }

      if (promisifySyncErrors) {
        return Promise.reject(err);
      }

      throw err;
    }
  }

  return Object.defineProperty(tryCatchWrapper, 'name', {
    value: `${tryFn.name}_TC`,
  });
}

function ObservablePredicate(
  predicate = Predicate(),
  items = [],
  keepValid = false,
  optional = false,
  debounce = 0,
  anyData = {},
) {
  if (!(predicate instanceof Predicate)) return null;

  let restoredCBs;
  let validityCBs;

  const fn = ({ restoredCBs, validityCBs } = predicate.valueOf()).valueOf();
  /**
 * // @bug: optional predicates should be valid by default
 * // if the current validatable values are equal to their init values or undefined
 * // at the moment a predicate is being created 
 * // temporarily fixed
 * // should be fixed like this (tests are needed)
 *  
 *  let initVal = false;
 *  
 *  if (optional) {
 *    const keys = items.map(item => item.preserveValue());  

 *    const isInitVal = items
 *      .map((item) => item.isInitValue())
 *      .every((value) => value === true);
 *    
 *    initVal = isInitVal;
 *  }
 * 
 *  const obs = ObserverAnd(initVal);
 */
  const obs = ObserverAnd(optional); // optional predicates are valid by default
  const onInvalidCBs = Functions();

  const notifySubscribers = obs.update;
  const setValidity = (value, cbArgs) => {
    if (!value) {
      onInvalidCBs.run();
    }
    return validityCBs.set(value, cbArgs);
  };
  const fnName = fn.name || indexedName('predicate');
  const representation = ConsoleRepresentation(
    fnName,
    {
      ...anyData,
      valid: validityCBs.valid,
      invalid: validityCBs.invalid,
      changed: validityCBs.changed,
      validated: validityCBs.validated,
      started: validityCBs.started,
      restored: restoredCBs.push,
      error: validityCBs.error,
      // !consider for adding: deferred (or delayed), canceled???
    },
    {
      isValid: { get: obs.getValue },
      toJSON: {
        value() {
          return {
            name: this[Symbol.toStringTag],
            ...anyData,
            isValid: obs.getValue(),
          };
        },
      },
    },
  );
  const validationResult = ConsoleRepresentation(
    'ValidationResult',
    new Map(
      items.map((item) => [
        item.getObject(),
        new Set([
          ConsoleRepresentation('Predicates', [representation], {
            isValid: { get: obs.getValue },
          }),
        ]),
      ]),
    ),
    {
      target: { writable: true },
      isValid: { get: obs.getValue },
    },
  );

  const predicateFn = debounce && IS_CLIENT ? debounceP(fn, debounce) : fn;

  obs.onChanged((result) => validityCBs.change(result, validationResult));
  items.forEach((item) => item.onRestored(...restoredCBs));

  function predicatePostExec(result, forbidInvalid) {
    acceptOnlyBoolean(result);
    notifySubscribers(result);
    if (forbidInvalid) {
      if (ValidatableItem.keepValid(items, validationResult)) {
        return obsPredicate(!forbidInvalid);
      }
    }
    return setValidity(result, validationResult);
  }

  function obsPredicate(
    forbidInvalid = keepValid,
    target = undefined,
    callID = undefined,
  ) {
    validationResult.target = target;

    validityCBs.start(validationResult);

    if (optional) {
      const isInitVal = items
        .map((item) => item.isInitValue())
        .every((value) => value === true);

      if (isInitVal) {
        return predicatePostExec(true, forbidInvalid);
      }
    }

    const result = predicateFn(...items.map((item) => item.getValue(callID)));

    if (result && result.then) {
      return result.then((res) => predicatePostExec(res, forbidInvalid));
    }

    return predicatePostExec(result, forbidInvalid);
  }

  const obsPredicateTC = tryCatch(
    obsPredicate,
    validityCBs.catch, // the catch function
    () => validityCBs.valueOf().errorCBs.length, // enable the catch function if error state callbacks were added
    () => false, // if the catch function is also faulty, return false and swallow the error
    () => obsPredicateTC.invalidate(), // invalidate on any error occurance
  );

  Reflect.setPrototypeOf(obsPredicateTC, ObservablePredicate.prototype);

  return Object.defineProperties(obsPredicateTC, {
    toRepresentation: { value: () => representation },
    invalidate: {
      value: () => {
        if (debounce) predicateFn.cancel(false);
        return setValidity(notifySubscribers(false), validationResult);
      },
    },
    clone: {
      value: (registry = CloneRegistry()) =>
        ObservablePredicate(
          Predicate(predicate),
          items.map((item) => registry.cloneOnce(item)),
          keepValid,
          optional,
          debounce,
          anyData,
        ),
    },
    getID: { value: obs.getID },
    getValue: { value: obs.getValue },
    onChanged: { value: obs.onChanged },
    onInvalid: { value: onInvalidCBs.push },
    name: { value: `${fnName}_OP` },
    [Symbol.toStringTag]: { value: ObservablePredicate.name },
  });
}

function runPredicatesQueue(
  predicates = [][Symbol.iterator](),
  nexts = [][Symbol.iterator](),
  itemsToCheck = [],
) {
  const promises = [];
  let resolve;
  let reject;

  const finish = () =>
    Promise.all(promises).then((results) => resolve(results));

  const runPromiseQueue = (predicateIt, nextIt) => {
    let promise;
    let predicate;

    while ((predicate = predicateIt.next().value)) {
      try {
        promises.push(
          (promise = Promise.resolve(predicate(...itemsToCheck)).catch(reject)),
        );
      } catch (err) {
        reject(err);
        return;
      }

      if (!nextIt.next().value) {
        promise.then((pRes) =>
          pRes ? runPromiseQueue(predicateIt, nextIt) : finish(),
        );
        return;
      }
    }
    finish();
  };

  const retVal = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  runPromiseQueue(predicates[Symbol.iterator](), nexts[Symbol.iterator]());

  return retVal;
}

function ObservablePredicates() {
  const obs = ObserverAnd(true); // absense of predicates means valid state of Validation
  const predicates = Functions();
  const queueRules = [];
  let withQueueRules = false;
  let lastStopPredicate;

  const representation = ConsoleRepresentation('Predicates', [], {
    isValid: {
      get: obs.getValue,
      configurable: true,
    },
    toJSON: {
      value() {
        return {
          name: this[Symbol.toStringTag],
          length: this.length,
          ...this,
          isValid: obs.getValue(),
        };
      },
    },
  });

  return Object.defineProperties(
    {
      add(predicate = ObservablePredicate(), { next = true } = {}) {
        if (!(predicate instanceof ObservablePredicate)) return this;

        obs.subscribe(predicate);
        predicates.push(predicate);
        queueRules.push(next);
        withQueueRules = withQueueRules || !next;
        representation.push(predicate.toRepresentation());

        if (lastStopPredicate) {
          lastStopPredicate.onInvalid(predicate.invalidate);
        }

        if (!next) {
          lastStopPredicate = predicate;
        }

        return this;
      },
      run(...args) {
        return withQueueRules
          ? runPredicatesQueue(predicates, queueRules, args)
          : Promise.all(predicates.run(...args));
      },
      clone(registry = CloneRegistry()) {
        return predicates
          .map((predicate, idx) => {
            const clonedPredicate = registry.cloneOnce(predicate, registry);
            return [clonedPredicate, { next: queueRules[idx] }];
          })
          .reduce(
            (ops, predWithParams) => ops.add(...predWithParams),
            ObservablePredicates(),
          );
      },
      toRepresentation() {
        return representation;
      },
      getID: obs.getID,
      getValue: obs.getValue,
      onChanged: obs.onChanged,
      [Symbol.toStringTag]: ObservablePredicates.name,
    },
    {
      isValid: { get: obs.getValue },
    },
  );
}

function PredicateGroups(
  pgs = ManyToManyMap(),
  validityCBs = ValidityCallbacks(),
) {
  const obs = ObserverAnd();
  const representation = ConsoleRepresentation(
    'ValidationResult',
    ManyToManyMap(),
    {
      isValid: { get: obs.getValue },
      target: { writable: true },
      toJSON: {
        value() {
          return [...representation].reduce(
            (acc, [key, set]) => {
              acc[key.name || indexedName('obj')] = [...set];
              return acc;
            },
            {
              name: representation[Symbol.toStringTag],
              isValid: obs.getValue(),
            },
          );
        }, // without bind jest throwed an error (in expect().toStrictEqual())
      },
    },
  );

  obs.onChanged((result) => validityCBs.change(result, representation));

  // ! bad. hiding unnecessary methods.
  const addRepresentation = representation.add;
  const representationChangeKey = representation.changeKey;
  delete representation.add;
  delete representation.forEach;
  delete representation.getAll;
  delete representation.map;
  delete representation.mergeWith;
  delete representation.changeKey;

  return Object.defineProperties(
    {
      add(key, predicateGroup = ObservablePredicates()) {
        obs.subscribe(predicateGroup);
        pgs.add(key, predicateGroup);
        // representation.add(keys, predicateGroup.toRepresentation());
        addRepresentation(key, predicateGroup.toRepresentation());
        return this;
      },
      run(id, callID) {
        // validityCBs.start(representation);

        const predicateGroups = id !== undefined ? pgs.get(id) : pgs.getAll();

        return predicateGroups
          ? Promise.all(
              Array.from(predicateGroups, (predicateGroup) =>
                predicateGroup.run(undefined, id, callID),
              ),
            ).then((res) => !res.flat().some((value) => value !== true)) // ! slow
          : Promise.reject(
              new Error(
                `There are no predicates assosiated with the target ${JSON.stringify(
                  id,
                )}`,
              ),
            );
      },
      clone(registry = CloneRegistry()) {
        const newPgs = PredicateGroups(
          undefined,
          ValidityCallbacks(false, validityCBs),
        );

        pgs
          .map((group) => registry.cloneOnce(group, registry))
          .forEach((group, key) => newPgs.add(key, group));

        return newPgs;
      },
      toRepresentation(id) {
        representation.target = id;
        return representation;
      },
      // changeKey: pgs.changeKey,
      changeKey(...args) {
        pgs.changeKey(...args);

        representation.add = addRepresentation; // ! bad
        representationChangeKey(...args);
        delete representation.add; // ! bad

        return this;
      },
      enableCatch() {
        return validityCBs.valueOf().errorCBs.length;
      },
      valid: validityCBs.valid,
      invalid: validityCBs.invalid,
      changed: validityCBs.changed,
      validated: validityCBs.validated,
      started: validityCBs.started,
      error: validityCBs.error,
      catchCBs: validityCBs.catch,
      startCBs: validityCBs.start,
      runCBs: validityCBs.set,
      map: pgs.map,
      forEach: pgs.forEach,
      mergeWith: pgs.mergeWith,
      has: pgs.has.bind(pgs),
      get: pgs.get.bind(pgs),
      [Symbol.toStringTag]: PredicateGroups.name,
    },
    {
      isValid: { get: obs.getValue },
    },
  );
}

function addObservablePredicate(
  predicate = Predicate(),
  items = ManyToManyMap(),
  {
    TYPE = SINGLE,
    next = true,
    keepValid = false,
    optional = false,
    debounce = 0,
    anyData,
  } = {},
) {
  if (TYPE === GLUED) {
    const op = ObservablePredicate(
      predicate,
      [...items.getAll()],
      keepValid,
      optional,
      debounce,
      anyData,
    );

    return function forGlued(predicateGroup /* key */) {
      predicateGroup.add(op, { next });
    };
  }

  return function forSingleOrGrouped(predicateGroup, key) {
    predicateGroup.add(
      ObservablePredicate(
        Predicate(predicate),
        [...items.get(key)],
        keepValid,
        optional,
        debounce,
        anyData,
      ),
      { next },
    );
  };
}

function firstEntry(map = new Map()) {
  return map.entries().next().value;
}

const defaultMapper = (req, form) => {
  const { body } = req;
  Object.keys(body).forEach((fieldName) => {
    form[fieldName].value = body[fieldName];
  });
};

// express middleware
const createMiddlewareFn = (form, validation, dataMapper) => () => {
  let mapper = dataMapper;

  Object.defineProperty(validation, 'dataMapper', {
    value(Mapper) {
      if (!form) {
        throw new Error(
          'Calling the dataMapper method on a validation' +
            ' that is not associated with a form. ' +
            'Create a validation profile first.',
        );
      }

      if (!isFunction(Mapper)) {
        throw new Error('The data mapper must be a function.');
      }

      mapper = Mapper;
      return this;
    },
    configurable: true, // to work with Proxy in makeIsomorphicAPI
  });

  if (!form) {
    return () => {
      throw new Error(
        'Using a validation as a middleware' +
          ' that is not associated with a form. ' +
          'Create a validation profile first.',
      );
    };
  }

  return async (req, res, next) => {
    try {
      mapper(req, form);
    } catch (err) {
      next(err);
      return;
    }

    req.validationResult = await validation.validate().catch(next);
    next();
  };
};

const createEventHandlerFn = (validation) => () => {
  Object.defineProperty(validation, 'dataMapper', {
    value() {
      const { warn } = console;
      warn('The dataMapper method does nothing on the client side');
      return this;
    },
    configurable: true, // to work with Proxy in makeIsomorphicAPI
  });

  return (event) => validation.validate(event ? event.target : undefined);
};

const makeValidationHandlerFn = (form) => (validation) => {
  const middleware = ifSide(
    // server side
    createMiddlewareFn(form, validation, defaultMapper),

    // client side
    createEventHandlerFn(validation),
  )();
  Reflect.setPrototypeOf(middleware, validation);
  return middleware;
};

function ValidationBuilder({
  pgs = PredicateGroups(),
  items = ManyToManyMap(),
  containedGroups = new ManyToManyMap(),
  TYPE = SINGLE,
  validations = [],
} = {}) {
  const representation = ConsoleRepresentation(
    'Validation',
    makeValidationHandlerFn(null)({
      constraint(
        validator = Predicate(),
        {
          next = true,
          debounce = 0,
          keepValid = false,
          optional = false,
          ...anyData
        } = {},
      ) {
        const predicate = Predicate(validator);
        pgs.forEach(
          addObservablePredicate(predicate, items, {
            TYPE,
            next,
            debounce,
            keepValid,
            optional,
            anyData,
          }),
        );
        return this;
      },
      validate(target) {
        // all items will be preserved regardless of the target
        // not the most optimal way, but fixes the bug with validating a glued validation
        // by target through a grouping validation
        const validatableItems = items.getAll();
        // target !== undefined ? items.get(target) : items.getAll();

        const callID = Symbol('callID');

        validatableItems.forEach((item) => item.preserveValue(callID));

        (containedGroups.get(target) || containedGroups.getAll()).forEach(
          (containedPgs) => {
            containedPgs.startCBs(containedPgs.toRepresentation(target));
          },
        );

        return pgs.run(target, callID).then((res) => {
          validatableItems.forEach((item) => item.clearValue(callID));

          (containedGroups.get(target) || containedGroups.getAll()).forEach(
            (containedPgs) => {
              containedPgs.runCBs(
                containedPgs.isValid,
                containedPgs.toRepresentation(target),
              );
            },
          );

          return Object.create(pgs.toRepresentation(target), {
            isValid: { value: res },
          });
        });
      },
      bind(newObj = {}, path = undefined, initVal = undefined) {
        if (TYPE !== SINGLE) {
          throw new Error('Only single validation can be bound');
        }

        const [oldObj, set] = firstEntry(items);
        const validatableItem = [...set][0]; // firstItemFromEntrie

        const newPath = path !== undefined ? path : validatableItem.getPath();

        const newInitVal =
          initVal !== undefined ? initVal : validatableItem.getInitValue();

        validatableItem.setObject(newObj, newPath, newInitVal);

        items.changeKey(oldObj, newObj);
        pgs.changeKey(oldObj, newObj);
        containedGroups.changeKey(oldObj, newObj);

        return this;
      },
      valueOf() {
        return { pgs, items, containedGroups, TYPE };
      },
      constraints: pgs.toRepresentation(),
      validations,
      valid: pgs.valid,
      invalid: pgs.invalid,
      changed: pgs.changed,
      validated: pgs.validated,
      started: pgs.started,
      error: pgs.error,
    }),
    {
      isValid: Object.getOwnPropertyDescriptor(pgs, 'isValid'),
    },
  );

  representation.validate = tryCatch(
    representation.validate,
    pgs.catchCBs,
    pgs.enableCatch,
    () => Promise.resolve(pgs.toRepresentation()), // if the catch function is also faulty, return ValidationResult and swallow the error
    () => Promise.resolve(pgs.toRepresentation()), // return ValidationResult on any error occurance
    true, // promisify sync errors
  );

  return makeIsomorphicAPI(representation);
}

function accepOnlyValidation(arg) {
  // validation...client... or /validation...server... might have been passed in
  const validation = Object(Object(arg).isomorphic);

  if (validation[Symbol.toStringTag] !== 'Validation') {
    throw new Error('Not a Validation was passed in');
  }

  return validation;
}

function makeGroupValidationsFn(TYPE = GROUPED) {
  return function groupValidations(Validations = [], ...rest) {
    const pgs = PredicateGroups();
    const items = ManyToManyMap();
    const containedGroups = ManyToManyMap();
    const validations = [
      ...new Set([Validations].concat(rest).flat(Infinity)),
    ].map(accepOnlyValidation);

    validations
      .map((validation) => {
        const {
          pgs: vPgs,
          items: vItems,
          containedGroups: vContainedGroups,
        } = validation.valueOf();

        pgs.mergeWith(vPgs);
        items.mergeWith(vItems);
        containedGroups.mergeWith(vContainedGroups);

        return vItems;
      })
      .forEach((vItems) => {
        if (TYPE === GLUED) {
          vItems.mergeWith(items);
        }
      });

    containedGroups.forEach((_, key) => {
      containedGroups.add(key, pgs);
    });

    return ValidationBuilder({
      pgs,
      items,
      containedGroups,
      TYPE,
      validations,
    });
  };
}

function memoize(
  fn = Function.prototype,
  defaults = () => [],
  limit = Infinity,
) {
  const argsIdxs = new Map();
  const resIdxs = new Map();
  const counter = () => argsIdxs.size;
  const retrieveIfHas =
    (map = new Map()) =>
    (value = Function.prototype, ...args) =>
    (key) =>
      map.has(key) ? map.get(key) : map.set(key, value(...args)).get(key);

  const mergeWithDefaults = (args) => {
    const params = [];
    const defaultParams = defaults();
    const length = Math.max(args.length, defaultParams.length);

    for (let i = 0; i < length; i++) {
      params[i] = args[i] !== undefined ? args[i] : defaultParams[i];
    }

    return params;
  };

  const remember =
    (Fn) =>
    (...args) => {
      const params = mergeWithDefaults(args);
      return retrieveIfHas(resIdxs)(Fn, ...params)(
        params.map(retrieveIfHas(argsIdxs)(counter)).slice(0, limit).join(','),
      );
    };

  const memoized = remember(fn);

  memoized.remember = (res, ...args) => remember(() => res)(...args);

  memoized.forget = (...args) =>
    resIdxs.delete(
      mergeWithDefaults(args)
        .map((arg) => argsIdxs.get(arg))
        .join(','),
    );

  return memoized;
}

const buildValidation = memoize(
  (pgs, items, containedGroups, TYPE, validations) =>
    ValidationBuilder({
      pgs,
      items,
      containedGroups,
      TYPE,
      validations,
    }),
  undefined,
  4, // parameter validations is not accounted since it is always a new set
);

function clone({ validation, registry = CloneRegistry() }) {
  const isomorphicValidation = accepOnlyValidation(validation);
  const { pgs, items, containedGroups, TYPE } = isomorphicValidation.valueOf();
  const { validations } = isomorphicValidation; // Set()

  const clonedPgs = registry.cloneOnce(pgs, registry);

  const clonedItems = registry.cloneMapOnce(items, registry);

  const clonedContainedGroups = registry.cloneMapOnce(
    containedGroups,
    registry,
  );

  const clonedValidations = [...validations]
    .map((v) => ({ validation: v, registry }))
    .map(clone);

  return buildValidation(
    clonedPgs,
    clonedItems,
    clonedContainedGroups,
    TYPE,
    clonedValidations,
  );
}

function acceptOnlyNotEmptyString(value) {
  if (typeof value !== 'string' || value.length < 1) {
    throw new Error('Form field name must be a not empty string.');
  }

  return value;
}

function createDummyObj(fromObj) {
  return new Proxy(
    Object.defineProperty(() => createDummyObj(), 'name', {
          writable: true,
        }),
    {
      get(target, property, receiver) {
        if (!Reflect.has(target, property)) {
          Reflect.defineProperty(target, property, {
            writable: true,
            value: createDummyObj(),
          });
          Reflect.defineProperty(target, Symbol.toPrimitive, {
            writable: true,
            value: () => '',
          });
        }
        return Reflect.get(target, property, receiver);
      },
    },
  );
}

const dummyObject = createDummyObj();

function FormField(fieldName = '', propChain = []) {
  this.name = fieldName;

  propChain.reduce((acc, propName, idx) => {
    const isLast = idx === propChain.length - 1;

    return Object.defineProperty(acc, propName, {
      value: isLast ? '' : {},
      writable: isLast,
    })[propName];
  }, this);
}
FormField.prototype = dummyObject;

function FormFields(fieldNames, paths, delim) {
  [].concat(fieldNames).forEach((fieldName, idx) => {
    acceptOnlyNotEmptyString(fieldName);

    const path = paths[idx];
    const propChain = path ? path.split(delim) : [PROPNAME];
    const formField = new FormField(fieldName, propChain);

    Object.defineProperty(this, fieldName, {
      value: formField,
      enumerable: true,
    });
  });
}
FormFields.prototype = dummyObject;

const createValidatableFormFn = (selector, fieldNames, paths, delim) => () => {
  const fieldsCollection = new FormFields(fieldNames, paths, delim);
  const form = Object.create(
    dummyObject,
    Object.getOwnPropertyDescriptors(fieldsCollection),
  );

  Object.defineProperty(form, 'selector', { value: selector });
  Object.defineProperty(form, 'elements', { value: fieldsCollection });
  Object.defineProperty(form, Symbol.toStringTag, {
    value: ValidatableForm.name,
  });

  return form;
};

const getFormBySelectorFn = (selector) => () => {
  const htmlForm = document.querySelector(selector);

  if (!htmlForm) {
    throw new Error(
      `Cannot find a form with the specified selector: ${selector}`,
    );
  }

  return htmlForm;
};

function ValidatableForm(
  selector = '',
  fieldNames = [],
  paths = [],
  delim = '.',
) {
  return ifSide(
    // server side
    createValidatableFormFn(selector, fieldNames, paths, delim),

    // client side
    getFormBySelectorFn(selector),
  )();
}

const cloneValidation = (validation) =>
  clone({ validation, registry: CloneRegistry() });

const bind = (form, fieldNames) => (validation, idx) =>
  validation.bind(form.elements[fieldNames[idx]]);

const getItems = (validation) => validation.valueOf().items;
const getPath = (validatableItem) => validatableItem.getPath();
const firstItemFromEntrie = ([, set]) => [...set][0];

const assignValidations =
  (validations) => (validationGroup, fieldName, idx) => {
    const validation = validations[idx];

    if (validation) {
      Object.defineProperty(validationGroup, fieldName, {
        get: () => validation,
        enumerable: true,
        configurable: true, // to work with Proxy in makeIsomorphicAPI
      });
    }

    return validationGroup;
  };

const profile = (form, validation) =>
  Object.defineProperties(
    { form, validation },
    {
      0: { value: form },
      1: { value: validation },
      length: { value: 2 },
      [Symbol.iterator]: { value: Array.prototype[Symbol.iterator] },
      [Symbol.toStringTag]: { value: 'ValidationProfile' },
    },
  );

function createProfile(
  selector = '',
  fieldNames = [],
  validations = [],
) {
  const paths = []
    .concat(validations)
    .map(accepOnlyValidation)
    .map(getItems)
    .map(firstEntry)
    .map(firstItemFromEntrie)
    .map(getPath);

  const validatableForm = ValidatableForm(selector, fieldNames, paths);

  const clonedValidations = []
    .concat(validations)
    .map(cloneValidation)
    .map(bind(validatableForm, fieldNames))
    .map(makeValidationHandlerFn(validatableForm));

  const groupedValidations = []
    .concat(fieldNames)
    .reduce(
      assignValidations(clonedValidations),
      makeGroupValidationsFn(GROUPED)(clonedValidations),
    );

  return profile(
    validatableForm,
    makeValidationHandlerFn(validatableForm)(groupedValidations),
  );
}

function createValidation(
  obj = { value: 'default' },
  propName = PROPNAME,
  initVal = INITVAL,
) {
  const pgs = PredicateGroups();
  const items = ManyToManyMap();
  const containedGroups = ManyToManyMap();
  const TYPE = SINGLE;

  pgs.add(obj, ObservablePredicates());
  items.add(obj, ValidatableItem(obj, propName, initVal));
  containedGroups.add(obj, pgs);

  return ValidationBuilder({ pgs, items, containedGroups, TYPE });
}

createValidation.group = makeGroupValidationsFn(GROUPED);
createValidation.glue = makeGroupValidationsFn(GLUED);
createValidation.clone = (validation) =>
  clone({ validation, registry: CloneRegistry() });
createValidation.profile = createProfile;

export { Predicate, createValidation as Validation };
