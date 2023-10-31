/**
 * Recursively traverse the AST and return all variables and functions
 * @param {object} node  
 * @returns {object} an object with the list of variables and function
 *  in the form {variables: [...], functions: [...]}
 */
export default function extract(node) {
    switch(node.type) {
        case "Literal":
            return {variables: [], functions: []};
        case "UnaryExpression":
            return extract(node.argument);
        case "BinaryExpression":
            let right = extract(node.right);
            // handles group(key: value)
            if (node.operator === ":") {
                return right;
            }
            let left = extract(node.left);
            return combineResults(left, right);
        case "LogicalExpression":
            left = extract(node.left);
            right = extract(node.right);
            return combineResults(left, right);
        case "ConditionalExpression":
            const test = extract(node.test);
            const consequent = extract(node.consequent);
            const alternate = extract(node.alternate);
            return combineResults(test, consequent, alternate);
        case "Compound":
            const body = node.body.map(extract);
            return combineResults(...body);
        case "ArrayExpression":
            const elements = node.elements.map(extract);
            return combineResults(...elements);
        case "CallExpression":
            let result = {
                variables: [],
                functions: [node]
            }
            const args = node.arguments.map(extract);
            result = combineResults(result, ...args);
            // So we don't add identifiers like "if"
            if (node.callee.type !== "Identifier") {
                result = combineResults(result, extract(node.callee));
            }
            return result;
        case "MemberExpression":
            const objectChildren = extract(node.object);
            // Only recurse on the property if it is not an identifier
            const propertyChildren = node.property.type === "Identifier" ? {variables: [], functions: []} : extract(node.property);
            return combineResults(objectChildren, propertyChildren);
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
