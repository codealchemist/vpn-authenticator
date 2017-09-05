#!/usr/bin/env node
const fs = require('fs')
const {resolve} = require('path')
const printii = require('printii')(__dirname)
const openVpn = require('./modules/open-vpn/index')
const AuthFileGenerator = require('./modules/open-vpn/auth-file-generator')
const OvpnSetup = require('./modules/open-vpn/ovpn-setup')

// Print ascii art.
printii()

function authSetup (ovpnFile) {
  // Ensure we have an auth file, required for VPN client to connect.
  // Then start connection.
  const authFile = resolve(__dirname, '.auth')
  const authFileGenerator = new AuthFileGenerator(authFile)
  authFileGenerator
    .get()
    .then(
      // Success.
      (data) => {
        data.ovpnFile = ovpnFile
        openVpn.connect(data)
      },

      // Error.
      (err) => {
        console.error('ERROR: ', err)
        process.exit()
      }
    )
}

try {
  const ovpnSetup = new OvpnSetup()
  ovpnSetup
   .start()
   .then((ovpnFile) => {
     authSetup(ovpnFile)
   })
} catch (e) {
  console.error(e.message || e)
  if (e.stack) {
    console.error(e.stack)
  }
}
