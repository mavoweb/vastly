/**
 * Recursively traverse the AST and return all variables and functions
 * @param {object} node  
 * @returns {object} an object with the list of variables and function
 *  in the form {variables: [...], functions: [...]}
 */
function getVariablesAndFunctions(node) {
    switch(node.type) {
        case "Literal":
            return {variables: [], functions: []};
        case "UnaryExpression":
            return getVariablesAndFunctions(node.argument);
        case "BinaryExpression":
            let right = getVariablesAndFunctions(node.right);
            // handles group(key: value)
            if (node.operator === ":") {
                return right;
            }
            let left = getVariablesAndFunctions(node.left);
            return combineResults(left, right);
        case "LogicalExpression":
            left = getVariablesAndFunctions(node.left);
            right = getVariablesAndFunctions(node.right);
            return combineResults(left, right);
        case "ConditionalExpression":
            const test = getVariablesAndFunctions(node.test);
            const consequent = getVariablesAndFunctions(node.consequent);
            const alternate = getVariablesAndFunctions(node.alternate);
            return combineResults(test, consequent, alternate);
        case "Compound":
            const body = node.body.map(getVariablesAndFunctions);
            return combineResults(...body);
        case "ArrayExpression":
            const elements = node.elements.map(getVariablesAndFunctions);
            return combineResults(...elements);
        case "CallExpression":
            let result = {
                variables: [],
                functions: [node]
            }
            const args = node.arguments.map(getVariablesAndFunctions);
            result = combineResults(result, ...args);
            // So we don't add identifiers like "if"
            if (node.callee.type !== "Identifier") {
                result = combineResults(result, getVariablesAndFunctions(node.callee));
            }
            return result;
        case "MemberExpression":
            const object = getVariablesAndFunctions(node.object);
            // Only recurse on the property if it is not an identifier
            const property = node.property.type === "Identifier" ? {variables: [], functions: []} : getVariablesAndFunctions(node.property);
            // If the object is also a member expression, return this one (the top most one)
            // along with the children of the properties
            if (object.variables[0] === node.object) {
                property.variables.unshift(node);
                object.variables.shift();
                return combineResults(property, object);
            }
            return combineResults(property, object);
        // Rest of the cases contain a single variable
        case "ThisExpression":
        case "Identifier":
        default:
            return {
                variables: [node],
                functions: []
            };
    }
}

function combineResults(...results) {
    return results.reduce((acc, cur) => {
        return {
            variables: acc.variables.concat(cur.variables),
            functions: acc.functions.concat(cur.functions)
        };
    }, {
        variables: [],
        functions: []
    });
}
