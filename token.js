const NUMLITERAL = 'num'
const IDENTIFIER = 'id'
const STRINGLITERAL = 'str'

const numLiteral = { type: NUMLITERAL }

const stringLiteral = { type: STRINGLITERAL }

const identifier = { type: IDENTIFIER }

const LPAREN = 'lparen'
const RPAREN = 'rparen'
const AND = '$and'
const OR = '$or'
const LT = '$lt'
const LTE = '$lte'
const GT = '$gt'
const GTE = '$gte'
const EQ = '$eq'

const ILLEGALLITERAL = 'illegalLiteral'

const lparen = { type: LPAREN, image: '(' }
const rparen = { type: RPAREN, image: ')' }
const and = { type: AND, image: '&&' }
const or = { type: OR, image: '||' }
const lt = { type: LT, image: '<' }
const lte = { type: LTE, image: '<=' }
const gt = { type: GT, image: '>' }
const gte = { type: GTE, image: '>=' }
const eq = { type: EQ, image: '==' }

const illegalLiteral = { type: ILLEGALLITERAL }

/** precedence */
const ops = {
  [OR]: 1,
  [AND]: 2,
  [EQ]: 3,
  [GTE]: 4,
  [GT]: 5,
  [LTE]: 6,
  [LT]: 7,
}

const tokensBySymbol = {
  '(': lparen,
  ')': rparen,
  '&': [
    {
      '&': and,
    },
    illegalLiteral,
  ],
  '|': [
    {
      '|': or,
    },
    illegalLiteral,
  ],
  '=': [
    {
      '=': eq,
    },
    illegalLiteral,
  ],
  '<': [
    {
      '=': lte,
    },
    lt,
  ],
  '>': [
    {
      '=': gte,
    },
    gt,
  ],
}

const fromSymbol = key => tokensBySymbol[key]

module.exports = {
  lparen,
  rparen,
  and,
  or,
  eq,
  lt,
  lte,
  gt,
  gte,
  LPAREN,
  RPAREN,
  AND,
  OR,
  EQ,
  LT,
  LTE,
  GT,
  GTE,
  ILLEGALLITERAL,
  fromSymbol,
  identifier,
  numLiteral,
  stringLiteral,
  illegalLiteral,
  ops,
}
