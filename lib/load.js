const fs = require('fs')

const blockStartChars = '[{(|\'/'

const pure = {
  readFile: (readFile = fs.readFile) =>
    (path, options) =>
      new Promise((resolve, reject) =>
        readFile(
          path,
          options,
          (err, data) => (err ? reject(err) : resolve(data.toString()))
        )),

  load: (readFile = pure.readFile()) =>
    path =>
      readFile(path)
        .then(code => code.trim())
        .then(code => (blockStartChars.includes(code[0]) ? code : `{${code}}`))
}

module.exports = {
  pure,
  readFile: pure.readFile(),
  load: pure.load(),
}
