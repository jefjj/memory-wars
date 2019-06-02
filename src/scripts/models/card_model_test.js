describe('app -> CardModel', () => {
    let _CardModel;
    let _card;

    beforeEach(module('app'));

    beforeEach(inject($injector => {
        _CardModel = $injector.get('CardModel');

        _card = {
            id: "1",
            image: "/img/card_1.jpg"
        }
    }));

    describe('instância', () => {
        it('deve ter os valores iniciais corretos', () => {
            let _c = new _CardModel();

            expect(_c.id).toBeDefined();
            expect(_c.image).toBeUndefined();
            expect(_c.visible).toBeFalsy();
            expect(_c.found).toBeFalsy();
        })

        it('deve preencher o objeto com o que é passado por parâmetro', () => {
            let _c = new _CardModel(_card);

            for (let prop in _card) {
                expect(_card[prop]).toEqual(_c[prop]);
            }
        })
    })

    describe('setVisible', () => {
        it('deve retornar true, visible = true', () => {
            let _c = new _CardModel(_card);

            _c.setVisible(true);

            expect(_c.visible).toBeTruthy();
        })

        it('deve retornar false, visible = false', () => {
            let _c = new _CardModel(_card);

            _c.setVisible(false);

            expect(_c.visible).toBeFalsy();
        })
    })

    describe('setFound', () => {
        it('deve retornar true, found = true', () => {
            let _c = new _CardModel(_card);

            _c.setFound(true);

            expect(_c.found).toBeTruthy();
        })

        it('deve retornar false, found = false', () => {
            let _c = new _CardModel(_card);

            _c.setFound(false);

            expect(_c.found).toBeFalsy();
        })
    })

    describe('isVisible', () => {
        it('deve retornar true, visible = true', () => {
            let _c = new _CardModel(_card);

            _c.setVisible(true);

            expect(_c.isVisible()).toBeTruthy();
        })

        it('deve retornar false, visible = false', () => {
            let _c = new _CardModel(_card);

            _c.setVisible(false);

            expect(_c.isVisible()).toBeFalsy();
        })
    })

    describe('setFound', () => {
        it('deve retornar true, found = true', () => {
            let _c = new _CardModel(_card);

            _c.setFound(true);

            expect(_c.isFound()).toBeTruthy();
        })

        it('deve retornar false, found = false', () => {
            let _c = new _CardModel(_card);

            _c.setFound(false);

            expect(_c.isFound()).toBeFalsy();
        })
    })
});
