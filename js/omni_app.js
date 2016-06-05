/*
Content creation wizard
=====================================================================
This AngularJS module is meant to replace Drupal content forms / webforms
for user input.
=====================================================================
The module will be displayed in a modal window
to focus the user's attention to a single area of the screen.
Information will be entered and validated using a variety of
AngularJS, Bootstrap and Google features.
When the wizard is completed a drupal node will be written
with 'drupal.node_save(node)'
Dependencies:
ngAnimate
ui.bootstrap
ngMap
ngAutocomplete
ngTagsInput
nzToggle
ngFileUpload
=====================================================================
Mangeled by: J.Russell 7/8/2015
 */
angular.module('App', ['ngAnimate', 'ngMap', 'ngFileUpload', 'ngMaterial', 'ngMdIcons'])
    .config(function ($httpProvider, datepickerConfig, datepickerPopupConfig) {
        // Enable cross domain calls
        $httpProvider.defaults.useXDomain = true;
        datepickerConfig.showWeeks = false;

        // Remove the header used to identify ajax call that would prevent
        // CORS from working
        delete($httpProvider.defaults.headers.common['X-Requested-With']);
    }).run(function ($rootScope, $http) {
        $rootScope.$http = $http;
    })
    .controller('FABCtrl', function ($scope, $modal, $http, Upload, $timeout, $filter, $interval) {
        $scope.fabIcon = 'add';
        $scope.fabIconMorph = function () {
            if ($scope.fabIcon === 'add') {
                $scope.fabIcon = 'clear';
            } else {
                $scope.fabIcon = 'add';
            }
        };

        $scope.open = function (modal_form) {
            //console.log(modal_form);
            //Create the $scope.content prototype if it does not exist. We can not access these items if a placeholder has not been created.
            if (typeof $scope.content === 'undefined') {
                $scope.content = {
                    properties: {},
                    values: {},
                    featured: {},
                    methods: {}
                };
                $scope.content.properties.isFile = null;
                $scope.content.properties.isFeatured = null;
                $scope.content.properties.isValidURL = null;
                $scope.content.properties.hasSchedule = false;

            }
            /*
            =========================================
            Set default values for all modals ($modalInstance needs this):
            =========================================
            templateUrl: All HTML templates for modals are kept in the templates directory
            controller: All modal instances will be managed by a single $modalInstance controller //http://angular-ui.github.io/bootstrap/#/modal
            scope: All modals will need access to the underlying $scope
            */

            var defaultOptions = {
                templateUrl: 'templates/' + modal_form,
                controller: 'ModalInstanceCtrl',
                scope: $scope
            };

            switch (modal_form) {
            case 'modal_url.html':
                /*
                =========================================
                Set unique modal values for modal_url.html:
                =========================================
                defaultOptions.windowClass = 'value' is the same as var defaultOptions = {windowClass: 'value'};
                windowClass is set because this modal is not small enough to be set with the size:sm parameter and will default to the top of the screen.
                For this modal, the default bootstrap modal size and middle-middle location is the most user friendly configuration
                */
                defaultOptions.windowClass = 'center-modal';
                //                $scope.$watch('content.values.contentURL', function () {
                //                    console.log('upload watch triggered');
                //
                //                    if (typeof $scope.content.values.contentURL !== 'undefined') {
                //                        $scope.content.methods.upload($scope.content.values.files);
                //                    }
                //                });
                //if (!$scope.spinneractive) {
                $scope.spinneractive;
                //  $scope.startcounter++;
                //}

                $scope.content.methods.validateAsyncURL = function () {
                    $scope.spinneractive = true;
                    $scope.content.properties.isValidURL = null;

                    //setTimeout("content.methods.validateURL();", 1000);
                    usSpinnerService.spin('spinner-1');
                    keyuptimer = $interval(function () {
                        var jsonRequest;
                        //We only want to check if the user has entered a protocol becuase $http.jsonp or $http.get
                        //will not work without it. We do not prepend the protocol here.
                        //We can assume that the user is still focused on the input field so dont disturb them until this field
                        //has lost focus or clicked ok.
                        if ($scope.content.values.contentURL.indexOf('://') == -1)
                            $scope.content.properties.hasProtocol = false;
                        else
                            $scope.content.properties.hasProtocol = true;

                        //Build the URL without changing the value of $scope.content.values.contentURL
                        if ($scope.content.properties.hasProtocol === false)
                            jsonRequest = 'http://php-relay-jrussell15.c9.io/php-relay.2.php?callback=JSON_CALLBACK&url=http://' + $scope.content.values.contentURL;
                        else
                            jsonRequest = 'http://php-relay-jrussell15.c9.io/php-relay.2.php?callback=JSON_CALLBACK&url=' + $scope.content.values.contentURL;

                        //Try to async validate what has been entered so far. Only handle success because the user
                        //may still be typing.
                        $scope.$http.jsonp(jsonRequest).success(
                            function (data, status, headers, config) {
                                //Set the values returned by the request to the $scope.content and $scope.properties variables
                                //We use ternary operators here to set only the values that were retruned and avoid a bunch of uneccessary if statements
                                $scope.content.properties.isValidURL = true;
                                $scope.content.values.contentTitle = data.title || '';
                                $scope.content.values.contentSummary = data.description || '';
                                $scope.content.values.contentSource = data.source || '';
                                $scope.content.values.contentAuthor = data.author || '';
                                $scope.content.values.contentPubDate = data.date ? $filter('date')(data.date, 'longDate') : '';
                                //                    console.log(config);
                                //                    console.log(data);
                                //                    console.log(status);
                                //                    console.log(headers);
                            });
                        $scope.spinneractive = false;
                        usSpinnerService.stop('spinner-1');
                    }, 1500, 1);

                }
                $scope.content.methods.validateURL = function () {
                    //Add a protocol if the user did not. Testing for '://' is the base case
                    //TODO: Create a failover from https to http. Since all traffic on the domain is forced to https we will assume https external links. This will also
                    //prevent mixed-mode warnings (http talking to https and vice versa).

                    //If the URL has been successfully validated when the URL field has lost focus then we dont need to check it again.
                    //Or if there is nothing there!!
                    if ($scope.content.properties.isValidURL == true || !$scope.content.values.contentURL)
                        return;
                    //$scope.content.values.contentURL = tryHTTP.concat($scope.content.values.contentURL);
                    //var tryHTTP = 'http://';
                    //var tryHTTPS = 'https://';
                    var jsonRequest;

                    if ($scope.content.properties.hasProtocol === false)
                        jsonRequest = 'http://php-relay-jrussell15.c9.io/php-relay.2.php?callback=JSON_CALLBACK&url=http://' + $scope.content.values.contentURL;
                    else
                        jsonRequest = 'http://php-relay-jrussell15.c9.io/php-relay.2.php?callback=JSON_CALLBACK&url=' + $scope.content.values.contentURL;

                    $scope.$http.jsonp(jsonRequest).success(
                        function (data, status, headers, config) {
                            //Set the values returned by the request to the $scope.content and $scope.properties variables
                            //We use ternary operators here to set only the values that were retruned and avoid a bunch of uneccessary if statements
                            //TODO: Add spin.js to provide feedback while the user is waiting for the resource to be contacted
                            $scope.content.properties.isValidURL = true;
                            $scope.content.values.contentTitle = data.title ? data.title : '';
                            $scope.content.values.contentSummary = data.description ? data.description : '';
                            $scope.content.values.contentSource = data.source ? data.source : '';
                            $scope.content.values.contentAuthor = data.author ? data.author : '';
                            $scope.content.values.contentPubDate = data.date ? $filter('date')(data.date, 'longDate') : '';
                            //                    console.log(config);
                            //                    console.log(data);
                            //                    console.log(status);
                            //                    console.log(headers);
                        }).error(
                        function (data, status, headers, config) {
                            //Set the $scope.content.properties.isValidURL to false if the GET request is not successful
                            //Question: Begin https failover here?
                            $scope.content.properties.isValidURL = false;
                        }).then(
                        function (data, status, headers, config) {
                            //Set the $scope.content.properties.requestStatus regardless of success or failure
                            $scope.content.properties.requestStatus = status;
                        });
                }

                //Finally open the modal with the specified modal parameters ($scope is included so we are keeping track of the content)
                var modalInstance = $modal.open(defaultOptions);
                break;

            case 'modal_location.html':
                /*
                =========================================
                Set unique modal values for modal_url.html:
                =========================================
                defaultOptions.windowClass = 'value' is the same as var defaultOptions = {windowClass: 'value'};
                windowClass is set because this modal is not small enough to be set with the size:sm parameter and will default to the top of the screen.
                For this modal, the default bootstrap modal size and middle-middle location is the most user friendly configuration
                */
                //defaultOptions.windowClass = 'center-modal';

                // $autocomplete - converted form input field to an google maps autocomplete list

                // When the map is fully initialized lets tell it to go some
                // where...
                // instead of in the shark infested waters in the gulf of
                // guinea

                $scope.$on('mapInitialized', function (event, map, $scope) {
                    // map.setCenter({
                    // lat: 0,
                    // lng: 0
                    // });
                    //console.log($scope);
                    map.setZoom(3);
                    var request = {
                        location: map.getCenter(),
                        radius: '500',
                        query: 'USA'
                    };

                    // $input and $autocomplete are combined
                    // to turn an input box into a Google
                    // Maps autocomplete box
                    var input = document
                        .getElementById('keyword');
                    var autocomplete = new google.maps.places.Autocomplete(
                        input);
                    var marker = new google.maps.Marker({
                        map: map
                    });
                    var service = new google.maps.places.PlacesService(
                        map);

                    //                        console.log(input);
                    //                        console.log(autocomplete);
                    //                        console.log(marker);
                    //console.log(service);

                    // Make the map goto the designated
                    // location in lines 30-40 when the map
                    // is finished loading
                    service.textSearch(request, callback);

                    // Make the map listen for what happens
                    // to $autocomplete
                    // Geolocation information is available
                    // in place.geometry.location
                    // This can be sent to Drupal via
                    // geoPHP, geoJSON, geofield or geocoder
                    google.maps.event
                        .addListener(
                            autocomplete,
                            "place_changed",
                            function ($scope) {
                                var place = autocomplete
                                    .getPlace();
                                if (place.geometry.viewport) {
                                    map
                                        .fitBounds(place.geometry.viewport);
                                    console.log(place);
                                    console.log(map);
                                    map.scope.content.values.contentLocation = place.formatted_address;
                                } else {
                                    map
                                        .setCenter(place.geometry.location);
                                    map.setZoom(15);
                                }

                                marker
                                    .setPosition(place.geometry.location);
                            });
                    // console.clear();
                    // console.log(service.getDetails(request,callback).place.placeId);
                    // console.log($scope);

                    function callback(results, status) {
                        if (status == google.maps.places.PlacesServiceStatus.OK) {
                            var marker = new google.maps.Marker({
                                map: map,
                                place: {
                                    placeId: results[0].place_id,
                                    location: results[0].geometry.location
                                        //item: results[0]
                                }
                            });
                            //console.log(results[0]);
                            // console.log(marker.place.location);
                            map
                                .setCenter(marker.place.location);
                        }
                    }

                });
                // console.log($scope.lat);


                //Finally open the modal with the specified modal parameters ($scope is included so we are keeping track of the content)
                var modalInstance = $modal.open(defaultOptions);
                break;
            case 'modal_file.html':
                /*
                =========================================
                Set unique modal values for modal_file.html:
                =========================================
                defaultOptions.windowClass = 'value' is the same as var defaultOptions = {windowClass: 'value'};
                windowClass is set because this modal is not small enough to be set with the size:sm parameter and will default to the top of the screen.
                For this modal, the default bootstrap modal size and middle-middle location is the most user friendly configuration
                */
                defaultOptions.windowClass = 'center-modal';

                //Add a $watch to detect changes to $scope.content.values.files
                //$scope.content.values.files is bound to the ng-FilesUpload directives in modal_file.html
                $scope.$watch('content.values.files', function () {
                    console.log('upload watch triggered');

                    if (typeof $scope.content.values.files !== 'undefined') {
                        $scope.content.methods.upload($scope.content.values.files);
                    }
                });
                $scope.log = '';
                $scope.content.methods.upload = function (files) {
                    console.log('upload function called');
                    console.log(files);

                    if (files && files.length) {
                        for (var i = 0; i < files.length; i++) {
                            var file = files[i];
                            Upload.upload({
                                url: 'http://angular-file-upload-cors-srv.appspot.com/upload',
                                fields: {
                                    'username': $scope.username
                                },
                                file: file
                            }).progress(function (evt) {
                                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                                $scope.log = 'progress: ' + progressPercentage + '% ' +
                                    evt.config.file.name + '\n' + $scope.log;
                            }).success(function (data, status, headers, config) {
                                //Prepare the wizard for an uploaded file
                                $scope.content.properties.isFile = true;
                                $timeout(function () {
                                    $scope.log = 'file: ' + config.file.name + ', Response: ' + JSON.stringify(data) + '\n' + $scope.log;
                                });


                            });
                        }

                    }
                };
                //Finally open the modal with the specified modal parameters ($scope is included so we are keeping track of the content)
                var modalInstance = $modal.open(defaultOptions);
                break;
            case 'modal_schedule.html':
                /*
                =========================================
                Set unique modal values for modal_file.html:
                =========================================
                defaultOptions.windowClass = 'value' is the same as var defaultOptions = {windowClass: 'value'};
                windowClass is set because this modal is not small enough to be set with the size:sm parameter and will default to the top of the screen.
                For this modal, the default bootstrap modal size and middle-middle location is the most user friendly configuration
                */
                defaultOptions.size = 'sm';
                $scope.$watch('content.values.contentStartDate', function () {
                    if (typeof $scope.content.values.contentStartDate !== 'undefined') {
                        //                        $scope.content.methods.setStartDate($scope.content.values.contentStartDate);
                        console.log($scope.content.values.contentStartDate);
                        $scope.content.properties.hasSchedule = true;
                    }
                });
                $scope.$watch('content.values.contentEndDate', function () {
                    if (typeof $scope.content.values.contentEndDate !== 'undefined') {
                        //                        $scope.content.methods.setEndDate($scope.content.values.contentEndDate);
                        $scope.content.properties.hasSchedule = true;
                    }
                });
                $scope.$watch('content.properties.repeats', function () {
                    if (typeof $scope.content.properties.repeats !== 'undefined') {
                        $scope.content.methods.setRepeatInterval($scope.content.properties.repeats);
                    }
                });
                $scope.content.methods.setStartDate = function (date) {
                    //                    $scope.content.values.contentSchedule = 'Starts: ' + $filter('date')(date, 'longDate');
                }
                $scope.content.methods.setEndDate = function (date) {
                    //                    if ($scope.content.values.contentStartDate)
                    //                        $scope.content.values.contentSchedule += ' | Ends: ' + $filter('date')(date, 'longDate');
                }
                $scope.content.methods.setRepeatInterval = function (interval) {
                    //                    if ($scope.content.values.contentSchedule)
                    //                        $scope.content.values.contentSchedule += ' | ' + $scope.content.properties.repeats;
                }

                //Finally open the modal with the specified modal parameters ($scope is included so we are keeping track of the content)
                var modalInstance = $modal.open(defaultOptions);
                break;

            case 'wizard.html':
                /*
                =========================================
                Set default values for the wizards properties:
                =========================================
                $scope.wizard.steps : An array in plain-old-english of all wizard slides
                $scope.wizard.step : An integer based on a 0-index to set which slide to start the wizard
                $scope.wizard.typeHeading : A string to set the heading in the modal
                $scope.content.properties.isFeatured : A boolean flag to set the item to be a featured item

                ========================================
                Define the methods of the wizard:
                =========================================
                isFirstStep() : [Property] Returns True if and only if $scope.wizard.step is equal to 0
                isLastStep() : [Property] Returns True if and only if $scope.wizard.step is equal to the length of the steps array - 1
                isCurrentStep(int step) : [Property] Returns True if and only if $scope.wizard.step is equal the value passed by step
                getCurrentStep(int step) : [Getter] Gets the value of $scope.wizard.steps at index $scope.wizard.step
                setCurrentStep(int step) : [Setter] Sets $scope.wizard.step to the value passed by step
                getNextLabel() : [Getter] Gets the label of the Next/Submit button based on the value returned from $scope.wizard.isLastStep()
                handlePrevious() : [Setter] Deincrement $scope.wizard.step by 1 unless it is the first step... then it does not deincrement
                handleNext() : [Setter] Increment $scope.wizard.step by 1 unless it is the last step... then we want to close/submit the wizard
                */

                $scope.wizard = {
                    steps: ['one', 'two', 'three'],
                    step: 0
                };
                $scope.wizard.typeHeading = "Create a link to:";

                $scope.wizard.isFirstStep = function () {
                    return $scope.wizard.step === 0;
                };

                $scope.wizard.isLastStep = function () {
                    return $scope.wizard.step === ($scope.wizard.steps.length - 1);
                };

                $scope.wizard.isCurrentStep = function (step) {
                    return $scope.wizard.step === step;
                };

                $scope.wizard.setCurrentStep = function (step) {
                    $scope.wizard.step = step;
                };

                $scope.wizard.getCurrentStep = function () {
                    return $scope.wizard.steps[$scope.wizard.step];
                };

                $scope.wizard.getNextLabel = function () {
                    return ($scope.wizard.isLastStep()) ? 'Submit' : 'Next';
                };

                $scope.wizard.handlePrevious = function () {
                    $scope.wizard.step -= ($scope.wizard.isFirstStep()) ? 0 : 1;
                };

                $scope.wizard.handleNext = function () {
                    if ($scope.wizard.isLastStep()) {
                        modalInstance.close($scope.wizard);

                        modalInstance.result
                            .then(function (data) {
                                //closeAlert();
                                //$scope.content.summary = data;
                            }, function (reason) {
                                $scope.wizard.reason = reason;
                            });
                        console.log($scope);
                    } else {
                        $scope.wizard.step += 1;
                    }
                };
                $scope.wizard.loadContentTypeTags = function (query) {
                    // An arrays of strings here will also be converted into
                    // an array of objects console.clear();
                    console.log($http.get('types.json'));
                    $http.get('types.json').success(
                        function (data, status, headers, config) {
                            console.log(config);
                            console.log(data);
                            console.log(status);
                            console.log(headers);
                        }).error(
                        function (data, status, headers, config) {
                            //Handle Errors
                        }).then(
                        function (data, status, headers, config) {
                            //Handle cleanup
                        });
                    return $http.get('types.json');
                };
                $scope.wizard.loadPeopleTags = function (query) {
                    // An arrays of strings here will also be converted into
                    // an array of objects console.clear();
                    console.log($http.get('people.json'));
                    $http.get('people.json').success(
                        function (data, status, headers, config) {
                            console.log(config);
                            console.log(data);
                            console.log(status);
                            console.log(headers);
                        }).error(
                        function (data, status, headers, config) {
                            //Handle Errors
                        }).then(
                        function (data, status, headers, config) {
                            //Handle cleanup
                        });
                    return $http.get('people.json');
                };
                $scope.wizard.loadTags = function (query) {
                    // An arrays of strings here will also be converted into
                    // an array of objects console.clear();
                    console.log($http.get('tags.json'));
                    $http.get('tags.json').success(
                        function (data, status, headers, config) {
                            console.log(config);
                            console.log(data);
                            console.log(status);
                            console.log(headers);
                        }).error(
                        function (data, status, headers, config) {
                            //Handle Errors
                        }).then(
                        function (data, status, headers, config) {
                            //Handle cleanup
                        });
                    return $http.get('tags.json');
                };
                $scope.wizard.loadRelatedContent = function (query) {
                    // An arrays of strings here will also be converted into
                    // an array of objects console.clear();
                    console.log($http.get('nodes.json'));
                    $http.get('nodes.json').success(
                        function (data, status, headers, config) {
                            console.log(config);
                            console.log(data);
                            console.log(status);
                            console.log(headers);
                        }).error(
                        function (data, status, headers, config) {
                            //Handle Errors
                        }).then(
                        function (data, status, headers, config) {
                            //Handle cleanup
                        });
                    return $http.get('nodes.json');
                };


                $scope.wizard.tagAdded = function (tag) {
                    $scope.log.push('Added: ' + tag.text);
                };
                $scope.wizard.tagRemoved = function (tag) {
                    $scope.log.push('Removed: ' + tag.text);
                };

                //Finally open the modal with the specified modal parameters ($scope is included so we are keeping track of the wizard)
                //console.log($scope);
                var modalInstance = $modal.open(defaultOptions);
                break;

            case 'modal_featured.html':
                /*
                =========================================
                Set unique modal values for modal_featured.html:
                =========================================
                defaultOptions.size = 'value' is the same as var defaultOptions = {size: 'value'};
                For this modal, bootstrap has a preconfigured modal size (sm) that fits this modals content.
                For now, this modal will be top aligned and centered with the parent modal

                TODO: Document how the ng-file-upload module works
                */

                defaultOptions.size = 'sm';
                $scope.$watch('content.featured.files', function () {
                    console.log('upload watch triggered');

                    if (typeof $scope.content.featured.files !== 'undefined') {
                        $scope.content.methods.upload($scope.content.featured.files);
                    }
                });
                $scope.log = '';
                $scope.content.methods.upload = function (files) {
                    if (files && files.length) {
                        for (var i = 0; i < files.length; i++) {
                            var file = files[i];
                            Upload.upload({
                                url: 'http://angular-file-upload-cors-srv.appspot.com/upload',
                                fields: {
                                    'username': $scope.username
                                },
                                file: file
                            }).progress(function (evt) {
                                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                                $scope.log = 'progress: ' + progressPercentage + '% ' +
                                    evt.config.file.name + '\n' + $scope.log;
                            }).success(function (data, status, headers, config) {
                                $scope.content.properties.isFeatured = true;
                                $timeout(function () {
                                    $scope.log = 'file: ' + config.file.name + ', Response: ' + JSON.stringify(data) + '\n' + $scope.log;
                                });
                            });
                        }
                    }
                };

                //Finally open the modal with the specified modal parameters ($scope is included so we are keeping track of the content)
                var modalInstance = $modal.open(defaultOptions);
                break;
            }
        }
    })
    .controller('ModalInstanceCtrl', function ($scope, $modalInstance, $filter) {
        //This fires for all 'Ok' clicks in a modal
        $scope.ok = function (nextModal) {
            $modalInstance.close();
            $modalInstance.result.then(function () {
                    console.log('Success');
                    //We prepend the protocol here so we dont confuse the user
                    if ($scope.content.properties.hasProtocol === false) {
                        $scope.content.values.contentURL = 'http://' + $scope.content.values.contentURL;
                    }
                    if ($scope.content.properties.hasSchedule === true) {
                        $scope.content.values.contentSchedule = 'Starts: ' + $filter('date')($scope.content.values.contentStartDate, 'longDate');
                        $scope.content.values.contentSchedule += $scope.content.values.contentEndDate ? ' | Ends: ' + $filter('date')($scope.content.values.contentEndDate, 'longDate') : '';
                        $scope.content.values.contentSchedule += ' | Repeats: ' + $scope.content.properties.repeats;
                        //                    $scope.content.values.contentSchedule = "test";
                    }

                    //console.log(data);
                    if (nextModal)
                        $scope.open(nextModal);
                    //console.log($scope);
                },
                function () {
                    console.log('Cancelled');
                });
        }

        //This fires for all 'Cancel' clicks in a modal
        $scope.cancel = function (msg) {
            $modalInstance.dismiss('cancel');
            console.log(msg);
        };
    })
    .filter('filesize', function () {
        var units = [
    'bytes',
    'KB',
    'MB',
    'GB',
    'TB',
    'PB'
  ];
        return function (bytes, precision) {
            if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) {
                return '?';
            }
            var unit = 0;
            while (bytes >= 1024) {
                bytes /= 1024;
                unit++;
            }
            return bytes.toFixed(+precision) + ' ' + units[unit];
        };
    })
    .directive('tooltip', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                $(element).hover(function () {
                    // on mouseenter
                    $(element).tooltip('show');
                }, function () {
                    // on mouseleave
                    $(element).tooltip('hide');
                });
            }
        };
    });
