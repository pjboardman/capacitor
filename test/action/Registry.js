import { should } from '../chai.js'
import sinon from 'sinon'
import { Promise } from 'bluebird'
import _ from 'lodash'

import { registry, Action } from '../../src/action'

describe.only('action registry', () => {


  it('should allow an action to be registered');

  it('should allow a list of actions to be registered', () => {
    registry.register([
      'thingsAndStuff',
      'otherThings'
    ])

    registry.thingsAndStuff.name.should.equal('thingsAndStuff')
    registry.otherThings.should.be.instanceOf(Action)
  })

  it('registrations should be idempotent');

  it('should allow early-bound subscriptions');

  it('should allow late-bound subscriptions');

  it('should return all actions registered', () => {
    registry.register([
      'thingsAndStuff',
      'otherThings'
    ])

    _.keys(registry.all).length.should.be.greaterThan(1);
  })

  /*
  describe.skip('sending by action name', () => {

    it('should allow sending an action by name', () => {
      let action = {
        send: () => {}
      }
      let promise = Promise.resolve()
      let send = sinon.stub(action, 'send').returns(promise)
      var mutation = { test: 'this' }

      registry.add('testThis', action)

      return registry.send('testThis', mutation).then(() => {
        send.should.be.calledWith(mutation)
      })

    })

    it('should error if the action name does not exist', () => {
      let registry = new Registry()

      try {
        registry.send('somethingThatDoesntExist')
        throw new Error('not this')
      } catch(e) {
        e.message.should.not.equal('not this')
      }
    })
  })
 */
})
