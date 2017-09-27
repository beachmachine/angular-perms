# Angular Perms

Angular Perms is an AngularJS service that helps you checking user permission within your angular application. You
can register permission aliases, that may check for other permission aliases, call permission check functions or 
permissions coming from your backend. You can also register permission getter functions that check for permissions
coming from your backend.

**Note:** This library is for AngularJS 1.x only!


## Dependencies

Angular Perms depends on AngularJS 1.x.


## Installation

* Via `npm`: `npm install --save angular-perms`
* Via `git`: `git clone git@github.com:beachmachine/angular-perms.git`

Include the library in your HTML
* Minified version:
```html
    <script src="node_modules/angular-perms/dist/ngperms.min.js"></script>
```

* Non-minified version:
```html
    <script src="node_modules/angular-perms/dist/ngperms.js"></script>
```

Declare dependency on Angular Perms for your main application:
```javascript
(function() {
    var app = angular.module('app', [
        'ngPerms'
    ])
})();
```


## Examples

### Register permission aliases

The following example shows how to register a permission alias that checks for permissions using
another permission alias and a check function. The second permission alias uses a permission coming
from the backend. This backend permission is checked via a permission getter function.

````javascript
angular.module('app').run(
    function (PermissionService) {
        PermissionService
            .define('ui.permission1', [
                'ui.permission2',
                function (obj) {
                    return obj.is_editable;
                }
            ])
            .define('ui.permission2', [
                'backend.permission1'
            ]);
        
        PermissionService
            .registerPermissionGetter(function (name) {
                // this may come from another service in your code
                var usersBePerms = [
                    'backend.permission1',
                    'backend.permission2'
                ];

                return usersBePerms.indexOf(name) !== -1;
            });
    });
````

This is how to check the permission in your template:
````html
<div ng-if="perms.has('ui.permission1')">
    Yay, permission, yay!
</div>
````

You can also check for backend permissions this way:
````html
<div ng-if="perms.has('backend.permission1')">
    Yay, permission, yay!
</div>
````


## Contributions

* Andreas Stocker <andreas@stocker.co.it>, Main developer


## License

Angular Perms,
Copyright 2016 Andreas Stocker,
MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
