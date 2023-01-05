#!/usr/bin/env node

const { scan, parse } = require('.')

const input = process.argv.slice(2)[0]

if (!input) {
  process.exit(1)
}

/* eslint-disable */
console.log(JSON.stringify(parse(scan(input))))

