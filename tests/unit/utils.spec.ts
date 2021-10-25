import { sum } from '@/utils';
import EventDispatcher from '@/engine/events/EventDispatcher';
import { assert } from 'chai';

describe('sum function test case', function () {
    const cases = [
        {
            n: 1,
            m: 2,
            sum: 3,
        },
        {
            n: 0,
            m: -2,
            sum: -2,
        },
        {
            n: 0,
            m: 0,
            sum: 0,
        },
    ];

    cases.forEach(c => {
        it(`${c.n} + ${c.m} = ${c.sum}`, () => {
            assert.deepStrictEqual(sum(c.n, c.m), c.sum);
        });
    });
});
