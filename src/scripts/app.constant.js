(function(angular) {
    'use strict';

    angular
        .module('app')
        .constant('STEP', {
            identify: 1,
            play: 2,
            finished: 3
        })
        .constant('GAME', {
            timeToSeeCards: 1250,
            timeToClearCards: 250
        })
        .constant('STORAGE', {
            players: 'jc.app.storage.players',
            lastPlayer: 'jc.app.storage.last_player'
        })
        .constant('CARDS_IMAGES', [
            'images/cards/darth-vader.jpg',
            'images/cards/luke.jpg',
            'images/cards/jabba.jpg',
            'images/cards/han-solo.jpg',
            'images/cards/yoda.jpg',
            'images/cards/darth-sidious.jpg',
            'images/cards/rd2d.jpg',
            'images/cards/c3po.jpg',
            'images/cards/chewbaca.jpg',
            'images/cards/boba-fett.jpg',
            'images/cards/leia.jpg',
            'images/cards/ewok.jpg',
            'images/cards/darth-vader.jpg',
            'images/cards/luke.jpg',
            'images/cards/jabba.jpg',
            'images/cards/han-solo.jpg',
            'images/cards/yoda.jpg',
            'images/cards/darth-sidious.jpg',
            'images/cards/rd2d.jpg',
            'images/cards/c3po.jpg',
            'images/cards/chewbaca.jpg',
            'images/cards/boba-fett.jpg',
            'images/cards/leia.jpg',
            'images/cards/ewok.jpg'
        ])
        /* .constant('CARDS_IMAGES', [
            'images/cards/darth-vader.jpg',
            'images/cards/luke.jpg',
            'images/cards/jabba.jpg',
            'images/cards/darth-vader.jpg',
            'images/cards/luke.jpg',
            'images/cards/jabba.jpg'
        ]) */
        .constant('_', _);
})(angular);
