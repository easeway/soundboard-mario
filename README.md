# ![logo](https://raw.github.com/easeway/soundboard-mario/master/web/icon.png) SoundBoard SuperMario 

This is [node-webkit](https://github.com/rogerwang/node-webkit) based sound board for SuperMario sound effects.
It also contains a built-in web server for being controlled remotely.

##Dependencies

- [node-webkit](https://github.com/rogerwang/node-webkit) (of course)
- [mplayer2](http://www.player2.org) soundboard uses `mplayer` to play sounds in the background
- [node.js](http://nodejs.org) this is needed to perform `npm install`

##Launch

- Get source code from github

```bash
git clone https://github.com/easeway/soundboard-mario
```

- Install node.js modules

```bash
npm install
```

- Launch

```bash
nw .
```

After launch, you can also control remotely by pointing a browser either from your phone, pad or another PC to http://ip-of-host-launch-soundboard:3000.

If you want to override listening port, launch like this:

```bash
PORT=3001 nw .
```

##Internals

If you take a look at the source code, you will find everything is controlled by `sounds.yml`.
It is not difficult to guess how to write the file.
You can launch this program by explicitly specifying your own `sounds.yml`:

```bash
nw . absolute-path-to-your-sounds.yml
```
