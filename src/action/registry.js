import _ from 'lodash'
import invariant from 'invariant'
import Action from './Action.js'
import Immutable from 'seamless-immutable'

class Registry {

  constructor() {
    this._actions =  {}
  }

  register(registration) {
    if (_.isArray(registration)) {
      return _.map(registration, this._addAction, this)
    }

    return this._addAction(registration)
  }

  get all() {
    return Immutable(this._actions)
  }

  subscribe(name, listener) {
    var action = this._addAction(name)
    return action.subscribe(listener)
  }

  send(name, ...args) {
    let action = this._actions[name]

    invariant(action, 'Could not find an action named ' + name)

    return action.send(...args)
  }

  _addAction(name) {
    if (this._actions[name]) return this._actions[name]

    let action = new Action()
    Object.defineProperty(action, 'name', this._getNameDescriptor(name))
    this._actions[name] = action
    Object.defineProperty(this, name, this._getActionDescriptor(name))
    return action
  }

  _getNameDescriptor(name) {
    return {
      configurable: false,
      value: name,
      writable: false
    }
  }

  _getActionDescriptor(name) {
    return {
      configurable: false,
      enumerable: true,
      get: () => {
        return this._actions[name]
      }
    }
  }
}

let registry = new Registry()
export default registry
