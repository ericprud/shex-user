#!/usr/bin/env node

const Fs = require('fs')
const N3 = require('n3')
const ShExCore = require('@shexjs/core')
const ShExParser = require('@shexjs/parser')

const argv = process.argv.slice(1) // same for windows?
const Base = new URL('http://example.com/base/')

// Parse schema.
const shexc = Fs.readFileSync(argv[1], 'utf8')
const shexParser = ShExParser.construct()
const schema = shexParser.parse(shexc)
const validator = ShExCore.Validator.construct(schema)
// console.log(JSON.stringify(schema, null, 2))

for (let i = 2; i < argv.length; ++i) {
  // Parse data.
  const data = new N3.Store()
  const baseIRI = new URL(argv[i], Base)
  const turtleParser = new N3.Parser({
    format: 'text/n3',
    baseIRI: baseIRI.href
  })
  const turtle = Fs.readFileSync(argv[i], 'utf8')
  data.addQuads(turtleParser.parse(turtle))

  // Validate data.
  const res = validator.validate(ShExCore.Util.makeN3DB(data),
                                 new URL('#x', baseIRI).href,
                                 'http://a.example/S1')
  console.log(argv[i] + '\n' + JSON.stringify(res, null, 2))
}
