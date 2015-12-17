/***************************************************************************
 *   JRS - JSON Request Structure                                           *
 *   @version: 0.1.1                                                        *
 *   @author: MaDnh                                                         *
 *   @email: dodanhmanh@gmail.com                                           *
 *   @license: MIT                                                          *
 *                                                                          *
 ***************************************************************************/
(function () {

    function isObject(value) {
        return value instanceof Object;
    }

    function isArray(value) {
        return value.constructor.name === 'Array';
    }

    function isUndefined(value) {
        return typeof value === 'undefined';
    }

    function extend() {
        var result = {};

        Array.prototype.slice.call(arguments, 0).forEach(function (obj) {
            Object.keys(obj).forEach(function (key) {
                result[key] = obj[key];
            });
        });

        return result;
    }

    function JRS() {
        this._fields = {};
        this._data = {};
        this._meta = {};
    }

    JRS.prototype.dataAsArray = function (as_array) {
        this._data = as_array ? [] : {};

        return this;
    };
    JRS.prototype.data = function (name) {
        if (arguments.length > 0) {
            return this._data[arguments[0].toString()];
        }
        return extend(this._data);
    };
    JRS.prototype.hasData = function (name) {
        return this._data.hasOwnProperty(name);
    };
    JRS.prototype.addData = function (name, value) {
        if (isArray(this._data)) {
            if (isUndefined(value)) {
                this._data.push(name);
            } else {
                var obj = {};
                obj[name] = value;

                this._data.push(obj);
            }
        } else {
            if (name instanceof Object) {
                var self = this;
                name.forEach(function (v, k) {
                    self._data[k] = v;
                });
            } else {
                this._data[name] = value;
            }
        }
    };

    JRS.prototype.removeData = function () {
        if (arguments.length === 0) {
            if (isArray(this._data)) {
                this._data = [];
            } else {
                this._data = {};
            }
        } else {
            var self = this;
            var names = Array.prototype.slice.call(arguments, 0);
            if (isArray(this._data)) {
                names.forEach(function (name) {
                    if (self._data.hasOwnProperty(name)) {
                        self._data.splice(name, 1);
                    }
                });
            } else {
                names.forEach(function (name) {
                    if (self._data.hasOwnProperty(name)) {
                        self._data[name] = undefined;
                        delete self._data[name];
                    }
                });
            }
        }
    };

    JRS.prototype.meta = function (name) {
        if (arguments.length > 0) {
            return this._meta[arguments[0].toString()];
        }
        return extend(this._meta);
    };
    JRS.prototype.hasMeta = function (name) {
        return this._meta.hasOwnProperty(name);
    };
    JRS.prototype.addMeta = function (name, value) {
        if (name instanceof Object) {
            var self = this;
            name.forEach(function (v, k) {
                self._meta[k] = v;
            });
        } else {
            this._meta[name] = value;
        }

    };
    JRS.prototype.removeMeta = function (name) {
        if (arguments.length === 0) {
            this._meta = {};
        } else {
            var self = this;
            Array.prototype.slice.call(arguments, 0).forEach(function (name) {
                if (self._meta.hasOwnProperty(name)) {
                    self._meta[name] = undefined;
                    delete self._meta[name];
                }
            });
        }
    };

    JRS.prototype.fields = function () {
        return extend(this._fields);
    };
    JRS.prototype.hasField = function (field) {
        return this._fields.hasOwnProperty(field);
    };
    JRS.prototype.addField = function (name, value) {
        if (name instanceof Object) {
            var self = this;
            name.forEach(function (v, k) {
                self._fields[k] = v;
            });
        } else {
            this._fields[name] = value;
        }
    };
    JRS.prototype.removeFields = function () {
        if (arguments.length === 0) {
            this._fields = {};
        } else {
            var self = this;
            Array.prototype.slice.call(arguments, 0).forEach(function (name) {
                if (self._fields.hasOwnProperty(name)) {
                    self._fields[name] = undefined;
                    delete self._fields[name];
                }
            });

        }
    };

    JRS.prototype.toJSON = function () {
        var result = {};

        /**
         * Add _meta
         */
        if (this._meta) {
            result.meta = extend(this._meta);
        }

        if (isArray(this._data)) {
            result.data = this._data.concat();
        } else {
            result.data = extend(this._data);
        }

        return result;
    };
    JRS.prototype.valueOf = function () {
        return this.toJSON();
    };
    JRS.prototype.toString = function () {
        return JSON.stringify(this.toJSON());
    };

    if (!isUndefined(module) && isObject(module) && module.hasOwnProperty('exports')) {
        module.exports = JRS;
    } else {
        this.JRS = JRS;
    }
})();