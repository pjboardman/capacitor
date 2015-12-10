//TODO: redo registration
import { Promise } from 'bluebird'
import _ from 'lodash'
import { EventEmitter } from 'fbemitter'
import Immutable from 'seamless-immutable'

export default class Action {

  constructor() {
    this._listeners = {}
    this._id = 1
    this._emitter = new EventEmitter()
    this._events = [
      'started',
      'finished',
      'failed'
    ]
  }

  send(mutation) {

    let copy = Immutable(mutation)

    this._notify('started', copy)

    return Promise
      .each(_.values(this._listeners), listener => { return listener(mutation) })
      .then(() => { 
        this._notify('finished', copy)
        return mutation 
      })
      .catch(err => {
        this._notify('failed', copy)
        return Promise.reject(err)
      })
  }
  
  register(listener) {
    let id = this._id++
    this._listeners[id] = listener
    return id
  }

  unregister(token) {
    delete this._listeners[token]
  }

  watch(events, watcher) {
    return _.map(this._parseEvents(events), e => {
      return {
        event: e,
        token: this._emitter.addListener(e, watcher)
      }
    })
  }

  _parseEvents(events) {
    if (!events || events === null || events === '*') { 
      return this._events 
    }

    if (events.length) {
      if (_.includes(events, '*')) {
        return this._events
      }

      return events
    }

    return [ events ]
  }

  _notify(e, data) {
    this._emitter.emit(e, {
      event: e,
      mutation: data
    })
  }

}
