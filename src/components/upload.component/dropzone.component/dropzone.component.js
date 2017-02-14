(function () {
    'use strict';

    angular.module('oddc.widget.odwebtv.quickadd')
        .component('dropzone', {
            templateUrl: 'src/components/upload.component/dropzone.component/dropzone.component.html',
            bindings: {
                duration: '<',
                effect: '<',
                presentationId: '<'
            },
            controller: dropzoneController,
            controllerAs: 'dropzoneController'
        });

    dropzoneController.$inject = ['Upload', '$log', '$q', 'authenticationService', 'widgetServices', 'configuration', 'guidService', '$timeout'];

    function dropzoneController(Upload, $log, $q, authenticationService, widgetServices, configuration, guidService, $timeout) {

        var self = this;
        self.file = null; // stores file object (used for preview while uploading)
        self.progress = 0; // stores progress for progress-bar
        self.filename = false; // filename of uploaded file
        self.isUploading = false; // true while uploading file (display "uploading file" - message")
        self.errorMessage = false; // displays "error" - message if true (if file-type is not accepted)
        self.uploadReady = false; // display "upload ready" - message

        self.chunkSize = 1000000; // 1MB
        self.messageTimeout = 3000; // display time of error-/success message in ms

        /*
        * save uploaded file as odWeb.tv slide for current user
        * */
        self.saveUploadedFile = function (filename, data) {
            return authenticationService.getToken()
                .then(function(token) {
                    return widgetServices.callService('quickadd', {
                        token: token,
                        duration: self.duration,
                        effect: self.effect,
                        pr_id: self.presentationId,
                        ps_name: filename,
                        data: data
                    });
                });
        };

        /*
        * upload file
        * */
        self.upload = function (file) {
            if (!file) {
                self.errorMessage = true;
                $timeout(self.messageTimeout).then(function() {
                    self.errorMessage = false;
                });
                return false;
            }
            self.file = file;
            self.filename = file.name;
            self.isUploading = true;
            self.uniqueFilename = guidService.generateNew('quickadd_', '.' + file.name.split('.').pop());
            Upload.upload({
                url: configuration.urls.upload,
                withCredentials: true,
                data: {
                    uniqueFilename: self.uniqueFilename,
                    file: file
                },
                resumeChunkSize: self.chunkSize
            }).then(function (resp) {
                $log.debug('file uploaded', resp.data.data);
                if (!resp.data.error) {
                    self.saveUploadedFile(self.filename, resp.data.data)
                        .then(function () {
                            self.isUploading = false;
                            self.progress = 0;
                        }).then(function(){
                            self.uploadReady = true;
                            self.file = null;
                            $timeout(self.messageTimeout).then(function() {
                                self.uploadReady = false;
                            });
                    });
                } else {
                    $log.debug('upload error: ', resp);
                    self.isUploading = false;
                    self.progress = 0;
                    $q.reject();
                }
            }, function (resp) {
                self.isUploading = false;
                self.progress = 0;
                $log.debug('upload error: ', resp);
            }, function (evt) {
                self.progress =  parseInt(100.0 * evt.loaded / evt.total);
            });
        };

    }

})();