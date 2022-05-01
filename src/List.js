const Question = require('./Question/Question')
const Choice = require('./Choice')
const { Separator } = require('inquirer')
const { isFunction, isUndefined, camelCase } = require('lodash')

module.exports = class List extends Question {
  _type = 'list'
  _pageSize = 10
  _choices = new Map()
  _highlight = false
  _loop = true

  /**
   * @param {string} name
   */
  constructor(name) {
    super(name)
  }

  /**
   * Create a new choice with the given name, and call the callback function with the new choice as an argument.
   * @param {string} name - The name of the choice.
   * @param {function(choice: Choice): void} [callback] - A function that will be called when the choice is selected.
   * @returns {this} For chaining
   */
  newChoice(name, callback) {
    const choice = new Choice(name)
    this._choices.set(name, choice)

    if (!isUndefined(callback)) callback(choice)
    return this
  }

  /**
   * Given a name, return true if the name is in the list of choices
   * @param {string} name - The name of the choice.
   * @returns {boolean}
   */
  hasChoice(name) {
    return this._choices.has(name)
  }

  /**
   * If the choice exists, return it. Otherwise, return null inside the callback
   * @param {string} name - The name of the choice.
   * @param {function(choice: Choice | null): void} callback - A function that will be called when the choice is made.
   * @returns {this} for chaining.
   */
  getChoice(name, callback) {
    if (!this.hasChoice(name)) callback(null)

    callback(this._choices.get(name))

    return this
  }

  /**
   * Remove a choice from the list of choices
   * @param {string} name - The name of the choice.
   * @returns {this} for chaining.
   */
  removeChoice(name) {
    this._choices.delete(name)

    return this
  }

  /**
   * Create a new Choice object for each name in the names array.
   * @param {Array<string>} names - an array of strings that represent the names of the choices.
   * @param {function({ [name:string]: Choice }): void} [callback]
   * @returns {QuestionTypes} for chaining.
   */
  newChoices(names, callback) {
    const choices = {}
    names.map(name => {
      const camelCaseName = camelCase(name)
      choices[camelCaseName] = new Choice(name)
      this._choices.set(name, choices[camelCaseName])
    })

    if (isFunction(callback)) callback(choices)

    return this
  }

  /**
   * Set the page size for the current request
   * @param pageSize - The number of items to show at one time.
   * @returns {this} for chaining.
   */
  pageSize(pageSize) {
    if (typeof pageSize === 'undefined') return this
    this._pageSize = pageSize

    return this
  }

  /**
   * Add a separator to the menu
   * @param {string|number} id - The id of the Separator so that you can locate it later.
   * @returns {this} for chaining.
   */
  addSeparator(id) {
    this._choices.set(`${id}`, new Separator())

    return this
  }

  /**
   * Get the value of the `isHighlight` property
   * @returns {boolean}.
   */
  get isHighlight() {
    return this._highlight
  }

  /**
   * Get the value of the `isLoop` property
   * @returns {boolean}
   */
  get isLoop() {
    return this._loop
  }

  /**
   * Toggles the highlight options between false and true.
   * @returns {this} for chaining.
   */
  get highlight() {
    this._highlight = !this._highlight
    return this
  }

  /**
   * Toggles the loop value between false and true.
   * @returns {this} for chaining.
   */
  get loop() {
    this._loop = !this._loop

    return this
  }

  /**
   * This extends the original toObject method's return value.
   * @return {{highlight: boolean, loop: boolean, pageSize: number, choices: *[]}}
   */
  get toObject() {
    const choices = [...this._choices.values()].map(choice => {
      if (choice instanceof Separator) return choice
      return choice.toObject
    })
    return {
      ...super.toObject,
      highlight: this._highlight,
      choices,
      pageSize: this._pageSize,
      loop: this._loop,
    }
  }
}
