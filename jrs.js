/***************************************************************************
 *   JRS - JSON Request Structure                                          *
 *   @version 0.1.1                                                        *
 *   @author MaDnh                                                         *
 *   @email dodanhmanh@gmail.com                                           *
 *   @license MIT                                                          *
 *                                                                         *
 ***************************************************************************/
(function () {

    function isObject(value) {
        return value instanceof Object;
    }

    function isArray(value) {
        return value.constructor.name === 'Array';
    }

    function asArray(value) {
        return isArray(value) ? value : [value];
    }

    function isUndefined(value) {
        return typeof value === 'undefined';
    }

    function extend() {
        var result = {};

        Array.prototype.slice.call(arguments, 0).forEach(function (obj) {
            if (isObject(obj)) {
                Object.keys(obj).forEach(function (key) {
                    result[key] = obj[key];
                });
            }
        });

        return result;
    }

    /**
     * JRS - JSON Request Structure
     * @property {{}} _fields The fields of JSR
     * @property {{}} _data The data of JSR
     * @property {{}} _meta The meta of JSR
     */
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

    /**
     * Set data as array of items
     * @param {boolean} as_array True - as array, else as object
     * @returns {JRS}
     */
    JRS.prototype.dataAsArray = function (as_array) {
        this._data = as_array ? [] : {};

        return this;
    };

    /**
     * Get data by name or all data, depend on length of arguments
     * @param {string} name Name of data to return
     * @param {*} [default_value = undefined] Default value as result when data name is not found. Default is undefined
     * @returns {*}
     */
    JRS.prototype.data = function (name, default_value) {
        if (!isUndefined(name)) {
            if (this._data.hasOwnProperty(name)) {
                return this._data[name];
            }
            return default_value;
        }
        return extend(this._data);
    };

    /**
     * Check if data with name already exists
     * @param {string} name Data name
     * @returns {boolean}
     */
    JRS.prototype.hasData = function (name) {
        return this._data.hasOwnProperty(name);
    };

    /**
     * Add data with name or object of data name and value
     * @param {(string|name)} name Name of data. If is object then add each item of it
     * @param {*} value Data value. Ignored when param name is object
     * @returns {JRS}
     */
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
            if (isObject(name)) {
                var self = this;
                Object.keys(name).forEach(function (index) {
                    self._data[index] = name[index];
                });
            } else {
                this._data[name] = value;
            }
        }

        return this;
    };

    /**
     * Remove data by name, multi name is supported
     * @returns {JRS}
     */
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

    /**
     * Get meta by name or all meta, depend on length of arguments
     * @param {string} name Name of meta to return
     * @param {*} [default_value = undefined] Default value as result when meta name is not found. Default is undefined
     * @returns {*}
     */
    JRS.prototype.meta = function (name, default_value) {
        if (!isUndefined(name)) {
            if (this._meta.hasOwnProperty(name)) {
                return this._meta[name];
            }
            return default_value;
        }
        return extend(this._meta);
    };

    /**
     * Check if meta with name already exists
     * @param {string} name Meta name
     * @returns {boolean}
     */
    JRS.prototype.hasMeta = function (name) {
        return this._meta.hasOwnProperty(name);
    };

    /**
     * Add meta with name or object of meta name and value
     * @param {(string|name)} name Name of meta. If is object then add each item of it
     * @param {*} value Meta value. Ignored when param name is object
     * @returns {JRS}
     */
    JRS.prototype.addMeta = function (name, value) {
        if (name instanceof Object) {
            var self = this;
            Object.keys(name).forEach(function (index) {
                self._meta[index] = name[index];
            });
        } else {
            this._meta[name] = value;
        }

        return this;
    };

    /**
     * Remove meta by name, multi name is supported
     * @returns {JRS}
     */
    JRS.prototype.removeMeta = function () {
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


    /**
     * Get field by name or all fields, depend on length of arguments
     * @param {string} name Name of field to return
     * @param {*} [default_value = undefined] Default value as result when field name is not found. Default is undefined
     * @returns {*}
     */
    JRS.prototype.fields = function (name, default_value) {
        if (!isUndefined(name)) {
            if (this._fields.hasOwnProperty(name)) {
                return this._fields[name];
            }
            return default_value;
        }
        return extend(this._fields);
    };

    /**
     * Check if a field with name already exists
     * @param {string} field Field name
     * @returns {boolean}
     */
    JRS.prototype.hasField = function (field) {
        return this._fields.hasOwnProperty(field);
    };

    /**
     * Add field with name or object of fields name and value
     * @param {(string|name)} name Name of field. If is object then add each item of it
     * @param {*} value Field value. Ignored when param name is object
     * @returns {JRS}
     */
    JRS.prototype.addField = function (name, value) {
        if (isObject(name)) {
            var self = this;
            var thisMethod = arguments.callee;
            Object.keys(name).forEach(function (index) {
                thisMethod.apply(self, [index, name[index]]);
            });
        } else {
            if (name === 'meta' || name === 'data') {
                throw new Error('Invalid field name: ' + name + '. This field name is protected');
            }
            this._fields[name] = value;
        }

        return this;
    };

    /**
     * Remove field by name, multi name is supported
     * @returns {JRS}
     */
    JRS.prototype.removeField = function () {
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

    /**
     * Export as JSON object, ready for request
     * @returns {{}}
     */
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

    /**
     * Export as JSON object, ready for request
     * @returns {{}}
     */
    JRS.prototype.valueOf = function () {
        return this.toJSON();
    };

    /**
     * Export as JSON string
     * @returns {string}
     */
    JRS.prototype.toString = function () {
        return JSON.stringify(this.toJSON());
    };

    /**
     * Export to object of meta, data and fields
     * @returns {{meta: *, data: *, fields: *}}
     */
    JRS.prototype.export = function () {
        return {
            meta: extend({}, this._meta),
            data: extend({}, this._data),
            fields: extend({}, this._fields)
        };
    };

    /**
     * Import from exported data or other instance of JRS
     * @param {({}|JRS)}exported_data
     * @param {boolean} override Override existed meta, data, field??
     * @returns {JRS}
     */
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


    /**
     * Transform old request data to new JRS instance
     * @param {{}} obj Old request data
     * @param {{}} option Guide for importing.
     * Includes: meta, data and fields.
     * Priority: data >> meta >> fields.
     * Each item of this guide can be true or array of string.
     * If True then add all current keys of Old request data.
     * If is array of string then add those keys of Old request data.
     *
     * @returns {JRS}
     */
    JRS.transform = function (obj, option) {
        var jrs = new JRS();
        obj = extend({}, obj);
        option = extend({
            meta: [],
            data: true,
            fields: []
        }, isObject(option) ? option : {});

        if (option.data === true) {
            jrs.addData(obj);
        } else {
            asArray(option.data).forEach(function (data_name) {
                if (obj.hasOwnProperty(data_name)) {
                    jrs.addData(data_name, obj[data_name]);

                    obj[data_name] = undefined;
                    delete obj[data_name];
                }
            });

            if (option.meta === true) {
                jrs.addMeta(obj);
            } else {
                asArray(option.meta).forEach(function (meta_name) {
                    if (obj.hasOwnProperty(meta_name)) {
                        jrs.addMeta(meta_name, obj[meta_name]);

                        obj[meta_name] = undefined;
                        delete obj[meta_name];
                    }
                });

                if (option.fields === true) {
                    jrs.addField(obj);
                } else {
                    asArray(option.fields).forEach(function (field_name) {
                        if (obj.hasOwnProperty(field_name)) {
                            jrs.addMeta(field_name, obj[field_name]);

                            obj[field_name] = undefined;
                            delete obj[field_name];
                        }
                    });
                }
            }
        }

        return jrs;
    };

    if (typeof module === 'object' && module.hasOwnProperty('exports')) {
        module.exports = JRS;
    } else {
        this.JRS = JRS;
    }
})();