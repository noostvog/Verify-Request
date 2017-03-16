"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parser = require('./pegparser.js');
function createJSONFromSpecification(json, url, httpmethod) {
    var entrypoint = json.paths[url][httpmethod.toLowerCase()];
    var customDefinitions = parseCustomDefinitions(json["x-constraint-definitions"]);
    var reqs = entrypoint["x-constraints"];
    if (reqs == undefined) {
        reqs = [];
    }
    var sfreqs = collectSingleFieldReqs(entrypoint.parameters);
    var jsonreqs = sfreqs;
    for (let req of reqs) {
        jsonreqs.push(parser.parse(req, { customDefs: customDefinitions }));
    }
    return jsonreqs;
}
exports.createJSONFromSpecification = createJSONFromSpecification;
function collectSingleFieldReqs(parameters) {
    var collected = [];
    for (let par of parameters) {
        var required = par.required;
        var type = par.type;
        var parenum = par.enum;
        var minimum = par.minimum;
        var maximum = par.maximum;
        var maxlength = par.maxLength;
        var minlength = par.minLength;
        var maxitems = par.maxItems;
        var minitems = par.minItems;
        if (type) {
            collected.push({ left_get: "type", left_arg: par.name, operator: "==", right: type });
        }
        ;
        if (required) {
            collected.push({ expression: "present", arguments: [par.name] });
        }
        ;
        if (parenum) {
            var result = parenum.map((x) => { return { left_get: "value", left_arg: par.name, operator: "==", right: x }; });
            collected.push({ expression: "OR", arguments: result });
        }
        if (minimum) {
            var exclMin = par.exclusiveMinimum;
            if (exclMin == true) {
                collected.push({ left_get: "value", left_arg: par.name, operator: ">", right: minimum });
            }
            else {
                collected.push({ left_get: "value", left_arg: par.name, operator: ">=", right: minimum });
            }
        }
        if (maximum) {
            var exclMax = par.exclusiveMaximum;
            if (exclMax == true) {
                collected.push({ left_get: "value", left_arg: par.name, operator: "<", right: maximum });
            }
            else {
                collected.push({ left_get: "value", left_arg: par.name, operator: "<=", right: maximum });
            }
        }
        if (minlength) {
            collected.push({ left_get: "string-length", left_arg: par.name, operator: ">=", right: minlength });
        }
        if (maxlength) {
            collected.push({ left_get: "string-length", left_arg: par.name, operator: "<=", right: maxlength });
        }
        if (minitems) {
            collected.push({ left_get: "array-length", left_arg: par.name, operator: ">=", right: minitems });
        }
        if (maxitems) {
            collected.push({ left_get: "array-length", left_arg: par.name, operator: "<=", right: maxitems });
        }
    }
    return collected;
}
function parseCustomDefinitions(defs) {
    return defs.map(function (def) {
        var i = def.indexOf(":=");
        var customDef = def.substring(0, i).trim();
        var h = def.indexOf("(");
        var name = customDef.substring(0, h).trim();
        var params = customDef.substring(h + 1, customDef.length - 1).split(",");
        var customBody = def.substring(i + 2, def.length).trim();
        return [name, params.map(function (x) { return x.trim(); }), parser.parse(customBody)];
    });
}
