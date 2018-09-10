const { Script, createContext } = require('vm')

const compile = (name, code, {
  checked = false,
  initialState = {},
  filename,
  lineOffset = 0,
  columnOffset = 0,
} = {}) => (checked
  ? ((script, context, options) =>
    (...args) => {
      try {
        return script.runInContext(context, options)(...args)
      } catch (err) {
        return { '!': err }
      }
    })(
    new Script(code),
    createContext({ ...initialState, setTimeout }, { name }),
    { filename, lineOffset, columnOffset }
  )
  : ((script, context, options) =>
    (...args) =>
      script.runInContext(context, options)(...args))(
    new Script(code),
    createContext({ ...initialState, setTimeout }, { name }),
    { filename, lineOffset, columnOffset }
  ))

module.exports = { compile }
