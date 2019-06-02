(function(angular) {
    'use strict';

    angular
        .module('app')
        .factory('GameModel', GameModel);

    GameModel.$inject = ['CardModel', 'CARDS_IMAGES', '_'];
    function GameModel(CardModel, CARDS_IMAGES, _) {
        class Game {
            constructor(game) {
                /**
                * @description Construtor do modelo Game
                * @memberof app
                * @constructs GameModel
                * @param {object} Game
                * @param {string} game.cards lista de cards do game
                * @param {string} game.rounds Quantidade de rounds ocorridos no game
                * @param {string} game.cardOne Primeiro card selecionado no game
                * @param {string} game.cardTwo Segundo card selecionado no game
                */
                this.cards = [];
                this.rounds = 0;
                this.cardOne = undefined;
                this.cardTwo = undefined;
                this.blocked = false;

                angular.extend(this, game);
            }

            /**
             * @memberof app.GameModel
             * @function init
             * @description Inicializa o game
             * @returns {void}
             * @inner
             */
            init() {
                this.cards = [];

                for (let index = 0; index < CARDS_IMAGES.length; index++) {
                    this.cards.push(new CardModel({
                        id: index + 1,
                        image: CARDS_IMAGES[index]
                    }));
                }

                this.cards = _.shuffle(this.cards);
            }

            /**
             * @memberof app.GameModel
             * @function increaseRound
             * @description Verifica se instância está válida ou não
             * @returns {boolean}
             * @inner
             */
            increaseRound() {
                this.rounds++;
            }

            /**
             * @memberof app.GameModel
             * @function isFinished
             * @description Verifica se instância está válida ou não
             * @returns {boolean}
             * @inner
             */
            isFinished() {
                let _pendind = this.cards.filter(item => {
                    return !item.isFound();
                });

                return _pendind.length === 0;
            }

            /**
             * @memberof app.GameModel
             * @function playCheck
             * @description Verifica se instância está válida ou não
             * @returns {boolean}
             * @inner
             */
            playCheck() {
                return !!this.cardOne && !!this.cardTwo && this.cardOne.image === this.cardTwo.image;
            }
        }

        return Game;
    }
})(angular);
