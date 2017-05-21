(function (root, factory) {
    var resolved = [],
        required = ["require","exports","module","angular"],
        i, len = required.length;

    if (typeof define === "function" && define.amd) {
        define("ngperms",["require","exports","module","angular"], factory);
    } else if (typeof exports === "object") {
        for (i = 0; i < len; i += 1) {
            resolved.push(require(required[i]));
        }

        module.exports = factory.apply({}, resolved);
    } else {
        for (i = 0; i < len; i += 1) {
            resolved.push(root[required[i]]);
        }

        root["ngperms"] = factory.apply({}, resolved);
    }
}(this, function (require,exports,module,angular) {
    
    /**
 * Angular Perms
 * Copyright 2016 Andreas Stocker
 * MIT License
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
 * Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 * WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
 * OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */


(function () {
    'use strict';

    var
        app = angular.module('ngPerms', [ ]);

})();

/**
 * Angular Perms
 * Copyright 2016 Andreas Stocker
 * MIT License
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
 * Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 * WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
 * OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

(function () {
    'use strict';

    var
        module = angular.module('ngPerms');

    /**
     * Provider for the PermissionService
     *
     * @name PermissionServiceProvider
     * @ngdoc provider
     */
    module.provider('PermissionService',
        function () {
            'ngInject';

            var
                provider = this,

                /**
                 * List of services to get permission from.
                 * @private
                 * @memberOf PermissionServiceProvider
                 * @type {Array}
                 */
                permissionGetters = [];

            /**
             * Registers a new permission getter function to get permissions from.
             * @memberOf PermissionServiceProvider
             * @param {Function} permissionGetterFn
             */
            provider.registerPermissionGetter = function (permissionGetterFn) {
                if (permissionGetters.indexOf(permissionGetterFn) !== -1) {
                    console.warn("PermissionServiceProvider: Given permission getter is already registered.");
                    return;
                }

                console.log("PermissionServiceProvider: Register new permission getter.");

                permissionGetters.push(permissionGetterFn);
            };

            /**
             * Unregisters a registered permission getter function.
             * @memberOf PermissionServiceProvider
             * @param {Function} permissionGetterFn
             */
            provider.unregisterPermissionGetter = function (permissionGetterFn) {
                var
                    getterIndex = permissionGetters.indexOf(permissionGetterFn),
                    getterFound = getterIndex !== -1;

                if (!getterFound) {
                    console.warn("PermissionServiceProvider: Given permission getter is not registered.");
                    return;
                }

                console.log("PermissionServiceProvider: Unregister given permission getter.");

                permissionGetters.splice(getterIndex, 1);
            };

            /**
             * Gets the actual service object.
             * @name PermissionService
             * @ngdoc factory
             * @returns {Object}
             */
            provider.$get = ['$rootScope', function ($rootScope) {
                'ngInject';

                var
                    self = {},

                    /**
                     * Prototype of all angular scopes.
                     * @private
                     * @memberOf PermissionService
                     * @type {Object}
                     */
                    scopePrototype = Object.getPrototypeOf($rootScope),

                    /**
                     * Mapping for permission aliases to permission check functions.
                     * @private
                     * @memberOf PermissionService
                     * @type {{}}
                     */
                    permMapping = {};

                /**
                 * Defines a permission alias used in the UI
                 * @memberOf PermissionService
                 * @param name
                 * @param perms
                 * @return {*}
                 */
                self.define = function (name, perms) {
                    console.log("PermissionService: Define permission alias '" + name + "'.");

                    // make sure we are working on an array of permissions
                    perms = angular.isArray(perms) ? perms : [perms];

                    var
                        /**
                         * Checks if all permission conditions validate to true. A permission
                         * condition can either be a function or a string (permission name).
                         * @return {boolean}
                         */
                        checkFn = function (args) {
                            for (var i = 0; i < perms.length; i++) {
                                var
                                    perm = perms[i];

                                // if perm is a function, call it with the PermissionService
                                // as a first argument.
                                if (angular.isFunction(perm)) {
                                    if (!perm.apply(self, args)) {
                                        return false;
                                    }
                                }

                                // if perm is a string, use the has method to check for the
                                // permission. this checks for other permission aliases, or
                                // backend permissions.
                                else if (angular.isString(perm)) {
                                    if (!self.has(perm)) {
                                        return false;
                                    }
                                }

                                // if perm is neither a string nor a function, default
                                // to false.
                                else {
                                    console.error("PermissionService: Given permission condition is neither a function nor a string.");
                                    return false;
                                }
                            }

                            return true;
                        };

                    // publish the permission alias in the mapping
                    permMapping[name] = checkFn;

                    return self;
                };

                /**
                 * Checks if the currently logged in user has permission for the given permission alias.
                 * @memberOf PermissionService
                 * @param name
                 * @return {boolean}
                 */
                self.has = function (name) {
                    console.log("PermissionService: Check permission '" + name + "'.");

                    var
                        args = Array.prototype.slice.call(arguments, 1),
                        i;

                    // check if the asked permission alias exists. if not, check
                    // the registered permission getters. if any of them grands the
                    // permission, the check is passed.
                    if (!permMapping.hasOwnProperty(name)) {
                        for (i = 0; i < permissionGetters.length; i++) {
                            if (permissionGetters[i](name)) {
                                return true;
                            }
                        }

                        return false;
                    }

                    return !!permMapping[name](args);
                };

                /*
                 * Publish the register and unregister methods for permission getters on
                 * the service as well.
                 */
                self.registerPermissionGetter = provider.registerPermissionGetter;
                self.unregisterPermissionGetter = provider.unregisterPermissionGetter;

                /*
                 * Publish permission function on the root scope prototype so they are available in
                 * all templates.
                 */
                scopePrototype.perms = {};
                scopePrototype.perms.has = self.has;

                return self;
            }]
        }
    );
})();
    return angular.module("ngPerms");
    
}));