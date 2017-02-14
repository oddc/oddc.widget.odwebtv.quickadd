(function () {
    'use strict';

    angular.module('oddc.widget.odwebtv.quickadd', ['widgetbuilder', 'ngFileUpload'])
        .config(function stateConfig($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state('index', {
                    url: '/',
                    template: '<upload />',
                    data: {
                        cssClassNames : 'index'
                    }
                })
                .state('error', {
                    url: '/error',
                    template: '<error />',
                    data: {
                        cssClassNames : 'error'
                    }
                });

            $urlRouterProvider.otherwise('/');
        })
        .service('configuration', ['widgetbuilderConfiguration', function(widgetbuilderConfiguration) {
            switch(widgetbuilderConfiguration.ENV) {
                case 'PROD' :
                    this.urls = {
                        upload : 'https://www.odweb.tv/publicService/upload'
                    };
                    break;
                default:
                    this.urls = {
                        upload : 'https://dev.odweb.tv/publicService/upload'
                    };
                    break;
            }
        }]);

})();