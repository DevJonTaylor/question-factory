import { FetchedAnswer } from 'inquirer'
/** Callback Functions */
declare type ChoiceCallback = (choice: Choice) => void
declare type ValidateCallback = (text: string) => boolean | string
declare type QuestionCallback = (question: null|QuestionType) => void

/** Union Types */
declare type QuestionType = Question | List | Input | Choice
declare type ValidateType = string | ValidateCallback


declare type QFactoryObject = Array<QuestionObject>

/** Interfaces */
interface QuestionObject {
  _originalName?: string
  _type?: string
  _name?: string
  _message?: string
  _default?: string
  _validate?: ValidateType
}

interface InputObject extends QuestionObject {}

interface PasswordObject extends QuestionObject {}

interface EditorObject extends QuestionObject {}

interface ListObject extends QuestionObject {
  highlight?: boolean
  loop?: boolean
  pageSize?: number
  choices?: Array<ChoiceObject>
}

interface ChoiceObject {
  _name?: string
  _value?: string
  _key?: string
  _checked?: boolean
  _disabled?: boolean
}

/** Classes */
declare class Question {
  _originalName: string
  _type: ''
  _name: string
  _message: string
  _default: string
  _validate: ValidateType

  constructor(name: string)
  message(message: string): this | string
  default(_default: string): this | string
  validate(validate: ValidateType): this | ValidateType
  get validateEmpty(): this
  get validateEmail(): this
  get isDefault(): this
  get isValidate(): this
  get toObject(): QuestionObject
}

declare class Input extends Question {/** _type = 'input' */}

declare class Password extends Question {/** _type = 'password' */}

declare class Editor extends Question {/** _type = 'editor' */}

/**
 * List class is created to gather choices to create a list with Inquirer.
 * @class
 * @property _type
 * @property _pageSize
 * @property _choices
 * @property _highlight
 * @property _loop
 */
declare class List extends Question {
  /** _type: 'list' */
  _pageSize: number
  _choices: Map<string, Choice>
  _highlight: boolean
  _loop: boolean

  constructor(name: string)

  newChoice(name: string, choiceCallback: ChoiceCallback): this
  hasChoice(name: string): boolean
  getChoice(name: string, choiceCallback: ChoiceCallback): this
  removeChoice(name: string): this
  newChoices(names: Array<string>, choiceCallback: ChoiceCallback): this
  pageSize(pageSize: number): this | number
  addSeparator(id: string | number): this
  get isHighlight(): boolean
  get isLoop(): boolean
  get highlight(): this
  get loop(): this
  get toObject(): ListObject
}

declare class Checkbox extends List {/** _type: 'checkbox' */}

declare class Choice {
  _name: string
  _value: string
  _checked: boolean
  _disabled: boolean
  _key: string

  constructor(name: string)

  name(value: string): this | string
  value(value: string): this | string
  key(key: string): this | string

  get checked(): this
  get disabled(): this
  get toObject(): ChoiceObject

  get isChecked(): boolean
  get isDisabled(): boolean
}

declare class QFactory {
static _collection: Map<string, QuestionType>

private static _addQuestion(q: string, msg: string|QuestionCallback, cb: QuestionCallback): QFactory
private static _clearCollection(): void
static hasQuestion(name: string): boolean
static getQuestion(name: string, cb: QuestionCallback): QFactory
static input(name: string, message: string, cb: QuestionCallback): QFactory
static editor(name: string, message: string, cb: QuestionCallback): QFactory
static password(name: string, message: string, cb: QuestionCallback): QFactory
static list(name: string, message: string, cb: QuestionCallback): QFactory
static checkbox(nam: string, message: string, cb: QuestionCallback): QFactory
static get validateEmpty(): ValidateCallback
static get validateEmail(): ValidateCallback
static get validateNumbers(): ValidateCallback
static get toObject(): QFactoryObject
static get answers(): Promise<FetchedAnswer>
}