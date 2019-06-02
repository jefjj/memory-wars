describe('app -> GuidService', function() {
    let _GuidService;

    beforeEach(module('app'));

    beforeEach(inject(function($injector) {
        _GuidService = $injector.get('GuidService');
    }));

    describe('getNewGuid', function() {
        it('deve obter o guid corretamtente', function() {
            let _g = _GuidService.getNewGuid();
            expect(_g).toBeDefined();
            expect(_g.length).toEqual(36);
        })
    })
});
