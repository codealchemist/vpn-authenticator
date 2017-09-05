const intercept = require('intercept-stdout')
const pty = require('node-pty')
const totp = require('totp-generator')
const notifier = require('node-notifier')

function connect ({authFile, secret, ovpnFile}) {
  const args = [
    '--config', ovpnFile,
    '--auth-user-pass', authFile
  ]

  // Ensure secret doesn't have spaces nor new lines.
  secret = secret.trim()

  var ptyProcess = pty.spawn('openvpn', args, {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: process.env.HOME,
    env: process.env
  })

  ptyProcess.pipe(process.stdout)
  const unhookIntercept = intercept((line) => {
    const lineString = line.toString()

    // Inject code when asked for it.
    if (lineString.match(/Enter Google Authenticator Code/)) {
      let code = null
      try {
        code = totp(secret)
      } catch (e) {
        unhookIntercept()
        console.error(`ERROR: invalid secret: ${secret}`)
        process.exit()
      }

      ptyProcess.write(`${code}\n`)
      notify('Connecting...')
    }

    // Notify when connected successfully.
    if (lineString.match(/Initialization Sequence Completed/)) {
      unhookIntercept()
      notify('Connected successfully!')
    }
  })

  ptyProcess.on('close', (code) => {
    console.log('-'.repeat(80))
    console.log('OpenVPN has finalized, restart...')
    console.log('-'.repeat(80))

    notify('Reconnecting...')
    connect({authFile, secret, ovpnFile})
  })

  // Ensure child process dies along with parent.
  process.on('exit', (code) => {
    console.log('- Goodbye!\n')
    notify('Goodbye!')
    ptyProcess.kill('SIGKILL')
  })

  process.on('SIGINT', () => process.exit()) // catch ctrl-c
  process.on('SIGTERM', () => process.exit()) // catch kill
}

function notify (message) {
  // Display notification.
  notifier.notify({
    title: 'VPN-AUTHENTICATOR',
    message: message,
    sound: 'Funk'
  }, (error, response, metadata) => {
    if (error) {
      console.error('ERROR: Unable to display notification.', error)
      return
    }

    console.log('Notification displayed.')
  })
}

module.exports = {connect}
