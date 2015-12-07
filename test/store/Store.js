import { should } from '../chai.js'
import sinon from 'sinon'
import Action from '../../src/action/index.js'

describe('Store', () => {
  let test, EventEmitter, emitter

  beforeEach(() => {
    emitter = {
      emit: () => {},
      addListener: () => {}
    }

    let fbemitter = require('fbemitter')
    EventEmitter = sinon.stub(fbemitter, 'EventEmitter').returns(emitter)
    let Store = require('../../src/store/store.js').default
    test = new Store()
  })

  afterEach(() => {
    EventEmitter.restore()
  })

  it('should return initial state', () => {
    test.should.respondTo('getInitialState')
  })

  it('should notify listeners of a change in state', () => {
    let listener = sinon.stub()
    let emit = sinon.stub(emitter, 'emit')
    let register = sinon.stub(emitter, 'addListener')

    test.addListener(listener)
    test._onChanged()

    register.should.have.been.calledWith('change', listener)
    emit.should.have.been.calledWith('change')
  })

  it('should subscribe to actions', () => {
    let action1 = new Action()
    let action2 = new Action()
    action1.name = 'testing'
    sinon.stub(action1, 'register').returns('A')
    sinon.stub(action2, 'register').returns('B')
    
    test._subscribe(action1, sinon.stub())
    test._subscribe(action2, sinon.stub())

    test._actions['testing'].should.equal('A')
    test._actions['anonymous'][0].should.equal('B')
  })

  it('should prevent multiple subscriptions to the same action', () => {
    let action1 = new Action()
    let action2 = new Action()
    action1.name = action2.name = 'testing'
    sinon.stub(action1, 'register').returns('A')
    sinon.stub(action2, 'register').returns('B')

    test._subscribe(action1, sinon.stub())
    try {
      test._subscribe(action2, sinon.stub())
      throw new Error('fail')
    } catch(e) {
      e.message.should.not.equal('fail')
    }
  }) 
})
