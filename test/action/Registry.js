import { should } from '../chai.js'
import sinon from 'sinon'
import _ from 'lodash'

import { registry, Action } from '../../src/action'

describe('action registry', () => {


  it('should allow an action to be registered', () => {

    registry.register('firstTest')

    registry.firstTest.should.be.instanceOf(Action)
  })

  it('should allow a list of actions to be registered', () => {

    registry.register([
      'thingsAndStuff',
      'otherThings'
    ])

    registry.thingsAndStuff.name.should.equal('thingsAndStuff')
    registry.otherThings.should.be.instanceOf(Action)
  })

  it('registrations should be idempotent', () => {

    let action = registry.register('idemoptent')

    registry.register('idemoptent').should.equal(action)
  })

  it('should allow early-bound subscriptions', () => {

    //register
    registry.register('earlyBound')

    //subscribe
    let listener = sinon.stub()
    registry.subscribe('earlyBound', listener)

    return registry.earlyBound.send({}).then(() => {
      listener.should.be.called
    })
  })

  it('should allow late-bound subscriptions', () => {

    //subscribe
    let listener = sinon.stub()
    registry.subscribe('lateBound', listener)

    //register
    registry.register('lateBound')

    return registry.lateBound.send({}).then(() => {
      listener.should.be.called
    })
  })

  it('should return all actions registered', () => {

    registry.register([
      'thingsAndStuff',
      'otherThings'
    ])

    _.keys(registry.all).length.should.be.greaterThan(1)
  })

  describe('sending by action name', () => {

    it('should allow sending an action by name', () => {

      let action = registry.register('testThis')
      let listener = sinon.stub()
      action.subscribe(listener)

      return registry.send('testThis', {}).then(() => {
        listener.should.be.called
      })

    })

    it('should error if the action name does not exist', () => {

      let fn = _.bind(registry.send, registry, 'somethingThatDoesNotExist')

      fn.should.throw(/Could not find/)
    })
  })
})
