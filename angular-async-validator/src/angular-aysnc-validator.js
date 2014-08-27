/**
 * Created by Neeraj on Aug 27, 2014
 * Tested with angular-1.3
 */

(function (angular) {
    var module = angular.module('AsyncValidation', []);
    module.directive('shouldBeUnique', ['$timeout', '$http', '$q', 'VALIDATION_PENDING', function ($timeout, $http, $q, VALIDATION_PENDING) {
        return {
            // restrict to attribute type.
            restrict: 'A',
            require: 'ngModel',
            scope: {
                getEndPoint: '&',
                validateResponse: '&'
            },
            priority: 1,
            link: function (scope, element, attrs, ngModel) {
                var lastValidationStatus;

                function isUnique(value) {
                    //Cancels any ongoing http request
                    if (scope.canceler) {
                        scope.canceler.resolve();
                    }

                    var canceler = scope.canceler = $q.defer();
                    var endpointDetails = scope.getEndPoint();
                    var params = {};
                    params[endpointDetails.paramName] = value;
                    var httpDeferred = $http({
                        url: endpointDetails.url,
                        method: 'GET',
                        params: params,
                        timeout: canceler.promise
                    });

                    ngModel.validationInProgress = true;
                    return httpDeferred;
                }

                function setValidity(httpDeferred) {
                    httpDeferred.success(function (data) {
                        lastValidationStatus = false;
                        if (scope.validateResponse(data)) {
                            lastValidationStatus = true;
                        }

                        ngModel.validationInProgress = false;
                        ngModel.$commitViewValue(true);
                    });

                    httpDeferred.error(function () {
                        ngModel.validationInProgress = false;
                    });
                }

                ngModel.$formatters.push(function (value) {
                    if (value) {
                        var httpDeferred = isUnique(value);
                        setValidity(httpDeferred);
                    }
                    return value;
                });

                ngModel.$parsers.push(function (value) {
                    ngModel.$setValidity('shouldBeUnique', true);

                    if (ngModel.$valid) {
                        var httpDeferred;

                        if (ngModel.$modelValue === VALIDATION_PENDING && !ngModel.validationInProgress) {
                            $timeout(function () {
                                ngModel.$setValidity('shouldBeUnique', lastValidationStatus);
                            });
                            if (lastValidationStatus) {
                                return value;
                            }
                            return undefined;
                        }
                        else {
                            httpDeferred = isUnique(value);
                            setValidity(httpDeferred);
                            return VALIDATION_PENDING;
                        }
                    }

                    return undefined;
                });
            }
        };
    }]);

    module.constant('VALIDATION_PENDING', '###REMOTE_VALIDATION_IN_PROGRESS###');
})(angular);