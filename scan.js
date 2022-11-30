const { fromSymbol, numLiteral, stringLiteral, identifier, illegalLiteral } = require('./token')

const keywords = {}

const hasOwnProperty = Object.prototype.hasOwnProperty

const isDigit = u => u >= '0' && u <= '9'

const isAbc = x => (x >= 'a' && x <= 'z') || (x >= 'A' && x <= 'Z')

const isHexDigit = x => isDigit(x) || (x >= 'a' && x <= 'f') || (x >= 'A' && x <= 'F')

const scan = input => {
  let offset = -1
  let char
  let type
  let temp
  let line = 0

  const next = () => input[++offset]

  const queue = []

  const enqueue = (tk, image) => {
    let value
    if (tk === numLiteral || tk === identifier || tk === stringLiteral || tk === illegalLiteral) {
      value = image
      image = String(image)
    } else {
      value = image = tk.image
    }
    queue.push({
      line,
      value,
      startOffset: offset - image.length,
      endOffset: offset,
      ...tk,
    })
  }

  const scanHexLiteral = (width, asString = true) => {
    const buf = []
    let len = width
    let cint
    let c

    while (--len >= 0) {
      c = next()
      cint = parseInt(c, 16)
      if (!isNaN(cint) && isHexDigit(c)) {
        buf.push(cint)
      } else {
        break
      }
    }

    if (asString) {
      if (buf.length === width) {
        return String.fromCharCode(buf.slice(1).reduce((a, b) => (a << 4) | b, buf[0]))
      }
    } else if (buf.length) {
      return buf.slice(1).reduce((a, b) => (a << 4) | b, buf[0])
    }

    return -1
  }

  const scanIdentifier = c => {
    let name = ''
    do {
      name = name + c
    } while (isAbc((c = next())) || isDigit(c) || c === '_')
    --offset
    if (hasOwnProperty.call(keywords, name)) {
      throw new Error('not implemented')
      // return enqueue(tokenTypes[name], name)
    }
    return enqueue(identifier, name)
  }

  const scanStringLiteral = quote => {
    let c
    let len = 0
    const buf = []

    while (quote !== (c = next())) {
      switch (c) {
        case '\n':
          ++line
          break
        case '\\':
          switch ((c = next())) {
            case 'b':
              c = '\b'
              break
            case 'f':
              c = '\f'
              break
            case 'n':
              c = '\n'
              break
            case 'r':
              c = '\r'
              break
            case 't':
              c = '\t'
              break
            case 'v':
              c = '\v'
              break
            case 'u':
              if ((c = scanHexLiteral(4)) === -1) {
                throw new SyntaxError('invalid unicode escape sequence')
              }
              break
            case 'x':
              if ((c = scanHexLiteral(2)) === -1) {
                throw new SyntaxError('invalid hexadecimal escape sequence')
              }
          }
          break
      }
      buf[++len] = c
    }

    return enqueue(stringLiteral, buf.join(''))
  }

  const scanNumLiteral = c => {
    let n = 0
    let type1 = 0
    let expo = 0
    let e
    let expoType = 1 /* "- / +" || "0 / 1" */

    const scanExpo = () => {
      while (isDigit((c = next())) || c === '+' || c === '-') {
        if (c === '-') {
          expoType = 0
          continue
        } else if (isDigit(c)) {
          expo = expo * 10 + (c.charCodeAt(0) - '0'.charCodeAt(0))
        }
      }

      if (expoType === 0) {
        expo *= -1
      }

      if (type1 === 0) {
        n = n * Math.pow(10, expo)
      } else {
        n = (n / e) * Math.pow(10, expo)
      }
    }

    const scanFloat = () => {
      e = 1
      type1 = 1
      while (isDigit((c = next())) || c === 'e' || c === 'E') {
        if (c === 'e' || c === 'E') {
          scanExpo()
          return
        }
        n = n * 10 + (c.charCodeAt(0) - '0'.charCodeAt(0))
        e *= 10
      }
      n = n / e
    }

    const scanNumber = () => {
      do {
        if (c === '.') {
          scanFloat()
          break
        } else if (c === 'e' || c === 'E') {
          scanExpo()
          break
        }
        n = n * 10 + (c.charCodeAt(0) - '0'.charCodeAt(0))
      } while (isDigit((c = next())) || c === '.' || c === 'e' || c === 'E')
    }

    if (c === '0') {
      switch ((c = next())) {
        case 'x':
          if ((c = scanHexLiteral(2, false)) === -1) {
            throw new SyntaxError('invalid hex value')
          }
          return enqueue(numLiteral, c)
        default:
          --offset
          c = '0'
          scanNumber()
      }
    } else {
      scanNumber()
      --offset
    }

    return enqueue(numLiteral, n)
  }

  while (++offset < input.length) {
    char = input[offset]
    type = fromSymbol(char)

    if (Array.isArray(type)) {
      temp = type[0][next()]
      if (!temp && type.length > 1) {
        type = type[1]
        --offset
      } else {
        type = temp
      }
    }

    if (char === '\n' || char === '\r') {
      ++line
    } else if (char === ' ' || char === '\t') {
      type = undefined
    } else if (char === '"' || char === "'") {
      scanStringLiteral(char)
    } else if (!type) {
      if (isAbc(char) || char === '_') {
        scanIdentifier(char)
      } else if (isDigit(char) || char === '.') {
        try {
          scanNumLiteral(char)
        } catch (e) {
          return SyntaxError(e.message)
        }
      } else {
        enqueue(illegalLiteral, char)
      }
    }
    if (type) {
      enqueue(type, char)
    }
  }

  return queue
}

module.exports = scan
