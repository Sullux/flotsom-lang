const fs = require('fs')
const { resolve: resolvePath } = require('path')

const pure = {
  readFile: (readFile = fs.readFile) =>
    (path, options) =>
      new Promise((resolve, reject) =>
        readFile(
          path,
          options,
          (err, data) => (err ? reject(err) : resolve(data.toString()))
        )),

  load: (readFile = fs.readFile, resolve = resolvePath) =>
    root =>
      path =>
        readFile(resolve(root, path))
}

module.exports = {
  pure,
  load: pure.load(),
}
