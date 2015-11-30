import _ from 'lodash'
import invariant from 'invariant'
import Action from './index.js'

export default class Registry {

  constructor(actions) {
    this._actions = {}
    if (actions) {
      this._addActions(actions)
    }
  }

  add(name, action) {
    return this._addAction(name, action)
  }

  all() {
    return this._actions
  }

  send(name, ...args) {
    let action = this._actions[name]

    invariant(action, 'Could not find an action named ' + name)

    return action.send(...args)
  }

  _addActions(actions) {
    if (_.isArray(actions)) {
      actions = this._hydrate(actions)
    } 
    
    invariant(_.isPlainObject(actions), 'Registry created with unknown payload type')

    _.forOwn(actions, (v, k) => {
      this._addAction(k, v)
    })
  }

  _addAction(name, action) {
    action = action || new Action()
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

  _hydrate(names) {
    let actions = {}
    _.forEach(names, name => {
      actions[name] = undefined
    })
    
    return actions
  }
}
