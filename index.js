/**
 * Calls a proxy function with the given name, if this subclass implements it
 * @param method The proxy method to call (apply, set, get etc)
 * @param args The arguments from this method
 */
function callIfExists(method, ...args) {
    const proxy = args[0];
    const customName = proxy.__names[method];

    // Create a bound function that will return the default value, but don't call it by default because it might have
    // side-effects
    const getDefault = () => {
        return Reflect[method](...args)
    };

    // Return a custom value if it's defined, otherwise return the default
    if (customName in proxy)
        return proxy[customName](...args, getDefault);
    else
        return getDefault();
}

/**
 * Default names for the custom methods. These can be overwritten
 */
const defaultMethodNames = {
    apply: '__apply__',
    construct: '__construct__',
    defineProperty: '__defineProperty__',
    deleteProperty: '__deleteProperty__',
    get: '__get__',
    getOwnPropertyDescriptor: '__getOwnPropertyDescriptor__',
    getPrototypeOf: '__getPrototypeOf__',
    has: '__has__',
    isExtensible: '__isExtensible__',
    ownKeys: '__ownKeys__',
    preventExtensions: '__preventExtensions__',
    set: '__set__',
    setPrototypeOf: '__setPrototypeOf__'
};


const handler = {
    apply(...args) {
        return callIfExists('apply', ...args);
    },

    construct(...args) {
        return callIfExists('construct', ...args);
    },

    defineProperty(...args) {
        return callIfExists('defineProperty', ...args);
    },

    deleteProperty(...args) {
        return callIfExists('deleteProperty', ...args);
    },

    get(...args) {
        return callIfExists('get', ...args);
    },

    getOwnPropertyDescriptor(...args) {
        return callIfExists('getOwnPropertyDescriptor', ...args);
    },

    getPrototypeOf(...args) {
        return callIfExists('getPrototypeOf', ...args);
    },

    has(...args) {
        return callIfExists('has', ...args);
    },

    isExtensible(...args) {
        return callIfExists('isExtensible', ...args);
    },

    ownKeys(...args) {
        return callIfExists('ownKeys', ...args);
    },

    preventExtensions(...args) {
        return callIfExists('preventExtensions', ...args);
    },

    set(...args) {
        return callIfExists('set', ...args);
    },

    setPrototypeOf(...args) {
        return callIfExists('setPrototypeOf', ...args);
    },
};

class CustomizableClass extends Function {
    constructor(methodNames = {}) {
        super();

        // Combine the user-defined method names with the defaults
        this.__names = Object.assign(methodNames, defaultMethodNames);

        // Return a proxy in the constructor, so the class instance is replaced by the proxy
        return new Proxy(this, handler);
    }

}

module.exports = CustomizableClass;