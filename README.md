# capacitor
Yet another flux implementation

##why another flux framework?

### what we need
 * Typed actions (no magic strings)
 * Sequenced mutations (like waitFor, but without having to know your neighbor's business)
 * Path to integrate with something like Relay (smarter server interaction)
 * unidrectional actions
 * ability to intercept calls (for advanced logging)

### why not existing ones
 * most use magic strings
 * redux --> 1 store to rule them all...doesn't seem very flexible (see Relay)
 * why not support promises out of the box?
 * if components have to know how to locate action creators or magic strings, why not just have a registry of actions that can provide more meaningful functionality?
 * also, why have a single dispatcher? If we're worried about violating SRP, then let's compose

### Major Components
 1. Actions 
  1. dispatch to stores
  1. notify watchers
  1. return promise
 1. Stores
  1. Composable (ex. AggregateRootStore)
  1. Independent

### Secondary Components
 1. React helpers



