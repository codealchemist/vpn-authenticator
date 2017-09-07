# vpn-authenticador

Automatically connect to your VPN using OTP, without the hassle.


## General Install

```
npm install -g vpn-authenticator
```


## OSX Install

`brew install openvpn`

 Then try opening a new shell and check if openvpn is accesible:
 `openvpn --version`

 If it's not you need to create a symlink for it, for example:
 `ln -s /usr/local/Cellar/openvpn/2.4.1/sbin/openvpn /usr/local/sbin/openvpn`

 *NOTE:* The version for openvpn might be different for you.


## Linux Install

If you're on a Debian distro try:
`sudo apt-get install openvpn`

NOTE: Old versions of openvpn doesn't work with *vpn-authenticator*.


## Pre-Setup

Download your openvpn credentials file, a .ovpn file.

Some providers will expose a web login where you can get this file.

Once you have this file you'll have everything you need to do the one time setup of *vpn-authenticator*.

You will also need your account **secret** to complete setup.

If you already configured Authy as Chrome extension to get your OTP, you can easily
find your secret following this instructions:

- Open Authy and input your password.
- Open [chrome://extensions](chrome://extensions).
- Find Authy in the extensions list.
- Click on `main.html`.
- Use the following code snippet on the console:

```
appManager.model.map((app) => console.log(`${app.getName()} => ${app.decryptedSeed}`))
```


## One Time Setup

Start *vpn-authenticator* with sudo, sudo is needed for openvpn to run.
`sudo vpn-authenticator`

The app will guide you through the rest of the setup process.
It will ask you the save the downloaded .ovpn file on your 

## Run

After the setup process you won't be asked for anything else anymore.
Just run the app and enjoy!

`sudo vpn-authenticator`

NOTE: The uso of `sudo` is required for `openvpn` client to work.
