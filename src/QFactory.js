import { isUndefined, isString } from 'lodash'
import { Input, List, Checkbox, Editor, Password, Number } from './'
import { prompt } from 'inquirer'
/**
 * @typedef {Question|List|Input|Editor|Checkbox|Choice} QuestionTypes
 * @typedef {function(question: QuestionTypes | null): void} QuestionCallback
 */

class QFactory {
  /**
   * @this {this}
   * @private
   * @type {Map<string, QuestionTypes>}
   */
  static _collection = new Map()

  /**
   * Add a question to the question list
   * @param {QuestionTypes} q
   * @param {string | QuestionCallback} [msg]
   * @param {QuestionCallback} [cb]
   * @returns {this}
   * @private
   */
  static _addQuestion(q, msg, cb) {
    const isMsgUnd = isUndefined(msg),
      isCbUnd = isUndefined(cb)
    this._collection.set(q._name, q)

    if (isMsgUnd && isCbUnd) return this

    if (isCbUnd) {
      if (isString(msg)) q.message(msg)
      else msg(q)

      return this
    }

    cb(q.message(msg))

    return this
  }

  /**
   * Resets the collection back to zero.
   * @private
   */
  static _clearCollection() {
    this._collection = new Map()
  }

  /**
   * Returns if the name of the question exists.
   * @param {string} name
   * @returns {boolean}
   */
  static hasQuestion(name) {
    return this._collection.has(name)
  }

  /**
   * Returns a Question to the callback if it exists.  If it does not exist the callback receives null.
   * @param {string} name
   * @param {QuestionCallback} cb
   * @returns {this}
   */
  static getQuestion(name, cb) {
    if (!this.hasQuestion(name)) cb(null)
    else cb(this._collection.get(name))

    return this
  }

  /**
   * Creates a new Input class and adds it to the collection.
   * If you pass a callback as the second argument it will not pass a message to the new Question.
   * If you pass a string as the second argument it will pass a message to the new Question and to the callback.
   * @param {string} name
   * @param {string | QuestionCallback} [message]
   * @param {QuestionCallback} [cb]
   * @returns {this}
   * @example QFactory.input('input question', 'I am a message', (question) => {
   *   question.validateEmpty;
   * });
   */
  static input(name, message, cb) {
    this._addQuestion(new Input(name), message, cb)

    return this
  }

  /**
   * Creates a new Editor class and adds it to the collection.
   * If you pass a callback as the second argument it will not pass a message to the new Question.
   * If you pass a string as the second argument it will pass a message to the new Question and to the callback.
   * @param {string} name
   * @param {string | QuestionCallback} [message]
   * @param {QuestionCallback} [cb]
   * @returns {this}
   * @example QFactory.input('input question', 'I am a message', (question) => {
   *   question.validateEmpty;
   * });
   */
  static editor(name, message, cb) {
    this._addQuestion(new Editor(name), message, cb)

    return this
  }

  /**
   * Creates a new Password class and adds it to the collection.
   * If you pass a callback as the second argument it will not pass a message to the new Question.
   * If you pass a string as the second argument it will pass a message to the new Question and to the callback.
   * @param {string} name
   * @param {string | QuestionCallback} [message]
   * @param {QuestionCallback} [cb]
   * @returns {this}
   * @example QFactory.password('password question', 'I am a message', password => question.validateEmpty)
   */
  static password(name, message, cb) {
    this._addQuestion(new Password(name), message, cb)

    return this
  }

  /**
   * Creates a new Number class and adds it to the collection of Questions.
   * If you pass a callback as the second argument it will not pass a message to the new Question.
   * If you pass a string as the second argument it will pass a message to the new Question and to the callback.
   * @param {string} name
   * @param {string | QuestionCallback} [message]
   * @param {QuestionCallback} [cb]
   * @returns {this}
   * @example QFactory.number('number question', 'I am a message', number => question.validateEmpty)
   */
   static number(name, message, cb) {
    this._addQuestion(new Number(name), message, cb)

    return this
  }

  /**
   * Creates a new List class and adds it to the collection.
   * If you pass a callback as the second argument it will not pass a message to the new Question.
   * If you pass a string as the second argument it will pass a message to the new Question and to the callback.
   * @param {string} name
   * @param {string | QuestionCallback} [message]
   * @param {QuestionCallback} [cb]
   * @return {this}
   */
  static list(name, message, cb) {
    this._addQuestion(new List(name), message, cb)

    return this
  }

  /**
   * Creates a new Checkbox class and adds it to the collection.
   * If you pass a callback as the second argument it will not pass a message to the new Question.
   * If you pass a string as the second argument it will pass a message to the new Question and to the callback.
   * @param {string} name
   * @param {string | QuestionCallback} [message]
   * @param {QuestionCallback} [cb]
   * @return {this}
   */
  static checkbox(name, message, cb) {
    this._addQuestion(new Checkbox(name), message, cb)

    return this
  }

  /**
   * Provides a callback to validate the Question's response to ensure it is not empty.
   * @returns {function(q: QuestionTypes): boolean|string}
   */
  static get validateEmpty() {
    return q => q.validateEmpty
  }

  /**
   * Provides a callback to validate the Question's response is a valid email.
   @returns {function(q: QuestionTypes): boolean|string}
   */
  static get validateEmail() {
    return q => q.validateEmail
  }

  /**
   *
   * @returns {{highlight: boolean, loop: boolean, pageSize: number, choices: *[]}[]}
   */
  static get toObject() {
    return [...this._collection.values()].map(q => q.toObject)
  }

  static get answers() {
    const collection = this.toObject
    this._clearCollection()
    return prompt(collection)
  }
}

export default QFactory
