describe('app -> PlayerModel', () => {
    let _PlayerModel;
    let _player;

    beforeEach(module('app'));

    beforeEach(inject($injector => {
        _PlayerModel = $injector.get('PlayerModel');

        _player = {
            name: "abc",
            rounds: 5
        }
    }));

    describe('instância', () => {
        it('deve ter os valores iniciais corretos', () => {
            let _p = new _PlayerModel();

            expect(_p.name).toBeUndefined();
            expect(_p.rounds).toBe(999);
        })

        it('deve preencher o objeto com o que é passado por parâmetro', () => {
            let _p = new _PlayerModel(_player);

            for (let prop in _player) {
                expect(_player[prop]).toEqual(_p[prop]);
            }
        })
    })

    describe('isValid', () => {
        it('deve retornar false, instância vazia', () => {
            let _p = new _PlayerModel();

            expect(_p.isValid()).toBeFalsy();
        })

        it('deve retornar false, instância sem name', () => {
            let _p = new _PlayerModel(_player);

            delete _p.name;

            expect(_p.isValid()).toBeFalsy();
        })

        it('deve retornar true, instância válida', () => {
            let _p = new _PlayerModel(_player);

            expect(_p.isValid()).toBeTruthy();
        })
    })

    describe('setRounds', () => {
        it('deve atualizar rounds, instância vazia', () => {
            let _p = new _PlayerModel();

            _p.setRounds(10);

            expect(_p.rounds).toBe(10);
        })

        it('deve atualizar rounds, quantidade atual menor que a anterior', () => {
            let _p = new _PlayerModel(_player);

            _p.setRounds(3);

            expect(_p.rounds).toBe(3);
        })

        it('não deve atualizar rounds, quantidade atual maior que a anterior', () => {
            let _p = new _PlayerModel(_player);

            _p.setRounds(7);

            expect(_p.rounds).toBe(5);
        })
    })
});
