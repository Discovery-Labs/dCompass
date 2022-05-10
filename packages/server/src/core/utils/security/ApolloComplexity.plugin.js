"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.ApolloComplexityPlugin = void 0;
var graphql_1 = require("graphql");
var graphql_query_complexity_1 = require("graphql-query-complexity");
var common_1 = require("@nestjs/common");
var ApolloComplexityPlugin = /** @class */ (function () {
    function ApolloComplexityPlugin(maxComplexity) {
        this.maxComplexity = maxComplexity;
    }
    ApolloComplexityPlugin.prototype.serverWillStart = function (service) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.schema = service.schema;
                return [2 /*return*/];
            });
        });
    };
    ApolloComplexityPlugin.prototype.requestDidStart = function () {
        var _this = this;
        return {
            didResolveOperation: function (_a) {
                var request = _a.request, document = _a.document;
                return __awaiter(_this, void 0, void 0, function () {
                    var complexity;
                    return __generator(this, function (_b) {
                        complexity = (0, graphql_query_complexity_1.getComplexity)({
                            schema: this.schema,
                            // To calculate query complexity properly,
                            // we have to check if the document contains multiple operations
                            // and eventually extract it operation from
                            // the whole query document.
                            query: request.operationName
                                ? (0, graphql_1.separateOperations)(document)[request.operationName]
                                : document,
                            // The variables for our GraphQL query
                            variables: request.variables,
                            // Add any number of estimators.
                            // The estimators are invoked in order, the first
                            // numeric value that is being returned by
                            // an estimator is used as the field complexity.
                            // If no estimator returns a value, an exception is raised.
                            estimators: [
                                // Using fieldExtensionsEstimator is mandatory
                                // to make it work with type-graphql.
                                (0, graphql_query_complexity_1.fieldExtensionsEstimator)(),
                                // Add more estimators here...
                                // This will assign each field a complexity of 1
                                // if no other estimator returned a value.
                                (0, graphql_query_complexity_1.simpleEstimator)({ defaultComplexity: 1 }),
                            ]
                        });
                        // Here we can react to the calculated complexity,
                        // like compare it with max and throw error when
                        // the threshold is reached.
                        if (complexity >= this.maxComplexity) {
                            throw new common_1.PayloadTooLargeException("Too complicated query (complexity: ".concat(complexity, ", max complexity: ").concat(this.maxComplexity, ")"));
                        }
                        complexity > 0 &&
                            common_1.Logger.warn("Used query complexity points: ".concat(complexity));
                        return [2 /*return*/];
                    });
                });
            }
        };
    };
    return ApolloComplexityPlugin;
}());
exports.ApolloComplexityPlugin = ApolloComplexityPlugin;
