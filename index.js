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
    setPrototypeOf: '__setPrototypeOf__',
};


const handler = {
    apply(target, thisArg, args) {
        return target.callIfExists('apply', target, [thisArg, args]);
    },

    construct(target, args) {
        return target.callIfExists('construct', target, [args]);
    },

    defineProperty(target, key, descriptor) {
        return target.callIfExists('defineProperty', target, [key, descriptor]);
    },

    deleteProperty(target, prop) {
        return target.callIfExists('deleteProperty', target, [prop]);
    },

    get(target, prop) {
        return target.callIfExists('get', target, [prop]);
    },

    getOwnPropertyDescriptor(target, prop) {
        return target.callIfExists('getOwnPropertyDescriptor', target, [prop]);
    },

    getPrototypeOf(target) {
        return target.callIfExists('getPrototypeOf', target);
    },

    has(target, key) {
        return target.callIfExists('has', target, [key]);
    },

    isExtensible(target) {
        return target.callIfExists('isExtensible', target);
    },

    ownKeys(target) {
        return target.callIfExists('ownKeys', target);
    },

    preventExtensions(target) {
        return target.callIfExists('preventExtensions', target);
    },

    set(target, prop, value) {
        return target.callIfExists('set', target, [prop, value]);
    },

    setPrototypeOf(target, args) {
        return target.callIfExists('setPrototypeOf', target, [args]);
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

    /**
     * Calls a proxy function with the given name, if this subclass implements it
     * @param method The proxy method to call (apply, set, get etc)
     * @param target The proxy's target
     * @param args The arguments from this method
     */
    callIfExists(method, target, args){
        const customName = this.__names[method];
        if (customName in this)
            return this[customName](...args);
        else
            return Reflect[method](target, ...args);
    }
}

module.exports = CustomizableClass;