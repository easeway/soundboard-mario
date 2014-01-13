// the bridge module starting Node.js service inside node-Webkit
var server = require('./server');

module.exports = function (nw) {
    var player = server(nw ? nw.gui.App.argv : process.argv.slice(2));

    return {
        script: function (callback) {
            callback(null, player.script);
        },

        play: function (chn, id, callback) {
            player.play(chn, id);
            callback && callback();
        },

        pause: function (chn, callback) {
            player.pause(chn);
            callback && callback();
        }
    };
};
