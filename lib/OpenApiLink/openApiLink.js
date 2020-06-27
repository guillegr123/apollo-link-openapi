"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenApiLink = void 0;
const apollo_link_1 = require("apollo-link");
const execute_1 = require("graphql/execution/execute");
const OpenApiToGraphQL_1 = require("../OpenApiToGraphQL");
class OpenApiLink extends apollo_link_1.ApolloLink {
    constructor({ schema, options = undefined }) {
        super();
        this.schema = OpenApiToGraphQL_1.createGraphQLSchema(schema, options).then(({ schema }) => schema);
    }
    request(operation) {
        return new apollo_link_1.Observable((observer) => {
            this.schema
                .then((schema) => execute_1.execute(schema, operation.query, undefined, //this.rootValue,
            operation.getContext(), operation.variables, operation.operationName))
                .then((data) => {
                if (!observer.closed) {
                    observer.next(data);
                    observer.complete();
                }
            })
                .catch((error) => {
                if (!observer.closed) {
                    observer.error(error);
                }
            });
        });
    }
}
exports.OpenApiLink = OpenApiLink;
exports.default = SwaggerSchemaLink;
//# sourceMappingURL=openApiLink.js.map