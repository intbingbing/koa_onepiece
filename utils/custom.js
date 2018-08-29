const fs = require('fs')

const readFile = path => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if (err) reject(err);
            resolve(data)
        })
    })
}

const writeFile = (path, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, err => {
            if (err) reject(err);
            resolve()
        })
    })
}

module.exports = {
    readFile,
    writeFile
}