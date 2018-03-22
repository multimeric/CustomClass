# CustomClass

`CustomClass` allows you to customize the internal methods of your JavaScript classes, in the same way that you might
in other languages like Python or Ruby.

For example, you might want an object that lets you call it like a function:

```javascript
class MyClass extends CustomClass {
    __apply__(){
        return "I'm a function!";
    }
}

const mc = new MyClass();
console.log(mc());
```
```
I'm a function!
```

Or maybe you want an object that has a default value for any key you try to access:
```javascript
class MyClass extends CustomClass {
    __get__(target, prop) {
        if (prop in target) {
            return getDefault();
        }
        else {
            return "DEFAULT VALUE";
        }
    }
}

const mc = new MyClass();
console.log(mc.foo);
console.log(mc.bar);
```

```
DEFAULT VALUE
DEFAULT VALUE
```

# Installation
Run:

```bash
npm install custom-class --save
```

Then import the class:

```javascript
const CustomClass = require('custom-class');
```

# Usage
Simply inherit from the `CustomClass`, and implement any of the following double-underscore methods. In general, the
signature of these methods matches the corresponding methods on the
[JavaScript `Proxy` object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler#Methods),
but with an extra argument added on to the end, a function that will return the default value for this method.

## Common Arguments:

* `target`: This object, but without any internal method intercepting. Use this to get information out of your object
without fear of causing an infinite loop
* `getDefault`: A function that, if called, will perform the default behaviour and return the default value for this
method. For example if you override `__get__`, `getDefault()` will return the true value of the field the user is trying
to access.

## List of Methods

### `__apply__(target, thisArg, argumentsList, getDefault)`
Invoked when an instance of this class is called as a function

e.g. `myInstance()`

* `thisArg`: The `this` argument for the call
* `argumentsList`: The list of arguments for the call

### `__construct__(target, argumentsList, newTarget, getDefault)`
Invoked when an instance of this class is used as a constructor

e.g. `new myInstance()`
* `argumentsList`: The list of arguments for the constructor
* `newTarget`: The object that is being constructed

### `__defineProperty__(target, property, descriptor, getDefault)`
Invoked when an instance of this class has `Object.defineProperty()` called on it
* `property`: The name of the property whose description is to be retrieved
* `descriptor`: The descriptor for the property being defined or modified

### `__deleteProperty__(target, property, getDefault)`
Invoked when an instance of this class has one of its fields deleted

e.g. `delete myInstance.foo`
* `property`: The name of the property to delete

### `__get__(target, property, receiver, getDefault)`
Invoked when an instance of this class has one of its fields accessed

e.g. `myInstance.foo`
* `property`: The name of the property to get
* `receiver`: Either the proxy or an object that inherits from the proxy

### `__getOwnPropertyDescriptor__(target, prop, getDefault)`

Invoked when an instance of this class has `Object.getOwnPropertyDescriptor()` called on it
* `prop`: The name of the property whose description should be retrieved

### `__getPrototypeOf__(target, getDefault)`
Invoked when an instance of this class has its prototype checked,

e.g. `Object.getPrototypeOf(myInstance)`, or `myInstance instanceof SomeClass`

### `__has__(target, property, getDefault)`
Invoked when an instance of this class has the `in` operator applied to it

e.g. `"foo" in myInstance`
* `property`: The name of the property to check for existence.
### `__isExtensible__(target, getDefault)`
Invoked when an instance of this class has `Object.isExtensible()` called on it

### `__ownKeys__(target, getDefault)`
Invoked when an instance of this class has `Object.getOwnPropertyNames()` called on it
### `__preventExtensions__(target, getDefault)`
Invoked when an instance of this class has `Object.preventExtensions()`  called on it.

### `__set__(target, property, value, receiver, getDefault)`

Invoked when an instance of this class has one of its fields set

e.g. `myInstance.foo = "bar"`
* `property`: The name of the property to set
* `value`: The new value of the property to set
* `The object to which the assignment was originally directed`

### `__setPrototypeOf__(target, prototype)`
Invoked when an instance of this class has its prototype set
* `prototype`: The object's new prototype or `null` using
`Object.setPrototypeOf()`

(Content based on "Proxy handler" by
[Mozilla Contributors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler$history),
 licensed under [CC-BY-SA 2.5](http://creativecommons.org/licenses/by-sa/2.5/))

# Example: Making a defaultdict

In this example, you want to make a JavaScript equivalent of Python's `defaultdict`: a dictionary that has a default
value for all keys you haven't set yourself:

```javascript
class DefaultDict extends CustomClass {
    constructor(defaultConstructor) {
        super();
        this.defaultConstructor = defaultConstructor;
    }

    __get__(target, prop, receiver, getDefault) {
        if (prop in target) {
            // If we already have a value for this, return it
            return getDefault();
        }
        else {
            // If we don't, generate a default value using our default constructor, and save it onto the object
            const generated = new this.defaultConstructor();
            target[prop] = generated;
            return generated;
        }
    }
}

const dd = new DefaultDict(Array);

assert.deepEqual(dd.foo, []);

dd.bar.push('a');
assert.deepEqual(dd.bar, ['a'])
```
