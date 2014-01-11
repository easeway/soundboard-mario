var Class = require('js-class'),
    fs    = require('fs'),
    path  = require('path'),
    yaml  = require('js-yaml'),

    MPlayer = require('./mplayer');

var Channel = Class({
    constructor: function (tracks, scriptDir) {
        this._tracks = tracks;
        this._names = {};
        for (var index in tracks) {
            this._names[tracks[index].name] = index;
        }
        this._player = new MPlayer(scriptDir);
    },

    play: function (id) {
        var track = this._tracks[typeof(id) == 'number' ? id : this._names[id]];
        if (track && track.file) {
            this._player.play(track.file, track.loop);
        } else {
            this._player.stop();
        }
    },

    pause: function () {
        this._player.pause();
    },

    stop: function () {
        this._player.stop();
    }
});

var Player = Class({
    constructor: function (scriptFile) {
        this.scriptDir = path.dirname(scriptFile);
        this.filename = path.basename(scriptFile);
        this._script = yaml.load(fs.readFileSync(scriptFile).toString());
        this._channels = {};
        Array.isArray(this._script.channels) && this._script.channels.forEach(function (chn) {
            if (Array.isArray(chn.tracks)) {
                this._channels[chn.name] = new Channel(chn.tracks, this.scriptDir);
            }
        }, this);
    },

    get script () {
        return this._script;
    },

    play: function (chn, id) {
        chn = this._channels[chn];
        chn && chn.play(id);
        return this;
    },

    pause: function (chn) {
        this._forChannels(chn, function (chn) { chn.pause(); });
        return this;
    },

    stop: function (chn) {
        this._forChannels(chn, function (chn) { chn.stop(); });
        return this;
    },

    _forChannels: function (chn, action) {
        if (chn) {
            chn = this._channels[chn];
            chn && action(chn);
        } else {
            for (var id in this._channels) {
                action(this._channels[id]);
            }
        }
    }
});

module.exports = Player;
