import { should } from '../chai.js'
import sinon from 'sinon'
import 'sinon-as-promised'

describe.only('actions:', () => {

  let Action, EventEmitter, emitter

  beforeEach(() => {
    emitter = {
      emit: () => {},
      addListener: () => {}
    }

    let fbemitter = require('fbemitter')
    EventEmitter = sinon.stub(fbemitter, 'EventEmitter').returns(emitter)
    Action = require('../../src/action').Action
  })

  afterEach(() => {
    EventEmitter.restore()
  })

  describe('sending an action:', () => {

    it('should return the mutation after dispatching has completed', () => {
      let mutation = { things: 'stuff' }
      let test = new Action()

      test.send(mutation).should.become(mutation)
    })

    it('should dispatch the state and mutation to all subscribed listeners', () => {
      let listener1 = sinon.stub()
      let listener2 = sinon.stub()
      var mutation = { test: 'test' }

      let test = new Action()
      test.subscribe(listener1)
      test.subscribe(listener2)

      return test.send(mutation).then(() => {
        listener1.should.be.calledWith(mutation)
        listener2.should.be.calledWith(mutation)
      })
    })

    it('should not dispatch to listeners that unsubscribe', () => {
      let listener1 = sinon.stub()
      let listener2 = sinon.stub()
      var mutation = { test: 'test' }

      let test = new Action()
      test.subscribe(listener1)
      let subscription = test.subscribe(listener2)
      subscription.unsubscribe()

      return test.send(mutation).then(() => {
        listener1.should.be.calledWith(mutation)
        listener2.should.not.be.called
      })
    })
    
    it('should stop dispatching on the first error', () => {
      let listener1 = sinon.stub().rejects('good')
      let listener2 = sinon.stub()
      var mutation = { test: 'test' }

      let test = new Action()
      test.subscribe(listener1)
      test.subscribe(listener2)

      return test.send(mutation)
        .then(() => { throw new Error('bad') })
        .catch(err => {
          err.message.should.equal('good')
          listener1.should.be.calledWith(mutation)
          listener2.should.not.be.called
        })
    })
  })

  describe('watching an action', () => {

    let emit, addListener

    beforeEach(() => {
      emit = sinon.stub(emitter, 'emit')
      addListener = sinon.stub(emitter, 'addListener')
    })

    afterEach(() => {
      emit.restore()
      addListener.restore()
    })

    it('should receive a read-only copy of the mutation', () => {
      let mutation = { test: 'test' }

      let test = new Action()

      return test.send(mutation).then(() => {
        let ro = emit.firstCall.args[1].mutation
        ro.test.should.equal('test')

        try {
          ro.test = 'something else'
          throw new Error('bad')
        } catch(err) {
          return err.message.should.not.equal('bad')
        }
      })
    })

    it('should allow watching all events', () => {
      let watcher = sinon.stub()
      let test = new Action()

      test.watch(['*'], watcher)

      addListener.firstCall.args[0].should.equal('started')
      addListener.secondCall.args[0].should.equal('finished')
      addListener.thirdCall.args[0].should.equal('failed')
    })

  })
})
