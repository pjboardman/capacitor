import { should } from '../chai.js'
import sinon from 'sinon'
import { Promise } from 'bluebird'

import Registry from '../../src/action/registry.js'
import Action from '../../src/action'

describe('action registry', () => {

  it('should accept a collection of actions on construction', () => {
    let registry = new Registry({ 
      thisOne: new Action(),
      thatOne: new Action()
    })

    registry.thisOne.should.be.instanceOf(Action)
    registry.thatOne.should.be.instanceOf(Action)
  })

  it('should accept a collection of action names on construction', () => {
    let registry = new Registry([
      'thisOne',
      'that-one'
    ])

    registry.thisOne.should.be.instanceOf(Action)
    registry.thatOne.should.be.instanceOf(Action)
  })

  it('should allow actions to be added', () => {
    let registry = new Registry()

    let thingsAndStuff = new Action()
    registry.addAction('thingsAndStuff', thingsAndStuff)
    registry.addAction('other-things', new Action())

    registry.thingsAndStuff.should.equal(thingsAndStuff)
    registry.otherThings.should.be.instanceOf(Action)
  })

  it('should allow actions to be created by name', () => {
    let registry = new Registry()

    let action1 = registry.addByName('thisOne')
    let action2 = registry.addByName('that-one-too')

    action1.should.be.instanceOf(Action)
    action2.should.be.instanceOf(Action)
    registry.thisOne.should.equal(action1)
    registry.thatOneToo.should.equal(action2)
  })

  describe('sending by type name', () => {

    it('should allow sending an action by type name', () => {
      let action = {
        invoke: () => {}
      }
      let promise = Promise.pending()
      promise.resolve()
      let invoke = sinon.stub(action, 'invoke').returns(promise.promise)
      var mutation = { test: 'this' }
      let registry = new Registry()

      registry.addAction('testThis', action)

      return registry.send('testThis', mutation).then(() => {
        invoke.should.be.calledWith(mutation)
      })

    })

    it('should error if the type name does not exist', () => {
      let registry = new Registry()

      try {
        registry.send('testThis')
        throw new Error('not this')
      } catch(e) {
        e.message.should.not.equal('not this')
      }
    })
  })
})
