/**
 * Created by Neeraj on 27/08/14.
 * Tested with angular-1.3
 */

(function(angular) {
    var module = angular.module('InputOnFocus', []);
    module.directive('addFocus', [
        function() {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function(scope, elem, attrs, ngModel) {
                    ngModel.$focused = false;
                    elem.on('focusin', function(e) {
                        scope.$apply(function() {
                            ngModel.$focused = true;
                            elem.addClass('ng-focused');
                        });
                    });

                    elem.on('focusout', function(e) {
                        scope.$apply(function() {
                            ngModel.$focused = false
                            elem.removeClass('ng-focused');
                        });
                    })
                }
            }
        }
    ]);
})(angular);