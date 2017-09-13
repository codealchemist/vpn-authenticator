const ask = require('just-ask')
const fs = require('fs')
const series = require('p-series')
const FileReader = require('jfile')

module.exports = class AuthFile {
  constructor (authFile) {
    console.log('- Auth file: ', authFile)
    this.authFile = authFile
  }

  exists () {
    return fs.existsSync(this.authFile)
  }

  get () {
    if (!this.exists()) {
      console.log('- Creating auth file...')
      return this.create()
    }

    console.log('- Loading existing auth file...')
    const file = new FileReader(this.authFile)
    return new Promise((resolve, reject) => {
      const secret = file.lines[2]
      resolve({authFile: this.authFile, secret})
    })
  }

  create () {
    const promises = [
      () => ask('2FA Secret:'),
      () => ask('VPN username:'),
      () => ask('VPN password:', '*')
    ]

    return series(promises)
      .then(([secret, username, password]) => {
        const content = `${username}\r\n${password}\r\n${secret}`
        this.write(content)
        return {authFile: this.authFile, secret}
      })
  }

  write (content) {
    return new Promise((resolve, reject) => {
      // Ensure file exists before openvpn tries to write it.
      fs.writeFile(this.authFile, content, {
        encoding: 'utf8',
        mode: '0700'
      }, onWritten)

      function onWritten (err) {
        if (err) return reject(err)
        resolve()
      }
    })
  }

  die (message) {
    console.log(message)
    process.exit()
  }
}
