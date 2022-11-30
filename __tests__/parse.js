const assert = require('assert')
const { scan, parse } = require('..')

const isObject = o => typeof o === 'object' && o !== null

const deepEqual = (obj1, obj2) => {
  if (obj1 === obj2) {
    return true
  } else if (isObject(obj1) && isObject(obj2)) {
    if (Object.keys(obj1).length !== Object.keys(obj2).length) {
      return false
    }
    let prop
    for (prop in obj1) {
      if (!deepEqual(obj1[prop], obj2[prop])) {
        return false
      }
    }
    return true
  }
}

const tests = [
  {
    name: 'director == "Lars von Trier"',
    input: 'director == "Lars von Trier"',
    expected: {
      director: {
        $eq: 'Lars von Trier',
      },
    },
  },
  {
    name: 'director == "Lars von Trier" || year >= 2010',
    input: 'director == "Lars von Trier" || year >= 2010',
    expected: {
      $or: [
        {
          director: {
            $eq: 'Lars von Trier',
          },
        },
        {
          year: {
            $gte: 2010,
          },
        },
      ],
    },
  },
  {
    name: 'name == "Paul" && location == "Boston"',
    input: 'name == "Paul" && location == "Boston"',
    expected: {
      $and: [
        {
          name: {
            $eq: 'Paul',
          },
        },
        {
          location: {
            $eq: 'Boston',
          },
        },
      ],
    },
  },
  {
    name: '(x == 1 && y < 2) || (x > 15 && (x == 1 && y < 2) || (x > 15 && y <= 25))',
    input: '(x == 1 && y < 2) || (x > 15 && (x == 1 && y < 2) || (x > 15 && y <= 25))',
    expected: {
      $or: [
        {
          $and: [
            {
              x: {
                $eq: 1,
              },
            },
            {
              y: {
                $lt: 2,
              },
            },
          ],
        },
        {
          $or: [
            {
              $and: [
                {
                  x: {
                    $gt: 15,
                  },
                },
                {
                  $and: [
                    {
                      x: {
                        $eq: 1,
                      },
                    },
                    {
                      y: {
                        $lt: 2,
                      },
                    },
                  ],
                },
              ],
            },
            {
              $and: [
                {
                  x: {
                    $gt: 15,
                  },
                },
                {
                  y: {
                    $lte: 25,
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  },
]

describe('parse', () => {
  tests.map(test => it(test.name, () => assert.ok(deepEqual(parse(scan(test.input)), test.expected))))
})
