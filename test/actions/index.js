
describe('actions', () => {

  describe('creating an action', () => {})

  describe('invoking an action', () => {

    it('should return a promise')
  })

  describe('dispatching an action', () => {

    it('registered listener should receive the mutation')
    it('unregistered listener should not receive the mutations')
    it('should stop dispatching on the first error')
    it('should handle a listener not returning a promise')
  })

  describe('watching an action', () => {

    it('should allow watching all events')

    describe('should allow watching specific events', () => {

      it('started')
      it('finished')
      it('error')
    })
  })
})
