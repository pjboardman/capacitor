import { should } from '../chai.js'
import sinon from 'sinon'
import { Promise } from 'bluebird'
import _ from 'lodash'

import Action, { Registry } from '../../src/action'

describe('action registry', () => {

  it('should accept a collection of actions on construction', () => {
    let registry = new Registry({ 
      thisOne: new Action(),
      thatOne: new Action()
    })

    registry.thisOne.should.be.instanceOf(Action)
    registry.thisOne.name.should.equal('thisOne')
    registry.thatOne.should.be.instanceOf(Action)
  })

  it('should accept a collection of action names on construction', () => {
    let registry = new Registry([
      'thisTwo',
      'thatTwo'
    ])

    registry.thisTwo.should.be.instanceOf(Action)
    registry.thisTwo.name.should.equal('thisTwo')
    registry.thatTwo.should.be.instanceOf(Action)
  })

  it('should allow actions to be added', () => {
    let registry = new Registry()

    let thingsAndStuff = new Action()
    thingsAndStuff.unique = true
    registry.add('thingsAndStuff', thingsAndStuff)
    registry.add('otherThings')

    registry.thingsAndStuff.should.equal(thingsAndStuff)
    registry.thingsAndStuff.name.should.equal('thingsAndStuff')
    registry.otherThings.should.be.instanceOf(Action)
  })

  it('should return all actions registered', () => {
    let registry = new Registry([
      'thisThree',
      'thatThree'
    ])

    let actions = registry.all()
    actions.thisOne.should.be.instanceOf(Action)
    actions.thatOne.should.be.instanceOf(Action)
    _.keys(actions).length.should.be.greaterThan(2)
  })

  describe('sending by action name', () => {

    it('should allow sending an action by name', () => {
      let action = {
        send: () => {}
      }
      let promise = Promise.resolve()
      let send = sinon.stub(action, 'send').returns(promise)
      var mutation = { test: 'this' }
      let registry = new Registry()

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
})
