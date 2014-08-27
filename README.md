angular-modules
===============

Angular helper modules

1. angular-ng-model-focus
    Angular ng-model directive does not support $focused property on input tags. $focused property is very often required for eg. during angular validations, we may not like to show errors when the input tag is focused. So one can use $focused to show errors only when ngModel.$focused is false.

