defaultMethodNames = {
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
}


handler = {
    apply(target, thisArg, args) {
        return target.callIfExists('apply', [thisArg, args])
    },

    construct(target, args) {
        return target.callIfExists('construct', [args])
    },

    defineProperty(target, key, descriptor) {
        return target.callIfExists('defineProperty', [key, descriptor])
    },

    deleteProperty(target, prop) {
        return target.callIfExists('deleteProperty', [prop])
    },

    get(target, prop) {
        return target.callIfExists('get', [prop])
    },

    getOwnPropertyDescriptor(target, prop) {
        return target.callIfExists('getOwnPropertyDescriptor', [prop])
    },

    getPrototypeOf(target) {
        return target.callIfExists('getPrototypeOf')
    },

    has(target, key) {
        return target.callIfExists('has', [key])
    },

    isExtensible(target) {
        return target.callIfExists('isExtensible')
    },

    ownKeys(target) {
        return target.callIfExists('ownKeys')
    },

    preventExtensions(target) {
        return target.callIfExists('preventExtensions')
    },

    set(target, prop, value) {
        return target.callIfExists('preventExtensions', [prop, value])
    },

    setPrototypeOf(target, args) {
        return target.callIfExists('setPrototypeOf', [args])
    },
}

class CustomizableClass extends Function {
    constructor(methodNames = {}) {
        super();

        // Combine the user-defined method names with the defaults
        this.names = Object.assign(methodNames, defaultMethodNames);

        // Return a proxy in the constructor, so the class instance is replaced by the proxy
        return Proxy(this, handler);
    }

    /**
     * Calls a proxy function with the given name, if this subclass implements it
     * @param method The proxy method to call (apply, set, get etc)
     * @param args The arguments from this method
     */
    callIfExists(method, args){
        if (this.hasOwnProperty(method))
            this[method](...args);
    }
}