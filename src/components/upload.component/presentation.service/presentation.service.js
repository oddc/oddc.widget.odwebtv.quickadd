(function () {
    'use strict';

    angular.module('oddc.widget.odwebtv.quickadd')
        .factory('presentationService', ['$log', 'widgetServices', '$rootScope', '$q', '$timeout', 'widgetState', function ($log, widgetServices, $rootScope, $q) {

            return {
                loadPresentationList: loadPresentationList
            };

            function loadPresentationList(token) {
                return widgetServices.callService('getPresentations', {
                    token: token
                }).then(function success(response) {
                    if (response.error) {
                        return $q.reject();
                    } else {
                        return response.data;
                    }
                }, function error(response) {
                    $q.reject(response);
                });
            }
        }]);
})();