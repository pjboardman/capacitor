import _ from 'lodash'
import Action from '../../src/action'
import Registry from '../../src/action/registry.js'

let actions = new Registry({
  thingCreated: new Action(),
  thisUpdated: new Action(),
  somethingElse: new Action()
})

let addedAction = actions.add('this-deleted')

//our 'logger'
let watcher = (action, event) => {
  console.log('action %s invocation %s : %s', 
              action, 
              event.event, 
              JSON.stringify(event.mutation))
}


//watch all the things
let registered = actions.all()
_.forOwn(registered, (v, k) => {
  v.watch('*', _.partial(watcher, k))
})

//send the actions
actions.thingCreated.send({ payload: 'I am creating' })
addedAction.send({ payload: 'I am deleting' })
actions.send('thisUpdated', { payload: 'I am updating' })
actions.send('somethingElse', { payload: 'This is something else' })
