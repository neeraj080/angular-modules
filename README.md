Angular helper modules
===============



angular-ng-model-focus
===============
Angular ng-model directive does not support $focused property on input tags. $focused property is very often required for eg. when using angular validation, we may not want to show errors when the input tag is focused because the user may still be typing. So one can use $focused to show errors only when ngModel.$focused is false.

