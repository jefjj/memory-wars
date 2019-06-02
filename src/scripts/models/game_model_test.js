describe('app -> GameModel', () => {
    let _GameModel;
    let _CardModel;
    let _CARDS_IMAGES;

    beforeEach(module('app'));

    beforeEach(inject($injector => {
        _GameModel = $injector.get('GameModel');
        _CardModel = $injector.get('CardModel');
        _CARDS_IMAGES = $injector.get('CARDS_IMAGES');
    }));

    describe('instância', () => {
        it('deve ter os valores iniciais corretos', () => {
            let _g = new _GameModel();

            expect(_g.cards).toEqual([]);
            expect(_g.rounds).toBe(0);
            expect(_g.cardOne).toBeUndefined();
            expect(_g.cardTwo).toBeUndefined();
            expect(_g.blocked).toBeFalsy();
        })

        it('deve preencher o objeto com o que é passado por parâmetro', () => {
            let _game = {
                rounds: 5
            };

            let _g = new _GameModel(_game);

            for (let prop in _game) {
                expect(_game[prop]).toEqual(_g[prop]);
            }
        })
    })

    describe('init', () => {
        it('deve inicializar o game corretamente', () => {
            let _g = new _GameModel();

            expect(_g.cards.length).toBe(0);

            _g.init();

            expect(_g.cards.length).toEqual(_CARDS_IMAGES.length);
        })
    })

    describe('increaseRound', () => {
        it('deve incrementar o round corretamente', () => {
            let _g = new _GameModel();

            expect(_g.rounds).toBe(0);

            _g.increaseRound();

            expect(_g.rounds).toBe(1);

            _g.increaseRound();

            expect(_g.rounds).toBe(2);
        })
    })

    describe('isFinished', () => {
        it('deve retornar false, array ainda possui cards com found = false', () => {
            let _g = new _GameModel();

            _g.init();

            for (let index = 0; index < _g.cards.length - 1; index++) {
                _g.cards[index].setFound(true);
            }

            expect(_g.isFinished()).toBeFalsy();
        })

        it('deve retornar true, todo os itens do array possuem found = true', () => {
            let _g = new _GameModel();

            _g.init();

            for (let index = 0; index < _g.cards.length; index++) {
                _g.cards[index].setFound(true);
            }

            expect(_g.isFinished()).toBeTruthy();
        })
    })

    describe('isFinished', () => {
        it('deve retornar false, cardOne não confere com cardTwo', () => {
            let _c1 = {
                image: 'images/cards/1.jpg'
            };

            let _c2 = {
                image: 'images/cards/2.jpg'
            };

            let _g = new _GameModel();

            _g.init();

            _g.cardOne = new _CardModel(_c1);
            _g.cardTwo = new _CardModel(_c2);

            expect(_g.playCheck()).toBeFalsy();
        })

        it('deve retornar true, cardOne confere com cardTwo', () => {
            let _c1 = {
                image: 'images/cards/card.jpg'
            };

            let _c2 = {
                image: 'images/cards/card.jpg'
            };

            let _g = new _GameModel();

            _g.init();

            _g.cardOne = new _CardModel(_c1);
            _g.cardTwo = new _CardModel(_c2);

            expect(_g.playCheck()).toBeTruthy();
        })
    })
});
