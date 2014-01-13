!function (exports) {
    "use strict";

    var TrackSchema = new DD.Schema({
        name: DD.Types.Scalar,
        text: DD.Types.Scalar,
        loop: DD.Types.Scalar,
        key: DD.Types.Scalar
    });

    var ChannelSchema = new DD.Schema({
        name: DD.Types.Scalar,
        text: DD.Types.Scalar,
        pause: DD.Types.Scalar,
        tracks: [TrackSchema]
    });

    var M = {
        channels: DD.Models.register('channels', [ChannelSchema])
    };

    var keyMaps = {};

    function mapKey(code, fn) {
        if (code == null) {
            return;
        }
        code = code.toLowerCase().charCodeAt(0);
        if (code && !keyMaps[code]) {
            keyMaps[code] = fn;
        }
    }

    $(document).ready(function () {
        $(document).keypress(function (event) {
            var code = event.charCode;
            if (code >= 65 && code <= 90) {
                // A-Z to lowercase
                code += 32;
            }
            var fn = keyMaps[code];
            fn && fn();
        });

        Api.script(function (err, script) {
            if (err) {
                return;
            }
            keyMaps = [];
            if (script && Array.isArray(script.channels)) {
                M.channels.value = script.channels;
                script.channels.forEach(function (chn) {
                    mapKey(chn.pause, function () { Api.pause(chn.name); });
                    Array.isArray(chn.tracks) && chn.tracks.forEach(function (track) {
                        mapKey(track.key, function () { Api.play(chn.name, track.name); });
                    });
                });
            } else {
                M.channels.value = [];
            }
        });
    });

    exports.G = {
        clickTrack: function (elem) {
            var track = $(elem).data('name');
            var chn = $(elem).closest('.channel').data('name');
            if (chn && track) {
                Api.play(chn, track);
            }
        },

        showLoop: function (binding, track) {
            track.loop && $(binding.element).addClass('loop');
        },

        showPause: function (binding, channel) {
            if (channel.pause) {
                $(binding.element)
                    .addClass('pause')
                    .click(function () {
                        Api.pause(channel.name);
                    });
            }
        }
    };
}(window);