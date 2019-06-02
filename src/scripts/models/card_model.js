(function(angular) {
    'use strict';

    angular
        .module('app')
        .factory('CardModel', CardModel);

    function CardModel() {
        class Card {
            constructor(card) {
                /**
                * @description Construtor do modelo Card
                * @memberof app
                * @constructs CardModel
                * @param {object} Card
                * @param {string} card.id identificador do card
                * @param {string} card.guid identificador único do card
                * @param {string} card.image imagem do card
                * @param {boolean} card.visible define a visibilidade do card
                * @param {boolean} card.found define se o card já foi encontrado
                */
                this.id = 0;
                this.image = undefined;
                this.visible = false;
                this.found = false;

                angular.extend(this, card);
            }

            /**
             * @memberof app.CardModel
             * @function setVisible
             * @description Atribui valor a visible
             * @returns {void}
             * @inner
             */
            setVisible(value) {
                this.visible = value;
            }

            /**
             * @memberof app.CardModel
             * @function setFound
             * @description Atribui valor a found
             * @returns {void}
             * @inner
             */
            setFound(value) {
                this.found = value;
            }

            /**
             * @memberof app.CardModel
             * @function isVisible
             * @description retorna se visible é true
             * @returns {void}
             * @inner
             */
            isVisible() {
                return !!this.visible;
            }

            /**
             * @memberof app.CardModel
             * @function isFound
             * @description retorna se found é true
             * @returns {void}
             * @inner
             */
            isFound() {
                return !!this.found;
            }
        }

        return Card;
    }
})(angular);
