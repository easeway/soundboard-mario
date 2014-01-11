var Class = require('js-class'),
    spawn = require('child_process').spawn;

var MPlayer = Class(process.EventEmitter, {
    constructor: function (scriptDir) {
        this._scriptDir = scriptDir;
        this._cmdQueue = [];
        this._start();
    },

    play: function (file, loop) {
        this.sendCmd(['loadfile', file, 0]);
        this.sendCmd(['loop', loop ? 0 : -1]);
        return this;
    },

    stop: function () {
        this.sendCmd('stop');
    },

    pause: function () {
        this.sendCmd('pause');
    },

    shutdown: function () {
        this._exit = true;
        this._cmdPipe.end();
        this._mplayer.kill();
    },

    sendCmd: function (cmd) {
        Array.isArray(cmd) && (cmd = cmd.join(' '));
        this._cmdQueue.push(cmd + "\n");
        this._cmdFlush();
    },

    _cmdFlush: function () {
        while (!this._busy && this._cmdQueue.length > 0) {
            var cmd = this._cmdQueue.shift();
            if (!this._cmdPipe.write(cmd)) {
                this._busy = true;
            }
        }
    },

    _cmdDrain: function () {
        delete this._busy;
        this._cmdFlush();
    },

    _playerExit: function () {
        this._cmdPipe && this._cmdPipe.removeAllListeners();
        delete this._mplayer;
        delete this._cmdPipe;
        if (!this._exit) {
            this._start();
        }
    },

    _start: function () {
        this._mplayer = spawn('mplayer', [
                '-slave',
                '-noconfig', 'all',
                '-input', 'nodefault-bindings:conf=/dev/null',
                '-idle',
                '-quiet'
            ], {
            cwd: this._scriptDir,
            env: process.env,
            stdio: ['pipe', 'ignore', 'ignore']
        });
        (this._cmdPipe = this._mplayer.stdin)
            .on('drain', this._cmdDrain.bind(this))
            .on('exit', this._playerExit.bind(this));
        this._cmdFlush();
    }
});

module.exports = MPlayer;
