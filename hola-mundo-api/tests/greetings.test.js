/* eslint-disable no-undef */
'use strict'

const sendGreeting = require('../src/greetings')

test('Tests greeting to equal "Hello world"', () => {
  const greeting = sendGreeting()

  expect(greeting).toBe('Hello world')
})
