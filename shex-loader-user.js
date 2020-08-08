#!/usr/bin/env node

const Fs = require('fs')
const N3 = require('n3')
const ShExCore = require('@shexjs/core')
const ShExLoader = require('@shexjs/loader')

const argv = process.argv.slice(1)

// Parse schema and all data.
ShExLoader.load(argv.slice(1, 2), [], argv.slice(2), []).then(loaded => {
  const validator = ShExCore.Validator.construct(loaded.schema)
  const db = ShExCore.Util.makeN3DB(loaded.data)

  loaded.dataMeta.forEach(m => {
    const res = validator.validate(db,
                                   new URL('#x', m.base).href,
                                   'http://a.example/S1')
    console.log(m.base + '\n' + JSON.stringify(res, null, 2))
  })
})
