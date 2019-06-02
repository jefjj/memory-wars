describe('GameController', () => {
    const NOME_CONTROLLER = 'GameController as gameCtrl';
    let _rootScope, _q, _timeoutMock, _scope, _log, _PlayerModel, _CardModel, _GameModel, _PlayerService, _STEP, _GAME;

    beforeEach(() => {
        module('app');
    });

    beforeEach(inject(($injector) => {
        _rootScope = $injector.get('$rootScope');
        _scope = _rootScope.$new();
        _q = $injector.get('$q');
        _timeoutMock = $injector.get('$timeout');
        _log = $injector.get('$log');
        _PlayerService = $injector.get('PlayerService');
        _PlayerModel = $injector.get('PlayerModel');
        _CardModel = $injector.get('CardModel');
        _GameModel = $injector.get('GameModel');
        _STEP = $injector.get('STEP');
        _GAME = $injector.get('GAME');
    }));

    describe('init', () => {
        it('deve ter sido iniciada com erro - getPlayers reject', inject($controller => {
            let _msg = {
                mensagem: "abc"
            }
            
            spyOn(_PlayerService, 'getPlayers').and.callFake(() => {
                return _q.reject(_msg);
            });

            spyOn(_log, 'error').and.callFake(angular.noop);

            $controller(NOME_CONTROLLER, { $scope: _scope });

            _rootScope.$digest();

            expect(_log.error).toHaveBeenCalledWith(_msg);
        }));

        it('deve ter sido iniciada corretamente', inject($controller => {
            let _list = [];
            _list.push(new _PlayerModel({
                name: 'abc',
                rounds: 10
            }));
            
            spyOn(_PlayerService, 'getPlayers').and.callFake(() => {
                return _q.resolve({
                    data: _list
                });
            });

            $controller(NOME_CONTROLLER, { $scope: _scope });

            _rootScope.$digest();

            expect(_scope.gameCtrl.ranking).toEqual(_list);
            expect(_scope.gameCtrl.activeStep).toBe(_STEP.identify);
            expect(_scope.gameCtrl.player instanceof _PlayerModel).toBe(true);
            expect(_scope.gameCtrl.game instanceof _GameModel).toBe(true);
            expect(_scope.gameCtrl.loginError).toBeUndefined();
        }));
    });

    describe('isStep', () => {
        it('deve retornar false - não coincide', inject($controller => {
            $controller(NOME_CONTROLLER, { $scope: _scope });

            _scope.gameCtrl.activeStep = _STEP.play;

            expect(_scope.gameCtrl.isStep(_STEP.identify)).toBeFalsy;
        }));
    });

    describe('nextStep ', () => {
        it('deve executar _playExec - activeStep = identify', inject($controller => {
            $controller(NOME_CONTROLLER, { $scope: _scope });

            spyOn(_scope.gameCtrl, '_playExec').and.callFake(angular.noop);

            _scope.gameCtrl.activeStep = _STEP.identify;
            _scope.gameCtrl.nextStep();

            expect(_scope.gameCtrl._playExec).toHaveBeenCalled();
        }));

        it('deve executar _finishedExec - activeStep = play', inject($controller => {
            $controller(NOME_CONTROLLER, { $scope: _scope });

            spyOn(_scope.gameCtrl, '_finishedExec').and.callFake(angular.noop);

            _scope.gameCtrl.activeStep = _STEP.play;
            _scope.gameCtrl.nextStep();

            expect(_scope.gameCtrl._finishedExec).toHaveBeenCalled();
        }));
    });

    describe('selectCard', () => {
        it('não deve selecionar card - game.blocked = true', inject($controller => {
            let _list = [];
            
            let _card = new _CardModel({
                id: 1,
                image: "abc"
            });

            _list.push(new _PlayerModel({
                name: 'abc',
                rounds: 10
            }));

            spyOn(_PlayerService, 'getPlayers').and.callFake(() => {
                return _q.resolve({
                    data: _list
                });
            });

            $controller(NOME_CONTROLLER, { $scope: _scope });

            spyOn(_scope.gameCtrl, '_checkPlay').and.callFake(angular.noop);

            _rootScope.$digest();

            _scope.gameCtrl.game.blocked = true;

            _scope.gameCtrl.selectCard(_card);

            expect(_scope.gameCtrl.game.cardOne).toBeUndefined();
            expect(_scope.gameCtrl.game.cardTwo).toBeUndefined();
            expect(_scope.gameCtrl._checkPlay).not.toHaveBeenCalled();
        }));

        it('não deve selecionar card - card.found = true', inject($controller => {
            let _list = [];
            
            let _card = new _CardModel({
                id: 1,
                image: "abc",
                found: true
            });

            _list.push(new _PlayerModel({
                name: 'abc',
                rounds: 10
            }));

            spyOn(_PlayerService, 'getPlayers').and.callFake(() => {
                return _q.resolve({
                    data: _list
                });
            });

            $controller(NOME_CONTROLLER, { $scope: _scope });

            spyOn(_scope.gameCtrl, '_checkPlay').and.callFake(angular.noop);

            _rootScope.$digest();

            _scope.gameCtrl.selectCard(_card);

            expect(_scope.gameCtrl.game.cardOne).toBeUndefined();
            expect(_scope.gameCtrl.game.cardTwo).toBeUndefined();
            expect(_scope.gameCtrl._checkPlay).not.toHaveBeenCalled();
        }));

        it('não deve selecionar card - card.id já selecionado', inject($controller => {
            let _list = [];
            
            let _card = new _CardModel({
                id: 1,
                image: "abc"
            });

            _list.push(new _PlayerModel({
                name: 'abc',
                rounds: 10
            }));

            spyOn(_PlayerService, 'getPlayers').and.callFake(() => {
                return _q.resolve({
                    data: _list
                });
            });

            $controller(NOME_CONTROLLER, { $scope: _scope });

            spyOn(_scope.gameCtrl, '_checkPlay').and.callFake(angular.noop);

            _rootScope.$digest();

            _scope.gameCtrl.game.cardOne = _card;

            _scope.gameCtrl.selectCard(_card);

            expect(_scope.gameCtrl.game.cardOne).toBeDefined();
            expect(_scope.gameCtrl.game.cardTwo).toBeUndefined();
            expect(_scope.gameCtrl._checkPlay).not.toHaveBeenCalled();
        }));

        it('deve selecionar card - nenhum card ainda selecionado', inject($controller => {
            let _list = [];
            
            let _card = new _CardModel({
                id: 1,
                image: "abc"
            });

            _list.push(new _PlayerModel({
                name: 'abc',
                rounds: 10
            }));

            spyOn(_PlayerService, 'getPlayers').and.callFake(() => {
                return _q.resolve({
                    data: _list
                });
            });

            $controller(NOME_CONTROLLER, { $scope: _scope });

            spyOn(_scope.gameCtrl, '_checkPlay').and.callFake(angular.noop);

            _rootScope.$digest();

            _scope.gameCtrl.selectCard(_card);

            expect(_scope.gameCtrl.game.cardOne).toBeDefined();
            expect(_scope.gameCtrl.game.cardOne.name).toBe(_card.name);
            expect(_scope.gameCtrl.game.cardOne.isVisible()).toBe(true);
            expect(_scope.gameCtrl.game.cardTwo).toBeUndefined();
            expect(_scope.gameCtrl._checkPlay).not.toHaveBeenCalled();
        }));

        it('deve selecionar card - cardOne já selecionado', inject($controller => {
            let _list = [];
            
            let _card = new _CardModel({
                id: 1,
                image: "abc",
                visible: true
            });

            let _cardTwo = new _CardModel({
                id: 2,
                image: "def"
            });

            _list.push(new _PlayerModel({
                name: 'abc',
                rounds: 10
            }));

            spyOn(_PlayerService, 'getPlayers').and.callFake(() => {
                return _q.resolve({
                    data: _list
                });
            });

            $controller(NOME_CONTROLLER, { $scope: _scope });

            spyOn(_scope.gameCtrl, '_checkPlay').and.callFake(angular.noop);

            _rootScope.$digest();

            _scope.gameCtrl.game.cardOne = _card;

            _scope.gameCtrl.selectCard(_cardTwo);

            expect(_scope.gameCtrl.game.cardOne).toBeDefined();
            expect(_scope.gameCtrl.game.cardOne.name).toBe(_card.name);
            expect(_scope.gameCtrl.game.cardOne.isVisible()).toBe(true);
            expect(_scope.gameCtrl.game.cardTwo).toBeDefined();
            expect(_scope.gameCtrl.game.cardTwo.name).toBe(_cardTwo.name);
            expect(_scope.gameCtrl.game.cardTwo.isVisible()).toBe(true);
            expect(_scope.gameCtrl._checkPlay).toHaveBeenCalled();
        }));
    });

    describe('restart ', () => {
        it('deve reiniciar corretamente', inject($controller => {
            let _list = [];
            _list.push(new _PlayerModel({
                name: 'abc',
                rounds: 10
            }));
            
            spyOn(_PlayerService, 'getPlayers').and.callFake(() => {
                return _q.resolve({
                    data: _list
                });
            });

            $controller(NOME_CONTROLLER, { $scope: _scope });

            _rootScope.$digest();

            expect(_scope.gameCtrl.ranking).toEqual(_list);
            expect(_scope.gameCtrl.player instanceof _PlayerModel).toBe(true);
            expect(_scope.gameCtrl.game instanceof _GameModel).toBe(true);
            expect(_scope.gameCtrl.loginError).toBeUndefined();

            _scope.gameCtrl.player = undefined;
            _scope.gameCtrl.game = undefined;
            _scope.gameCtrl.loginError = "abc";

            _scope.gameCtrl.restart();

            _rootScope.$digest();

            expect(_scope.gameCtrl.ranking).toEqual(_list);
            expect(_scope.gameCtrl.player instanceof _PlayerModel).toBe(true);
            expect(_scope.gameCtrl.game instanceof _GameModel).toBe(true);
            expect(_scope.gameCtrl.loginError).toBeUndefined();
        }));
    });

    describe('playAgain', () => {
        it('deve iniciar um novo jogo corretamente', inject($controller => {
            let _list = [];
            _list.push(new _PlayerModel({
                name: 'abc',
                rounds: 10
            }));
            
            spyOn(_PlayerService, 'getPlayers').and.callFake(() => {
                return _q.resolve({
                    data: _list
                });
            });

            $controller(NOME_CONTROLLER, { $scope: _scope });

            _rootScope.$digest();

            expect(_scope.gameCtrl.ranking).toEqual(_list);
            expect(_scope.gameCtrl.player instanceof _PlayerModel).toBe(true);
            expect(_scope.gameCtrl.game instanceof _GameModel).toBe(true);
            expect(_scope.gameCtrl.loginError).toBeUndefined();

            _scope.gameCtrl.activeStep = _STEP.finished;
            _scope.gameCtrl.player.name = "abc";
            _scope.gameCtrl.game.rounds = 10;

            _scope.gameCtrl.playAgain();

            _rootScope.$digest();

            expect(_scope.gameCtrl.activeStep).toBe(_STEP.play);
            expect(_scope.gameCtrl.player.name).toBe("abc");
            expect(_scope.gameCtrl.game.rounds).toBe(0);
        }));
    });

    describe('_checkPlay', () => {
        it('jogada inválida - cards imagem não coincidem - apenas um card selecionado', inject($controller => {
            let _list = [];
            let _cards = [];

            let _card = new _CardModel({
                id: 1,
                image: "abc",
            });

            let _cardTwo = new _CardModel({
                id: 2,
                image: "def"
            });

            let _cardTree = new _CardModel({
                id: 3,
                image: "abc",
            });

            let _cardFour = new _CardModel({
                id: 4,
                image: "def"
            });

            _cards.push(_card);
            _cards.push(_cardTwo);
            _cards.push(_cardTree);
            _cards.push(_cardFour);

            _list.push(new _PlayerModel({
                name: 'abc',
                rounds: 10
            }));
            
            spyOn(_PlayerService, 'getPlayers').and.callFake(() => {
                return _q.resolve({
                    data: _list
                });
            });

            $controller(NOME_CONTROLLER, { $scope: _scope });

            spyOn(_scope.gameCtrl, '_clearCards').and.callFake(angular.noop);

            _rootScope.$digest();

            _scope.gameCtrl.game.cards = _cards;
            
            _scope.gameCtrl.game.cardOne = _cards[0];
            _scope.gameCtrl.game.cardOne.visible = true;
            
            expect(_scope.gameCtrl.game.blocked).toBe(false);
            expect(_scope.gameCtrl.game.cardOne.isVisible()).toBe(true);
            expect(_scope.gameCtrl.game.cardTwo).toBeUndefined();

            _scope.gameCtrl._checkPlay();

            expect(_scope.gameCtrl.game.blocked).toBe(true);
            expect(_scope.gameCtrl.game.rounds).toBe(1);

            _timeoutMock.flush(_GAME.timeToSeeCards);

            expect(_scope.gameCtrl.game.cardOne.isVisible()).toBe(false);
            expect(_scope.gameCtrl.game.cardTwo).toBeUndefined();
            expect(_scope.gameCtrl._clearCards).toHaveBeenCalled();
        }));

        it('jogada inválida - cards imagem não coincidem - dois cards selecionados', inject($controller => {
            let _list = [];
            let _cards = [];

            let _card = new _CardModel({
                id: 1,
                image: "abc",
            });

            let _cardTwo = new _CardModel({
                id: 2,
                image: "def"
            });

            let _cardTree = new _CardModel({
                id: 3,
                image: "abc",
            });

            let _cardFour = new _CardModel({
                id: 4,
                image: "def"
            });

            _cards.push(_card);
            _cards.push(_cardTwo);
            _cards.push(_cardTree);
            _cards.push(_cardFour);

            _list.push(new _PlayerModel({
                name: 'abc',
                rounds: 10
            }));
            
            spyOn(_PlayerService, 'getPlayers').and.callFake(() => {
                return _q.resolve({
                    data: _list
                });
            });

            $controller(NOME_CONTROLLER, { $scope: _scope });

            spyOn(_scope.gameCtrl, '_clearCards').and.callFake(angular.noop);

            _rootScope.$digest();

            _scope.gameCtrl.game.cards = _cards;
            _scope.gameCtrl.game.rounds = 1;

            _scope.gameCtrl.game.cardOne = _cards[0];
            _scope.gameCtrl.game.cardOne.visible = true;

            _scope.gameCtrl.game.cardTwo = _cards[1];
            _scope.gameCtrl.game.cardTwo.visible = true;
            
            expect(_scope.gameCtrl.game.blocked).toBe(false);
            expect(_scope.gameCtrl.game.cardOne.isVisible()).toBe(true);
            expect(_scope.gameCtrl.game.cardTwo.isVisible()).toBe(true);

            _scope.gameCtrl._checkPlay();

            expect(_scope.gameCtrl.game.blocked).toBe(true);
            expect(_scope.gameCtrl.game.rounds).toBe(2);

            _timeoutMock.flush(_GAME.timeToSeeCards);

            expect(_scope.gameCtrl.game.cardOne.isVisible()).toBe(false);
            expect(_scope.gameCtrl.game.cardTwo.isVisible()).toBe(false);
            expect(_scope.gameCtrl._clearCards).toHaveBeenCalled();
        }));

        it('jogada válida - os dois cards.imagem coincidem - game não finalizado', inject($controller => {
            let _list = [];
            let _cards = [];

            let _card = new _CardModel({
                id: 1,
                image: "abc",
            });

            let _cardTwo = new _CardModel({
                id: 2,
                image: "def"
            });

            let _cardTree = new _CardModel({
                id: 3,
                image: "abc",
            });

            let _cardFour = new _CardModel({
                id: 4,
                image: "def"
            });

            _cards.push(_card);
            _cards.push(_cardTwo);
            _cards.push(_cardTree);
            _cards.push(_cardFour);

            _list.push(new _PlayerModel({
                name: 'abc',
                rounds: 10
            }));
            
            spyOn(_PlayerService, 'getPlayers').and.callFake(() => {
                return _q.resolve({
                    data: _list
                });
            });

            $controller(NOME_CONTROLLER, { $scope: _scope });

            spyOn(_scope.gameCtrl, '_clearCards').and.callFake(angular.noop);
            spyOn(_scope.gameCtrl, 'nextStep').and.callFake(angular.noop);

            _rootScope.$digest();

            _scope.gameCtrl.game.cards = _cards;
            _scope.gameCtrl.game.rounds = 1;

            _scope.gameCtrl.game.cardOne = _cards[0];
            _scope.gameCtrl.game.cardOne.visible = true;

            _scope.gameCtrl.game.cardTwo = _cards[2];
            _scope.gameCtrl.game.cardTwo.visible = true;
            
            expect(_scope.gameCtrl.game.blocked).toBe(false);
            expect(_scope.gameCtrl.game.cardOne.isFound()).toBe(false);
            expect(_scope.gameCtrl.game.cardTwo.isFound()).toBe(false);

            _scope.gameCtrl._checkPlay();

            expect(_scope.gameCtrl.game.blocked).toBe(true);
            expect(_scope.gameCtrl.game.rounds).toBe(2);
            expect(_scope.gameCtrl.game.cardOne.isFound()).toBe(true);
            expect(_scope.gameCtrl.game.cardTwo.isFound()).toBe(true);

            expect(_scope.gameCtrl.nextStep).not.toHaveBeenCalled();

            _timeoutMock.flush(_GAME.timeToSeeCards);

            expect(_scope.gameCtrl._clearCards).toHaveBeenCalled();
        }));

        it('jogada válida - os dois cards.imagem coincidem - game finalizado', inject($controller => {
            let _list = [];
            let _cards = [];

            let _card = new _CardModel({
                id: 1,
                image: "abc",
            });

            let _cardTwo = new _CardModel({
                id: 2,
                image: "def",
                found: true
            });

            let _cardTree = new _CardModel({
                id: 3,
                image: "abc",
            });

            let _cardFour = new _CardModel({
                id: 4,
                image: "def",
                found: true
            });

            _cards.push(_card);
            _cards.push(_cardTwo);
            _cards.push(_cardTree);
            _cards.push(_cardFour);

            _list.push(new _PlayerModel({
                name: 'abc',
                rounds: 10
            }));
            
            spyOn(_PlayerService, 'getPlayers').and.callFake(() => {
                return _q.resolve({
                    data: _list
                });
            });

            $controller(NOME_CONTROLLER, { $scope: _scope });

            spyOn(_scope.gameCtrl, '_clearCards').and.callFake(angular.noop);
            spyOn(_scope.gameCtrl, 'nextStep').and.callFake(angular.noop);

            _rootScope.$digest();

            _scope.gameCtrl.game.cards = _cards;
            _scope.gameCtrl.game.rounds = 1;

            _scope.gameCtrl.game.cardOne = _cards[0];
            _scope.gameCtrl.game.cardOne.visible = true;

            _scope.gameCtrl.game.cardTwo = _cards[2];
            _scope.gameCtrl.game.cardTwo.visible = true;
            
            expect(_scope.gameCtrl.game.blocked).toBe(false);
            expect(_scope.gameCtrl.game.cardOne.isFound()).toBe(false);
            expect(_scope.gameCtrl.game.cardTwo.isFound()).toBe(false);

            _scope.gameCtrl._checkPlay();

            expect(_scope.gameCtrl.game.blocked).toBe(true);
            expect(_scope.gameCtrl.game.rounds).toBe(2);
            expect(_scope.gameCtrl.game.cardOne.isFound()).toBe(true);
            expect(_scope.gameCtrl.game.cardTwo.isFound()).toBe(true);

            expect(_scope.gameCtrl.nextStep).toHaveBeenCalled();

            _timeoutMock.flush(_GAME.timeToSeeCards);

            expect(_scope.gameCtrl._clearCards).toHaveBeenCalled();
        }));
    });

    describe('_playExec', () => {
        it('não deve executar - player inválido', inject($controller => {
            let _list = [];
            _list.push(new _PlayerModel({
                name: 'abc',
                rounds: 10
            }));
            
            spyOn(_PlayerService, 'getPlayers').and.callFake(() => {
                return _q.resolve({
                    data: _list
                });
            });

            $controller(NOME_CONTROLLER, { $scope: _scope });

            _rootScope.$digest();
            
            expect(_scope.gameCtrl.ranking).toEqual(_list);
            expect(_scope.gameCtrl.player instanceof _PlayerModel).toBe(true);
            expect(_scope.gameCtrl.game instanceof _GameModel).toBe(true);
            expect(_scope.gameCtrl.loginError).toBeUndefined();
            
            spyOn(_scope.gameCtrl.game, 'init').and.callFake(angular.noop);

            _scope.gameCtrl._playExec();

            expect(_scope.gameCtrl.activeStep).not.toBe(_STEP.play);
            expect(_scope.gameCtrl.game.init).not.toHaveBeenCalled();
            expect(_scope.gameCtrl.loginError).toBe("Digite seu nome para começar");
        }));

        it('deve executar corretamente', inject($controller => {
            let _list = [];
            _list.push(new _PlayerModel({
                name: 'abc',
                rounds: 10
            }));
            
            spyOn(_PlayerService, 'getPlayers').and.callFake(() => {
                return _q.resolve({
                    data: _list
                });
            });

            $controller(NOME_CONTROLLER, { $scope: _scope });

            _rootScope.$digest();
            
            expect(_scope.gameCtrl.ranking).toEqual(_list);
            expect(_scope.gameCtrl.player instanceof _PlayerModel).toBe(true);
            expect(_scope.gameCtrl.game instanceof _GameModel).toBe(true);
            expect(_scope.gameCtrl.loginError).toBeUndefined();
            
            spyOn(_scope.gameCtrl.game, 'init').and.callFake(angular.noop);

            _scope.gameCtrl._playExec();
            
            expect(_scope.gameCtrl.activeStep).not.toBe(_STEP.play);
            expect(_scope.gameCtrl.game.init).not.toHaveBeenCalled();
            expect(_scope.gameCtrl.loginError).toBe("Digite seu nome para começar");
            
            _scope.gameCtrl.player.name = "abc";

            _scope.gameCtrl._playExec();
            
            expect(_scope.gameCtrl.activeStep).toBe(_STEP.play);
            expect(_scope.gameCtrl.game.init).toHaveBeenCalled();
            expect(_scope.gameCtrl.loginError).toBeUndefined();
        }));
    });

    describe('_finishedExec', () => {
        it('não deve executar - playerService retorna reject', inject($controller => {
            let _list = [];
            _list.push(new _PlayerModel({
                name: 'abc',
                rounds: 10
            }));
            
            spyOn(_PlayerService, 'getPlayers').and.callFake(() => {
                return _q.resolve({
                    data: _list
                });
            });

            spyOn(_PlayerService, 'addPlayer').and.callFake(() => {
                return _q.reject({
                    mensagem: "abc"
                });
            });

            spyOn(_log, 'error').and.callFake(angular.noop);
            
            $controller(NOME_CONTROLLER, { $scope: _scope });

            _rootScope.$digest();

            _scope.gameCtrl._finishedExec();

            _rootScope.$digest();

            expect(_scope.gameCtrl.activeStep).not.toBe(_STEP.finished);
            expect(_log.error).toHaveBeenCalledWith({mensagem: "abc"});
        }));

        it('deve executar - playerService retorna resolve', inject($controller => {
            let _list = [];
            _list.push(new _PlayerModel({
                name: 'abc',
                rounds: 10
            }));
            
            spyOn(_PlayerService, 'getPlayers').and.callFake(() => {
                return _q.resolve({
                    data: _list
                });
            });

            spyOn(_PlayerService, 'addPlayer').and.callFake(() => {
                return _q.resolve();
            });

            spyOn(_log, 'error').and.callFake(angular.noop);
            
            $controller(NOME_CONTROLLER, { $scope: _scope });

            _rootScope.$digest();

            _scope.gameCtrl._finishedExec();

            _rootScope.$digest();

            expect(_scope.gameCtrl.activeStep).toBe(_STEP.finished);
            expect(_log.error).not.toHaveBeenCalled();
        }));
    });

    describe('_allCardsAreFound', () => {
        it('deve retornar false - possui cards com found = false', inject($controller => {
            let _list = [];
            let _cards = [];

            let _card = new _CardModel({
                id: 1,
                image: "abc",
            });

            let _cardTwo = new _CardModel({
                id: 2,
                image: "def",
                found: true
            });

            let _cardTree = new _CardModel({
                id: 3,
                image: "abc",
            });

            let _cardFour = new _CardModel({
                id: 4,
                image: "def",
                found: true
            });

            _cards.push(_card);
            _cards.push(_cardTwo);
            _cards.push(_cardTree);
            _cards.push(_cardFour);

            _list.push(new _PlayerModel({
                name: 'abc',
                rounds: 10
            }));

            $controller(NOME_CONTROLLER, { $scope: _scope });

            _rootScope.$digest();

            _scope.gameCtrl.game.cards = _cards;
            
            expect(_scope.gameCtrl._allCardsAreFound()).toBeFalsy();
        }));

        it('deve retornar true - todos os cards com found = true', inject($controller => {
            let _list = [];
            let _cards = [];

            let _card = new _CardModel({
                id: 1,
                image: "abc",
                found: true
            });

            let _cardTwo = new _CardModel({
                id: 2,
                image: "def",
                found: true
            });

            let _cardTree = new _CardModel({
                id: 3,
                image: "abc",
                found: true
            });

            let _cardFour = new _CardModel({
                id: 4,
                image: "def",
                found: true
            });

            _cards.push(_card);
            _cards.push(_cardTwo);
            _cards.push(_cardTree);
            _cards.push(_cardFour);

            _list.push(new _PlayerModel({
                name: 'abc',
                rounds: 10
            }));

            $controller(NOME_CONTROLLER, { $scope: _scope });

            _rootScope.$digest();

            _scope.gameCtrl.game.cards = _cards;
            
            expect(_scope.gameCtrl._allCardsAreFound()).toBeTruthy();
        }));
    });
    describe('_clearCards', () => {
        it('deve setar cards como undefined corretamente e blocked como false', inject($controller => {
            let _list = [];

            let _card = new _CardModel({
                id: 1,
                image: "abc",
            });

            let _cardTwo = new _CardModel({
                id: 2,
                image: "def",
                found: true
            });

            _list.push(new _PlayerModel({
                name: 'abc',
                rounds: 10
            }));

            $controller(NOME_CONTROLLER, { $scope: _scope });

            _rootScope.$digest();

            _scope.gameCtrl.game.blocked = true;
            _scope.gameCtrl.game.cardOne = _card;
            _scope.gameCtrl.game.cardTwo = _cardTwo;

            expect(_scope.gameCtrl.game.blocked).toBeTruthy();
            expect(_scope.gameCtrl.game.cardOne).toBeDefined();
            expect(_scope.gameCtrl.game.cardTwo).toBeDefined();

            _scope.gameCtrl._clearCards();

            expect(_scope.gameCtrl.game.blocked).toBeFalsy();
            expect(_scope.gameCtrl.game.cardOne).toBeUndefined();
            expect(_scope.gameCtrl.game.cardTwo).toBeUndefined();
        }));

        it('deve retornar true - todos os cards com found = true', inject($controller => {
            let _list = [];
            let _cards = [];

            let _card = new _CardModel({
                id: 1,
                image: "abc",
                found: true
            });

            let _cardTwo = new _CardModel({
                id: 2,
                image: "def",
                found: true
            });

            let _cardTree = new _CardModel({
                id: 3,
                image: "abc",
                found: true
            });

            let _cardFour = new _CardModel({
                id: 4,
                image: "def",
                found: true
            });

            _cards.push(_card);
            _cards.push(_cardTwo);
            _cards.push(_cardTree);
            _cards.push(_cardFour);

            _list.push(new _PlayerModel({
                name: 'abc',
                rounds: 10
            }));

            $controller(NOME_CONTROLLER, { $scope: _scope });

            _rootScope.$digest();

            _scope.gameCtrl.game.cards = _cards;
            
            expect(_scope.gameCtrl._allCardsAreFound()).toBeTruthy();
        }));
    });
});
