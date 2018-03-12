# CustomClass

`CustomClass` allows you to customize the internal methods of your JavaScript classes, in the same way that you might
in other languages like Python or Ruby.

For example, you might want to make a JavaScript equivalent of Python's `defaultdict`: a dictionary that has a default
value for all keys you haven't set yourself.

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