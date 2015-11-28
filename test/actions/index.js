
describe('actions', () => {

  describe('creating an action', () => {})

  describe('invoking an action', () => {
    it('should return a promise')
  })

  describe('receiving an action dispatch', () => {
    it('should receive the mutation if registered')
    it('should not receive the mutations if unregistered')
    it('should not receive the mutation if a previous dispatch failed')
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
