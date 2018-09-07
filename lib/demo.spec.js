const { lex } = require('./lex')
const { parse } = require('./parse')

const source = `
.: {
  ..< @date @math @json { &now &random round $36:($ /36) stringify } >
  randomString: < ( length map &($36 round random * /36) ) >
  eventId: < now + randomString >
}
get: {
  body: (stringify { message: /success eventId })
  statusCode: /200
  ..event
}
`

console.log(
  'Abstract Syntax Tree:\n',
  JSON.stringify(parse(source, lex(source)), undefined, 2)
)
