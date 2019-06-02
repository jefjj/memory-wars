describe('app -> PlayerService', function() {
    let _q, _rootScope, _PlayerModel, _PlayerService, _StorageService, _STORAGE;

    beforeEach(module('app'));

    beforeEach(inject(function($injector) {
        _rootScope = $injector.get('$rootScope');
        _q = $injector.get('$q');
        _PlayerModel = $injector.get('PlayerModel');
        _PlayerService = $injector.get('PlayerService');
        _StorageService = $injector.get('StorageService');
        _STORAGE = $injector.get('STORAGE');
    }));

    describe('getPlayers', function() {
        it('deve tentar obter a listagem de players corretamente', function() {
            let _list = [];
            _list.push(new _PlayerModel({
                name: 'abc',
                rounds: 10
            }));

            spyOn(_StorageService, 'get').and.callFake(() => {
                return _list;
            });
            spyOn(_q, 'resolve').and.callFake(angular.noop);

            _PlayerService.getPlayers();

            expect(_StorageService.get).toHaveBeenCalledWith(_STORAGE.players);

            _rootScope.$digest();

            expect(_q.resolve).toHaveBeenCalledWith({data: _list});
        })
    })

    describe('addPlayer', function() {
        it('deve tentar salvar um player corretamente - mas retorna erro', function() {
            let _msg = {
                mensagem: 'abc'
            };

            spyOn(_PlayerService, 'getPlayers').and.callFake(() => {
                return _q.reject(_msg);
            });
            spyOn(_StorageService, 'set').and.callFake(angular.noop);
            spyOn(_q, 'reject').and.callThrough();
            
            let _player = {
                name: 'abc',
                rounds: 10
            };
            
            _PlayerService.addPlayer(_player);
            
            _rootScope.$digest();
            
            expect(_PlayerService.getPlayers).toHaveBeenCalled();
            expect(_q.reject).toHaveBeenCalledWith(_msg);
            expect(_StorageService.set).not.toHaveBeenCalled();
        })

        it('deve tentar salvar um player corretamente', function() {
            spyOn(_PlayerService, 'getPlayers').and.callFake(() => {
                return _q.resolve({
                    data: []
                });
            });
            spyOn(_StorageService, 'set').and.callFake(angular.noop);

            let _player = {
                name: 'abc',
                rounds: 10
            };

            let _list = [];
            _list.push(_player);

            _PlayerService.addPlayer(_player);

            _rootScope.$digest();

            expect(_PlayerService.getPlayers).toHaveBeenCalled();
            expect(_StorageService.set).toHaveBeenCalledWith(_STORAGE.players, _list);
        })
    })
});
