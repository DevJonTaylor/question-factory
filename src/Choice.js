const { camelCase, isEmpty, isUndefined } = require('lodash')

/**
 * The Choice class is used to create a choice object that can be used in a form
 * @property {string} _name
 * @property {string} _value
 * @property {string} _key
 * @property {boolean} _checked
 * @property {boolean} _disabled
 * */
module.exports = class Choice {
  _name = ''
  _value = ''
  _checked = false
  _disabled = false
  _key = ''

  /**
   * Create a new Choice object
   * @param {string} name
   */
  constructor(name) {
    if (isUndefined(name)) throw new Error('Choice requires a name.  You must provide one when creating a new one.')
    this._name = name
  }

  /**
   * Sets the name string and returns this for chaining.
   * If nothing is provided in the parameter then it returns the name.
   * @param {string | undefined} value - The value to set the name to.
   * @type {function(value: undefined): string | function(value: string): Choice}
   * @returns {Choice | string}
   */
  name(value = undefined) {
    if (isUndefined(value)) return this._name
    this._name = value

    return this
  }

  /**
   * If no value is passed in, return the current value.
   * If a value is passed in, set the current value to the camel cased version of the value and return
   * @param {string | undefined} value
   * @returns {Choice | string}
   */
  value(value = undefined) {
    if (typeof value === 'undefined') return this._value
    this._value = camelCase(value)

    return this
  }

  /**
   * If the key parameter is not provided it will return the current value.
   * Otherwise, it will set the value provided and return this for chaining.
   * @param {string | undefined} key
   * @type { function(key: undefined): string | function(key: string): Choice}
   * @returns {Choice | string}
   */
  key(key = undefined) {
    if (isUndefined(key)) return this._key
    this._key = key

    return this
  }

  /**
   * Returns the value of the checked property
   * @returns {boolean}
   */
  get isChecked() {
    return this._checked
  }

  /**
   * The `checked` property is a getter and setter.
   * It toggles between true and false.
   * It returns Choice for chaining.
   * @returns {Choice}.
   */
  get checked() {
    this._checked = !this._checked

    return this
  }

  /**
   * Returns a boolean value that indicates whether the choice is disabled.
   * @returns {boolean}.
   */
  get isDisabled() {
    return this._disabled
  }

  /**
   * The `disabled` property is set to the opposite of its current value.
   * It toggles between true and false.
   * It returns Choice for chaining.
   * @returns {Choice}.
   */
  get disabled() {
    this._disabled = !this._disabled

    return this
  }

  /**
   * If value and key are not set and checked and disabled are set to false then this will return name and value.
   * It will use the name as the value and make the name camelCase.
   * @returns {{
   *    name: string,
   *    value: string,
   *    key?: string,
   *    checked?: boolean,
   *    disabled?: boolean
   * }}
   */
  get toObject() {
    const returnMe = {
      name: this._name,
      value: '',
    }

    const isValue = isEmpty(this._value),
      isKey = isEmpty(this._key)
    if (this.isChecked) returnMe.checked = true
    if (this.isDisabled) returnMe.disabled = true
    if (!isValue) returnMe.value = this._value
    else returnMe.value = camelCase(returnMe.name)
    if (!isKey) returnMe.key = this._key

    return returnMe
  }
}
