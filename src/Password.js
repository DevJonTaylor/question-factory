const Question = require('./Question/Question')

module.exports = class Password extends Question {
  _type = 'password'
}