(function () {
    'use strict';

    angular.module('oddc.widget.odwebtv.quickadd')
        .component('error', {
            templateUrl: 'src/components/error.component/error.component.html',
            controller: errorController,
            controllerAs: 'errorController'
        });

    function errorController() {
        var self = this;
    }

})();