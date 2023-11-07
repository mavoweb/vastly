import {setAll} from "./parents.js";

/**
 * Recursively traverse the AST and return all top-level identifiers
 * @param {object} node  
 * @param {object} [options]
 * @param {function(object): boolean} [options.filter] A function that returns true if the node should be included
 * @param {boolean} [options.addParents] If true, add a parent property to each node
 * @returns a list of all top-level identifiers
 */
export default function extractIdentifiers(node, {filter, addParents} = {}) {
    if (addParents) {
        setAll(node);
    }

    function _extractIdentifiers(node) {
        switch(node.type) {
            case "Literal":
                return []
            case "UnaryExpression":
                return _extractIdentifiers(node.argument);
            case "BinaryExpression":
            case "LogicalExpression":
                const {left, right} = node;
                return [left, right].flatMap(_extractIdentifiers);
            case "ConditionalExpression":
                const {test, consequent, alternate} = node;
                return [test, consequent, alternate].flatMap(_extractIdentifiers);
            case "Compound":
                return node.body.flatMap(_extractIdentifiers);
            case "ArrayExpression":
                return node.elements.flatMap(_extractIdentifiers);
            case "CallExpression":
                return [node.callee, ...node.arguments].flatMap(_extractIdentifiers);
            case "MemberExpression":
                const {object, property} = node;
                // only explore the property if it's a complex expression that might
                // have more identifiers
                const propertyChildren = property.type === "Identifier" ? [] : _extractIdentifiers(property);
                return _extractIdentifiers(object).concat(propertyChildren);
            // Rest of the cases contain a single variable
            // Also check for filter condition
            case "ThisExpression":
            case "Identifier":
            default:
                const result = [];
                if (!filter || (filter && filter(node))) {
                    result.push(node);
                }
                return result;
        }
    }

    return _extractIdentifiers(node);
}

