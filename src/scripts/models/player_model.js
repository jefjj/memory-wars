(function(angular) {
    'use strict';

    angular
        .module('app')
        .factory('PlayerModel', PlayerModel);

    function PlayerModel() {
        class Player {
            constructor(player) {
                /**
                * @description Construtor do modelo Player
                * @memberof app
                * @constructs PlayerModel
                * @param {object} Player
                * @param {string} player.name name do player
                * @param {string} player.rounds melhor classificação para o ranking
                */
                this.name = undefined;
                this.rounds = 999;

                angular.extend(this, player);
            }

            /**
             * @memberof app.PlayerModel
             * @function isValid
             * @description Verifica se instância está válida ou não
             * @returns {boolean}
             * @inner
             */
            isValid() {
                return !!this.name;
            }

            /**
             * @memberof app.PlayerModel
             * @function setRounds
             * @description Atualiza a melhor classificação
             * @returns {void}
             * @inner
             */
            setRounds(value) {
                if (this.rounds > value) {
                    this.rounds = value;
                }
            }
        }

        return Player;
    }
})(angular);
