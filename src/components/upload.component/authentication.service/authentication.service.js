(function () {
    'use strict';

    angular.module('oddc.widget.odwebtv.quickadd')
        .factory('authenticationService', ['$log', 'widgetServices', '$q', function ($log, widgetServices, $q) {

            var token = null;

            return {
                getToken: getToken
            };

            function getToken() {
                if (token) {
                    return $q.when(token);
                } else {
                    return widgetServices.callService('authenticate').then(function success(response) {
                        if (response.error) {
                            $log.debug('authenticationService error', response.data);
                            return $q.reject(response.data);
                        } else {
                            token = response.data;
                            return token;
                        }
                    }, function error(response) {
                        $log.debug('authenticaionService error', response);
                        $q.reject(response);
                    });
                }
            }
        }]);
})();