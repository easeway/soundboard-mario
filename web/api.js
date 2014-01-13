var Api = window.nw ? (function () {
    return require('../lib/api')(window.nw);
})() : (function () {
    var ajax = function (url, appSettings, callback) {
        var settings = {
            dataType: 'json',
            error: function (xhr, textStatus, errorThrown) {
                callback && callback(new Error(textStatus + ': ' + errorThrown));
            },
            success: function (data) {
                callback && callback(null, data);
            }
        };
        for (var key in appSettings) {
            settings[key] = appSettings[key];
        }
        return $.ajax(url, settings);
    };

    return {
        script: function (callback) {
            ajax('/script', {}, callback);
        },

        play: function (chn, id, callback) {
            $.ajax('/play/' + chn + '/' + id, { type: 'POST', data: {} }, callback);
        },

        pause: function (chn, callback) {
            $.ajax('/pause/' + chn, { type: 'POST', data: {} }, callback);
        }
    };
})();
