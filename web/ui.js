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
        tracks: [TrackSchema]
    });

    var M = {
        channels: DD.Models.register('channels', [ChannelSchema])
    };

    var keyMaps = {};

    $(document).ready(function () {
        $(document).keypress(function (event) {
            var code = event.charCode;
            if (code >= 65 && code <= 90) {
                // A-Z to lowercase
                code += 32;
            }
            var clip = keyMaps[code];
            clip && Api.play(clip.c, clip.t);
        });

        Api.script(function (err, script) {
            if (err) {
                return;
            }
            keyMaps = [];
            if (script && Array.isArray(script.channels)) {
                M.channels.value = script.channels;
                script.channels.forEach(function (chn) {
                    Array.isArray(chn.tracks) && chn.tracks.forEach(function (track) {
                        if (track.key != null) {
                            var ch = track.key.toString()[0];
                            if (ch != null) {
                                var code = ch.toLowerCase().charCodeAt(0);
                                keyMaps[code] = keyMaps[code] || { c: chn.name, t: track.name };
                            }
                        }
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
        }
    };
}(window);