# Flotsom Lang

_Note: this programming language is a learning exercise. It is not intended for production use at this time._

This language should:
* be readable and expressive
* use scoped context instead of argument passing
* maximize the ability to perform static analysis
* not make the distinction between code and data
* make functions a first-class citizen

## Sample Scripts
Various old way/new way scripts.

### Example 1: Lambda Handler
The Javascript way:
```javascript
// abstract implementation of the aws lambda handler logic
module.exports.handler = impl =>
  (event, context, callback) => {
    try {
      Promise.resolve(impl(event))
        .then(result => callback(undefined, result))
        .catch(callback)
    } catch (err) {
      callback(err)
    }
  }
```
The new way:
```
# abstract implementation of the aws lambda handler logic
handler: < &[impl event context callback]
  result: (await impl)
  (callback [?! ?result]) >
```

### Example 2 Event Handler
The Javascript way:
```javascript
const pure = {
  // returns a random string of digits and lower-case characters
  randomString: (length, random = Math.random) =>
    [...Array(length)].map(i => (~~(random() * 36)).toString(36)).join(''),

  // generates an event ID from a timestamp plus a random string
  createEventId: (now = Date.now, randomString = pure.randomString) =>
    `${now()}.${randomString()}`,

  // the api GET handler implementation
  get: (createEventId = pure.createEventId) =>
    event =>
      Object.assign(
        {
          statusCode: 200,
          body: JSON.stringify({
            message: 'success',
            eventId: createEventId(),
          }),
        },
        event),
}
module.exports = get()
```
The new way:
```
.: {
  ..< @date @math @json { &now &random round $36: ($ 36) stringify } >
  randomString: < &[length]
    ( [..length] map &($36 round random * /36) ) >
  eventId: &'${now()}.${randomString()}'
}
get: {
  body: (stringify { message: /success eventId })
  statusCode: /200
  ..event
}
```
