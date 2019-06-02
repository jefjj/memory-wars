(function(angular) {
    'use strict';

    angular
        .module('app')
        .service('StorageService', StorageService);

    StorageService.$inject = ['$window'];

    function StorageService($window) {

        const storage = $window.localStorage;
        this.exists = exists;
        this.get = get;
        this.set = set;
        this.remove = remove;
        this.getLength = getLength;
        this.clear = clear;
        this._isJson = _isJson;

        function exists(key) {
            return (this.getLength() > 0 && storage.getItem(key));
        }

        function get(key) {
            if (!key) {
                return storage;
            }

            if (this.exists(key)) {
                var item = storage.getItem(key);
                return (this._isJson(item) ? angular.fromJson(item) : item);
            }

            return null;
        }

        function set(key, value) {
            if (this.exists(key)) {
                this.remove(key);
            }

            var item = (typeof value === 'object') ? angular.toJson(value) : value;
            storage.setItem(key, item);
        }

        function remove(key) {
            if (this.exists(key)) {
                storage.removeItem(key);
                return true;
            }

            return false;
        }

        function getLength() {
            return storage.length;
        }

        function clear() {
            storage.clear();
        }

        function _isJson(str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }

            return true;
        }
    };

})(angular);
