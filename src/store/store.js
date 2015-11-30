import { EventEmitter } from 'fbemitter'
import invariant from 'Invariant'

/**
 * base store class
 */
export default class Store {

  constructor() {
    this._changeEvent = 'change'
    this._emitter = new EventEmitter()
    this._actions = {
      anonymous: []
    }
  }

  getInitialState() {}

  addListener(listener) {
    this._emitter.addListener(this._changeEvent, listener)
  }

  _onChanged() {
    this._emitter.emit(this._changeEvent)
  }

  _subscribe(action, subscriber) {
    invariant(!action.name || !this._actions[action.name], 'Attempted to subscribe to an action more than once: %s', action.name)
    let token = action.register(subscriber)
    if (action.name) {
      this._actions[action.name] = token
    } else {
      this._actions.anonymous.push(token)
    }
  }
}
