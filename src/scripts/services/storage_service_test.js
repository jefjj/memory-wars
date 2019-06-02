describe('app -> StorageService', function() {
    let _StorageService;

    beforeEach(module('app'));

    beforeEach(inject(function($injector) {
        _StorageService = $injector.get('StorageService');
    }));

    describe('exists', function() {
        it('deve retornar false, key não existe', function() {
            let _key = 'abc';
            
            expect(_StorageService.exists(_key)).toBeFalsy();
        })

        it('deve retornar true, key não existe', function() {
            let _key = 'abc';

            _StorageService.set(_key, "abc");
            
            expect(_StorageService.exists(_key)).toBeTruthy();

            _StorageService.remove(_key);
        })
    })

    describe('get', function() {
        it('deve retornar null, key não existe', function() {
            let _key = 'abc';
            
            expect(_StorageService.get(_key)).toBe(null);
        })

        it('deve retornar valor, key existe', function() {
            let _key = 'abc';

            _StorageService.set(_key, "abc");
            
            expect(_StorageService.get(_key)).toBe("abc");
            
            _StorageService.remove(_key);
        })
    })

    describe('set', function() {
        it('deve salvar key corretamente', function() {
            let _key = 'abc';

            spyOn(_StorageService, 'remove').and.callThrough();

            _StorageService.set(_key, "abc");

            expect(_StorageService.get(_key)).toBe("abc");

            _StorageService.set(_key, "abc");

            expect(_StorageService.remove).toHaveBeenCalledWith(_key);

            _StorageService.remove(_key);

        })
    })

    describe('remove', function() {
        it('deve retornar false, key inexistente', function() {
            let _key = 'abc';

            expect(_StorageService.remove(_key)).toBeFalsy();
        })

        it('deve retornar true, remove key corretamente', function() {
            let _key = 'abc';

            _StorageService.set(_key, "abc");

            expect(_StorageService.get(_key)).toBe("abc");

            expect(_StorageService.remove(_key)).toBeTruthy();

            expect(_StorageService.get(_key)).toBe(null);
        })
    })

    describe('getLength', function() {
        it('deve obter o tamanho do storage corretamente', function() {
            _StorageService.clear();

            _StorageService.set('a', "abc");

            expect(_StorageService.getLength()).toBe(1);

            _StorageService.set('b', "abc");

            expect(_StorageService.getLength()).toBe(2);

            _StorageService.set('c', "abc");

            expect(_StorageService.getLength()).toBe(3);
        })
    })

    describe('clear', function() {
        it('deve limpar todas as keys corretamente', function() {
            _StorageService.set('a', "abc");
            _StorageService.set('b', "def");
            _StorageService.set('c', "ghi");

            expect(_StorageService.get('a')).toBe("abc");
            expect(_StorageService.get('b')).toBe("def");
            expect(_StorageService.get('c')).toBe("ghi");

            _StorageService.clear();

            expect(_StorageService.exists('a')).toBeFalsy();
            expect(_StorageService.exists('b')).toBeFalsy();
            expect(_StorageService.exists('c')).toBeFalsy();
        })
    })

    describe('_isJson', function() {
        it('deve retornar false, não é json', function() {
            expect(_StorageService._isJson("abc")).toBeFalsy();
        })

        it('deve retornar true, é json', function() {
            expect(_StorageService._isJson('{"abc":"def"}')).toBeTruthy();
        })
    })
});
