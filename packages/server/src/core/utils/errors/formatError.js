"use strict";
exports.__esModule = true;
exports.formatError = void 0;
// import apm from 'elastic-apm-node';
var uuid_1 = require("uuid");
var graphql_1 = require("graphql");
var apollo_server_core_1 = require("apollo-server-core");
var common_1 = require("@nestjs/common");
var errors_1 = require("../../constants/errors");
var TooManyRequestsException_error_1 = require("./TooManyRequestsException.error");
var formatValidationConstraints = function (item, index) {
    return item.constraints
        ? Object.values(item.constraints).map(function (constraint) { return ({
            key: constraint,
            value: item.property !== 'password' ? item.value : null,
            property: item.property,
            index: index
        }); })
        : [];
};
var getNestedValidationsError = function (errors, parentProperty) {
    return errors.flatMap(function (error) {
        if ((error === null || error === void 0 ? void 0 : error.children) && (error === null || error === void 0 ? void 0 : error.children.length) > 0) {
            return getNestedValidationsError(error.children, error.property);
        }
        if (error.constraints && Object.keys(error.constraints).length > 0) {
            var index = typeof parentProperty === 'object'
                ? null
                : typeof parentProperty !== 'number' && parentProperty !== undefined
                    ? parseInt(parentProperty, 10)
                    : parentProperty;
            return formatValidationConstraints(error, index ? +index : null);
        }
    });
};
var logAndCaptureError = function (_a) {
    var errorCode = _a.errorCode, errId = _a.errId, error = _a.error, formattedError = _a.formattedError;
    common_1.Logger.error({
        errorCode: errorCode,
        errId: errId,
        error: error,
        formattedError: formattedError
    });
    // apm.captureError(errorCode, {
    //   custom: {
    //     errId,
    //     formattedError,
    //     error,
    //   },
    // });
};
var formatError = function (error) {
    var _a, _b;
    var errId = (0, uuid_1.v4)();
    if (!error.originalError) {
        logAndCaptureError({ errId: errId, error: error, errorCode: errors_1.INTERNAL_SERVER_ERROR });
        return new graphql_1.GraphQLError("Internal Error: ".concat(errId));
    }
    var originalMessage = error.originalError.message;
    var errorCode = (_a = error.extensions) === null || _a === void 0 ? void 0 : _a.code;
    // if we forgot to provide required input or output fields
    if (error.name === 'ValidationError') {
        var formattedError = {
            extensions: {
                code: errorCode,
                status: 422
            },
            message: originalMessage
        };
        logAndCaptureError({ errId: errId, formattedError: formattedError, error: error, errorCode: errorCode });
        return formattedError;
    }
    if (error.originalError instanceof apollo_server_core_1.ApolloError) {
        var path = error.path, message = error.message;
        var formattedError = {
            path: path,
            extensions: {
                code: errorCode
            },
            message: message
        };
        logAndCaptureError({ errId: errId, formattedError: formattedError, error: error, errorCode: errorCode });
        return formattedError;
    }
    if (error.originalError instanceof common_1.BadRequestException) {
        var path = error.path;
        var validationErrors = ((_b = error === null || error === void 0 ? void 0 : error.extensions) === null || _b === void 0 ? void 0 : _b.exception).response.message;
        if (validationErrors && validationErrors.length > 0) {
            var baseError = {
                path: path,
                extensions: {
                    code: errors_1.BAD_USER_INPUT,
                    statusCode: 422
                },
                message: {}
            };
            var formattedError = validationErrors.reduce(function (newValidationError, item) {
                if ((item === null || item === void 0 ? void 0 : item.children) && item.children.length > 0) {
                    newValidationError.message[item.property] =
                        getNestedValidationsError(item.children, item.property);
                    return newValidationError;
                }
                newValidationError.message[item.property] =
                    formatValidationConstraints(item);
                return newValidationError;
            }, baseError);
            logAndCaptureError({
                errId: errId,
                formattedError: formattedError,
                error: error,
                errorCode: errors_1.BAD_USER_INPUT
            });
            return formattedError;
        }
    }
    if (error.originalError instanceof common_1.ForbiddenException ||
        error.originalError instanceof common_1.UnauthorizedException) {
        var path = error.path;
        var _c = error.originalError.getResponse(), nestError = _c.error, message = _c.message, statusCode = _c.statusCode;
        var formattedError = {
            path: path,
            extensions: {
                code: nestError.toUpperCase(),
                statusCode: statusCode
            },
            message: message
        };
        logAndCaptureError({
            errorCode: nestError.toUpperCase(),
            errId: errId,
            error: error,
            formattedError: formattedError
        });
        return formattedError;
    }
    if (error.originalError instanceof TooManyRequestsException_error_1.TooManyRequestsException) {
        var path = error.path;
        var _d = error.originalError.getResponse(), code = _d.code, message = _d.error, statusCode = _d.statusCode;
        var formattedError = {
            path: path,
            extensions: {
                code: code,
                statusCode: statusCode
            },
            message: message
        };
        logAndCaptureError({ errId: errId, errorCode: code, formattedError: formattedError, error: error });
        return formattedError;
    }
    logAndCaptureError({ errId: errId, error: error, errorCode: errors_1.INTERNAL_SERVER_ERROR });
    return new graphql_1.GraphQLError("Internal Error: ".concat(errId));
};
exports.formatError = formatError;
