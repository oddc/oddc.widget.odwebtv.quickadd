(function () {
    'use strict';

    angular.module('oddc.widget.odwebtv.quickadd')
        .component('upload', {
            templateUrl: 'src/components/upload.component/upload.component.html',
            controller: uploadController,
            controllerAs: 'uploadController'
        });

    uploadController.$inject = ['presentationService', 'authenticationService', 'widgetServices', '$state', '$q', '$log'];

    function uploadController(presentationService, authenticationService, widgetServices ,$state, $q, $log) {
        var self = this;

        self.presentationList = [];

        /*
        * authenticate (get jwt) an load users preferences (if set)
        * */
        self.$onInit = function() {

            // get jwt from authentication service...
            authenticationService.getToken()
                .then(function(token) {
                    // ... and load users presentations
                    return presentationService.loadPresentationList(token);
                })
                .then(function(response) {
                    if (!response) {
                        return $q.reject(response);
                    } else {
                        self.presentationList = response;
                        self.selectedPresentation = String(response[0].pr_id);
                        self.loading = false;
                        // check if user has saved preferences...
                        widgetServices.getProperty('preferences')
                            .then(function(response) {
                                // and set them
                                if(self.presentationList
                                        .map(function (element) { return element.pr_id; })
                                        .indexOf(response.selectedPresentation.pr_id) == -1) {
                                    // if selectedPresentation no more exists select first one
                                    self.selectedPresentation = self.presentationList[0];
                                } else {
                                    self.selectedPresentation = response.selectedPresentation;
                                }
                                self.selectedEffect = response.selectedEffect;
                                self.selectedDuration = response.selectedDuration;
                            }, function(error) {
                                // or set defaults
                                $log.debug(error);
                                self.selectedPresentation = String(self.presentationList[0].pr_id);
                                self.selectedEffect = 'fade';
                                self.selectedDuration = '10';
                            });
                    }
                }, function error() {
                    $state.go('error');
                });
        };

        /**
         * save user preferences
         */
        self.saveProperties = function(){
            widgetServices.setProperty('preferences', {
                selectedPresentation : self.selectedPresentation,
                selectedEffect : self.selectedEffect,
                selectedDuration : self.selectedDuration
            });
        };
    }

})();