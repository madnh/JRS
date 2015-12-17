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

        var self = this;
        if (arguments.length) {
            var arg_length = arguments.length;
            var override = typeof arguments[arg_length - 1] === 'boolean' ? Boolean(arguments[arg_length - 1]) : true;
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                self.import(arg, override);
            });
        }
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

        return this;
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

        return this;
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

        return this;
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

        return this;
    };

    JRS.prototype.fields = function () {
        return extend(this._fields);
    };
    JRS.prototype.hasField = function (field) {
        return this._fields.hasOwnProperty(field);
    };
    JRS.prototype.addField = function (name, value) {
        if (name instanceof Object) {
            var thisMethod = arguments.callee;
            name.forEach(function (v, k) {
                thisMethod(k, v);
            });
        } else {
            if (name === 'meta' || name === 'data') {
                throw new Error('Invalid field name: ' + name + '. This field name is protected');
            }
            this._fields[name] = value;
        }

        return this;
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

        return this;
    };

    JRS.prototype.toJSON = function () {
        var result = {};

        /**
         * Add _meta
         */
        if (this._meta) {
            result.meta = extend(this._meta);
        }

        /**
         * Add Data
         */
        if (isArray(this._data)) {
            result.data = this._data.concat();
        } else {
            result.data = extend(this._data);
        }

        this._fields['meta'] = undefined;
        this._fields['data'] = undefined;
        delete this._fields['meta'];
        delete this._fields['data'];

        result = extend(result, this._fields);

        return result;
    };
    JRS.prototype.valueOf = function () {
        return this.toJSON();
    };
    JRS.prototype.toString = function () {
        return JSON.stringify(this.toJSON());
    };

    JRS.prototype.export = function () {
        return {
            meta: extend({}, this._meta),
            data: extend({}, this._data),
            fields: extend({}, this._fields)
        };
    };

    JRS.prototype.import = function (exported_data, override) {
        var self = this;
        if (!isObject(exported_data)) {
            return this;
        }
        if (exported_data instanceof this.constructor) {
            exported_data = exported_data.export();
        }
        exported_data = extend({
            meta: {},
            data: {},
            fields: {}
        }, exported_data);

        Object.keys(exported_data.meta).forEach(function (name) {
            if (!self.hasMeta(name) || override) {
                self.addMeta(name, exported_data.meta[name]);
            }
        });
        Object.keys(exported_data.data).forEach(function (name) {
            if (!self.hasData(name) || override) {
                self.addData(name, exported_data.data[name]);
            }
        });
        Object.keys(exported_data.fields).forEach(function (name) {
            if ((name !== 'meta' && name !== 'data') && (!self.hasField(name) || override)) {
                self.addField(name, exported_data.fields[name]);
            }
        });

        return this;
    };

    if (typeof module === 'object' && module.hasOwnProperty('exports')) {
        module.exports = JRS;
    } else {
        this.JRS = JRS;
    }
})();