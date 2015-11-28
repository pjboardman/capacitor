import _ from 'lodash'
import invariant from 'invariant'
import Action from './index.js'

export default class Registry {

  constructor(actions) {
    if (actions) {
      this._addActions(actions)
    }
  }

  addAction(name, action) {
    this._createActionByName(name, action)
  }

  addByName(name) {
    return this._createActionByName(name)
  }

  send(name, mutation) {
    let normal = this._normalize(name)
    let action = this[normal]

    invariant(action, 'Could not find an action named ' + name)
    return action.invoke(mutation)
  }

  _createActionByName(name, action) {
    if (_.includes(name, '-')) {
      name = this._normalize(name)
    }

    action = action || new Action()
    this._transferActionToThis(name, action)
    return action
  }

  _normalize(s) {
    return _.camelCase(s)
  }

  _addActions(actions) {
    if (_.isArray(actions)) {
      this._createActionsByName(actions)
    } else if (_.isPlainObject(actions)) {
      this._transferActionsToThis(actions)
    } else {
      throw new Error('Registry created with unknown payload type')
    }
  }

  _createActionsByName(names) {
    _.forEach(names, name => {
      this._createActionByName(name)
    })
  }
  
  _transferActionsToThis(actions) {
    _.forOwn(actions, (v, k) => { 
      this._transferActionToThis(k, v)
    })
  }

  _transferActionToThis(name, action) {
    let normal = this._normalize(name)
    invariant(name === normal, 'Action name must be in the form ' + normal + ' or ' + _.kebabCase(normal) + '; received: ' + name)
    this[name] = action
  }
}
