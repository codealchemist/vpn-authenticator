const fs = require('fs')
const os = require('os')
const chokidar = require('chokidar')

module.exports = class OvpnSetup {
  constructor () {
    const home = os.homedir()
    this.defaultPath = `${home}/vpn-authenticator`
    this.initFolder()
    this.watcher = chokidar.watch(`${this.defaultPath}/*.ovpn`, {
      awaitWriteFinish: true
    })
  }

  initFolder () {
    if (fs.existsSync(this.defaultPath)) return
    fs.mkdirSync(this.defaultPath)
  }

  start () {
    // TODO: Avoid displaying instructions if file exists.
    console.log('OVPN SETUP:')
    console.log('Please, download your OVPN file and save it here:')
    console.log(this.defaultPath)

    return new Promise((resolve, reject) => {
      this.watcher
        .on('add', (file) => {
          this.watcher.close()
          return resolve(file)
        })
    })
  }
}
