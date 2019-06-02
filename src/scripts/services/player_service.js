(function() {
    'use strict';

    angular
        .module('app')
        .service('PlayerService', PlayerService);

    PlayerService.$inject = ['$q', 'PlayerModel', 'STORAGE', 'StorageService'];

    function PlayerService($q, PlayerModel, STORAGE, StorageService) {
        this.getPlayers = getPlayers;
        this.addPlayer = addPlayer;

        /**
         * @memberof app.PlayerService
         * @function getPlayers
         * @description Busca lista de objetos retorna promessa
         * @returns {promise}
         * @inner
         */
        function getPlayers() {
            let _players = StorageService.get(STORAGE.players) || []; // [{name: 'Vader', rounds: 12}, {name: 'Luke'}, {name: 'Leia', rounds: 8}];

            _players = _players.map(item => item = new PlayerModel(item)).sort((a, b) => a.rounds - b.rounds);

            return $q.resolve({
                data: _players
            });
        };

        /**
         * @memberof app.PlayerService
         * @function addPlayer
         * @description Grava objeto específico
         * @param {PlayerModel} player
         * @returns {promise}
         * @inner
         */
        function addPlayer(player) {
            let _players = undefined;

            return this.getPlayers()
                .then((res) => {
                    _players = res.data || [];

                    let _index = _players.findIndex(item => {
                        return item.name === player.name;
                    });

                    if (_index === -1) {
                        _players.push(player);
                    } else {
                        player.setRounds(_players[_index].rounds);
                        _players.splice(_index, 1, player);
                    }

                    StorageService.set(STORAGE.players, _players);

                    return $q.resolve();
                })
                .catch((err) => {
                    return err;
                })
                .finally();
        };
    }
})();
