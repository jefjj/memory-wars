(function(angular) {
    'use strict';

    angular
        .module('app')
        .service('GuidService', GuidService);

    function GuidService() {
        this.getNewGuid = getNewGuid;

        function getNewGuid() {
            // https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript

            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
                var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }
    }
})(angular);
