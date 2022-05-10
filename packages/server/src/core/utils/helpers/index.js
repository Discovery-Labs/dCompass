"use strict";
exports.__esModule = true;
function removeNulls(obj) {
    if (obj === null) {
        return undefined;
    }
    if (typeof obj === "object") {
        for (var key in obj) {
            obj[key] = removeNulls(obj[key]);
        }
    }
    return obj;
}
exports["default"] = removeNulls;
