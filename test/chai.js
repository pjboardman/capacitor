/*
 * helper script on top of chai to pre-load common plugins, configuration, etc.
 */

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinonChai from 'sinon-chai'

chai.use(chaiAsPromised)
chai.use(sinonChai)
chai.config.includeStack = true

export let should = chai.should()
export let assert = chai.assert
export let expect = chai.expect

export default chai
