const hasOwnProperty = Object.prototype.hasOwnProperty

const { ops, LPAREN, RPAREN, LT, OR, AND, EQ, LTE, GT, GTE } = require('./token')

const DOT = '.'

const sel = (name, value) => {
  const parts = name.split(DOT)
  let c = value
  let key
  while ((key = parts.pop()) !== undefined) {
    c = { [key]: c }
  }
  return c
}

const selector = (val, right, left) => {
  let v
  switch (val.type) {
    case OR:
    case AND:
      return {
        [val.type]: [left, right],
      }
    case EQ:
    case GTE:
    case GT:
    case LTE:
    case LT:
      v = {
        [val.type]: right.val.value,
      }
      break
    default:
      throw new Error('not implemented: ' + val.type)
  }
  return sel(left.val.value, v)
}

const parse = tokens => {
  const stack = []
  const out = []

  let token
  let val

  loop: while ((token = tokens.shift()) !== undefined) {
    if (hasOwnProperty.call(ops, token.type)) {
      while (stack.length > 0) {
        if (ops[token.type] <= ops[stack[stack.length - 1].type]) {
          out.push(selector(stack.pop(), out.pop(), out.pop()))
        } else {
          break
        }
      }
      stack.push(token)
    } else {
      if (token.type === LPAREN) {
        stack.push(token)
      } else if (token.type === RPAREN) {
        while (stack.length > 0) {
          val = stack.pop()
          if (val.type === LPAREN) {
            continue loop
          } else {
            out.push(selector(val, out.pop(), out.pop()))
          }
        }
        throw new Error('unbalanced parentheses')
      } else {
        out.push({ val: token })
      }
    }
  }

  while (stack.length > 0) {
    out.push(selector(stack.pop(), out.pop(), out.pop()))
  }

  return out.pop()
}

module.exports = parse
