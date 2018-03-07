const CustomClass = require('./index');
const assert = require('assert');


describe('CustomizableClass', () => {

    describe('Normal overrides', () => {

        // A custom class with no overrides, acting as a control
        const normalInstance = new CustomClass();

        // Values for comparing against
        const GOAL = '😊';
        const NOTGOAL = '😠';
        const GOALOBJ = [GOAL];

        it('Should allow overriding apply', () => {

            class ApplyOverridden extends CustomClass {
                __apply__() {
                    return GOAL;
                }
            }

            assert.equal(new ApplyOverridden()(), GOAL);
            assert.notEqual(normalInstance(), GOAL);
        });

        it('Should allow overriding construct', () => {
            class ConstructOverridden extends CustomClass {
                __construct__() {
                    return GOALOBJ;
                }
            }

            assert.equal(new new ConstructOverridden()(), GOAL);
            assert.notEqual(new normalInstance(), GOAL);
        });

        it('Should allow overriding defineProperty', () => {
            class DefinePropertyOverridden extends CustomClass {
                __defineProperty__(key, descriptor) {
                    this[key] = GOAL;
                    return true;
                }
            }

            // Make a new object and try to set foo = NOGOAL
            const dpo = new DefinePropertyOverridden();
            Object.defineProperty(dpo, 'foo', {value: NOTGOAL});

            // However, if the override worked, any property assignment will be replaced by GOAL
            assert.equal(dpo.foo, GOAL);
            assert.notEqual(dpo.bar, GOAL);
        });

        it('Should allow overriding deleteProperty', () => {
            const PRESENT ='☑';
            const DELETED ='☒';

            class DeletePropertyOverridden extends CustomClass {
                constructor(){
                    super();
                    this.foo = PRESENT;
                }

                __deleteProperty__(key) {
                    this[key] = DELETED;
                }
            }

            // Make a new object and try to delete the property foo
            const dpo = new DeletePropertyOverridden();
            delete dpo.foo;

            // However, if the override worked, deleting foo should just set it to DELETED
            assert.equal(dpo.foo, DELETED);
            assert.notEqual(new DeletePropertyOverridden().bar, PRESENT);
        });

        it('Should allow overriding the get operator', () => {
            class GetOverridden extends CustomClass {
                __get__() {
                    return 'overridden';
                }
            }

            assert.equal(new GetOverridden().foo, GOAL);
            assert.notEqual(normalInstance.foo, GOAL);
        });

    });

});