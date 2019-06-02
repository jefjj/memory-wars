;(function(angular) {
    'use strict';

    angular
        .module('app')
        .controller('GameController', GameController);

    GameController.$inject = ['$log', '$timeout', 'STEP', 'GAME', 'PlayerModel', 'GameModel', 'PlayerService'];
    function GameController($log, $timeout, STEP, GAME, PlayerModel, GameModel, PlayerService) {
        const vm = this;
        vm.STEP = STEP;
        vm.activeStep = undefined;
        vm.player = undefined;
        vm.game = undefined;
        vm.ranking = undefined;
        vm.loginError = undefined;

        activate();

        function activate() {
            PlayerService.getPlayers()
                .then(res => {
                    vm.ranking = res.data;

                    vm.activeStep = vm.STEP.identify;
                    vm.player = new PlayerModel();
                    vm.game = new GameModel();
                    vm.loginError = undefined;
                })
                .catch((err) => $log.error(err))
                .finally();
        }

        vm.isStep = step => vm.activeStep === step;

        vm.nextStep = () => {
            switch (vm.activeStep) {
                case vm.STEP.identify:
                    vm._playExec();
                    break;
                case vm.STEP.play:
                    vm._finishedExec();
                    break;
            }
        };

        vm.selectCard = card => {
            if (!!vm.game.blocked || card.isFound()) {
                return;
            }

            if (!!vm.game.cardOne) {
                if (vm.game.cardOne.id === card.id) {
                    return;
                }

                vm.game.cardTwo = card;
                vm.game.cardTwo.setVisible(true);

                vm._checkPlay();
            } else {
                vm.game.cardOne = card;
                vm.game.cardOne.setVisible(true);
            }
        };

        vm.restart = () => activate();

        vm.playAgain = () => {
            vm.activeStep = vm.STEP.play;
            vm.game = new GameModel();

            vm.game.init();
        };

        vm._checkPlay = () => {
            vm.game.blocked = true;

            vm.game.increaseRound();
            if (vm.game.playCheck()) {
                vm.game.cardOne.setFound(true);
                vm.game.cardTwo.setFound(true);

                if (vm._allCardsAreFound()) {
                    vm.nextStep();
                }

                $timeout(() => {
                    vm._clearCards();
                }, GAME.timeToClearCards);
            } else {
                $timeout(() => {
                    if (!!vm.game.cardOne) {
                        vm.game.cardOne.setVisible(false);
                    }

                    if (!!vm.game.cardTwo) {
                        vm.game.cardTwo.setVisible(false);
                    }

                    vm._clearCards();
                }, GAME.timeToSeeCards);
            }
        };

        vm._playExec = () => {
            if (!!vm.player.isValid()) {
                vm.activeStep = vm.STEP.play;
                vm.loginError = undefined;
                vm.game.init();
            } else {
                vm.loginError = "Digite seu nome para começar";
            }
        };

        vm._finishedExec = () => {
            vm.player.setRounds(vm.game.rounds);

            PlayerService.addPlayer(vm.player)
                .then(() => {
                    vm.activeStep = vm.STEP.finished;
                })
                .catch((err) => $log.error(err))
                .finally();
        };

        vm._allCardsAreFound = () => {
            let _index = vm.game.cards.findIndex(card => {
                return !card.isFound();
            });

            return _index === -1 ? true : false;
        };

        vm._clearCards = () => {
            vm.game.cardOne = undefined;
            vm.game.cardTwo = undefined;

            vm.game.blocked = false;
        };
    }
})(angular);
