angular.module('App', ['ngMaterial', 'ngMdIcons','ngAutocomplete'])
    .config(['$mdIconProvider', '$mdThemingProvider', function ($mdIconProvider, $mdThemingProvider) {
        $mdIconProvider
            .iconSet('social', 'img/icons/sets/social-icons.svg', 24)
            .defaultIconSet('img/icons/sets/core-icons.svg', 24);

        $mdThemingProvider.theme('docs-dark', 'default')
            .primaryPalette('yellow')
            .dark();
  }])
    .controller('MenuCtrl', function ($scope, $mdSidenav) {
        $scope.toggleMenu = function () {
            $mdSidenav('left').toggle();

        }
    })
    .controller('FABCtrl', function ($scope, $mdDialog) {
        $scope.fabIcon = 'add';
        console.log($scope);
        $scope.fabIconMorph = function (event) {
            //    console.log(this);
            //if (this.isOpen == false) {
            console.log(event);
            switch (event) {
            case 'click':
                this.isOpen = !this.isOpen;
                break;
            case 'enter':
                this.isOpen = true;
                break;
            case 'leave':
                this.isOpen = false;
                break;
            }

            $scope.fabIcon = this.isOpen ? 'clear' : 'add';
            //            if (this.isOpen == true)
            //                this.isOpen = false;
            //            else
            //                this.isOpen = !this.isOpen;
            //  this.isOpen = true;
            //} else {
            //$scope.fabIcon = 'add';
            //  this.isOpen = false;
            //    }
        };
        $scope.open = function (ev) {
            console.log(ev.target.id);
            //Create the $scope.content prototype if it does not exist. We can not access these items if a placeholder has not been created.

            var defaultOptions = {
                templateUrl: 'templates/material/' + ev.target.id,
                controller: 'ModalInstanceCtrl',
                parent: angular.element(document.body),
                //parent: this,
                targetEvent: ev,
                clickOutsideToClose: true
                    //scope: $scope
            };

            var modalInstance = $mdDialog.show(defaultOptions);
        }
    })
    .controller('AlertCtrl', function ($scope, $mdDialog) {
        $scope.showAgreement = function (ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            // Modal dialogs should fully cover application
            // to prevent interaction outside of dialog
            var defaultOptions = {
                //parent: angular.element(document.body),
                title: 'Membership Agreement',
                content: 'Bacon Ipsum - A Meatier Lorem Ipsum Generator:<br>Pork belly sausage officia cupim, salami qui ipsum turducken in dolore flank.Sunt consequat kielbasa bacon qui pig short loin.Laboris venison veniam voluptate nisi.Ball tip beef short loin jerky laboris.In eu rump frankfurter hamburger voluptate sirloin.Kielbasa ex short ribs magna dolore in shoulder sausage sirloin nulla drumstick excepteur boudin.<br>Pork belly sausage officia cupim, salami qui ipsum turducken in dolore flank.Sunt consequat kielbasa bacon qui pig short loin.Laboris venison veniam voluptate nisi.Ball tip beef short loin jerky laboris.In eu rump frankfurter hamburger voluptate sirloin.Kielbasa ex short ribs magna dolore in shoulder sausage sirloin nulla drumstick excepteur boudin.',
                ariaLabel: 'Membership Agreement',
                ok: 'I agree',
                cancel: 'I disagree',
                targetEvent: ev
            };
            defaultOptions.openFrom = {
                top: -50,
                width: 30,
                height: 80
            };
            defaultOptions.closeTo = {
                left: 1500
            };
            $mdDialog.show($mdDialog.confirm(defaultOptions));
        };
    })
    .controller('locationCtrl', function ($scope, $window) {
        $scope.options = {
        		type: '(regions)',
        	    //country: 'ca'
        };
    	console.log($scope);
//        $scope.changeLocation = function (address) {
//            console.log(address);
//            //Create the $scope.content prototype if it does not exist. We can not access these items if a placeholder has not been created.
//            $window.location.href = address;
//        }
    })
    .controller('JoinCtrl', function ($scope, $mdDialog) {
        $scope.open = function (ev) {
            console.log(ev.target.id);
            //Create the $scope.content prototype if it does not exist. We can not access these items if a placeholder has not been created.

            var defaultOptions = {
                templateUrl: 'templates/material/' + ev.target.id,
                controller: 'ModalInstanceCtrl',
                parent: angular.element(document.body),
                //parent: this,
                targetEvent: ev,
                clickOutsideToClose: true
                    //scope: $scope
            };

            $mdDialog.show(defaultOptions);
        }
    })
    .controller('ModalInstanceCtrl', function ($scope, $mdDialog) {
        //This fires for all 'Ok' clicks in a modal
        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.answer = function (answer) {
            $mdDialog.hide(answer);
        };
    });

