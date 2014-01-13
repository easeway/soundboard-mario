var path = require('path'),
    express = require('express'),
    Player = require('./player');

module.exports = function (argv) {
    var scriptFile = argv[0];
    scriptFile || (scriptFile = path.join(process.cwd(), 'sounds.yml'));
    var player = new Player(scriptFile);

    var app = express();

    app.configure(function () {
        app.use(express.static(path.join(__dirname, '..', 'web')));
        app.use(express.bodyParser());
        app.use(app.router);
    });

    app.get('/script', function (req, res) {
        res.send(player.script);
    });

    app.post('/play/:chn/:id', function (req, res) {
        player.play(req.params.chn, req.params.id);
        res.send(204);
    });

    app.post('/pause/:chn', function (req, res) {
        player.play(req.params.chn);
        res.send(204);
    });

    app.listen(process.env.PORT || 3000);

    return player;
};
