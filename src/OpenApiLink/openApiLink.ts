import { ApolloLink, Operation, FetchResult, Observable } from 'apollo-link';
import { execute } from 'graphql/execution/execute';
import { GraphQLSchema } from 'graphql';

import { Options as OtgOptions } from '../OpenApiToGraphQL/types/options'
import { Oas3 } from '../OpenApiToGraphQL/types/oas3'
import { Oas2 } from '../OpenApiToGraphQL/types/oas2'
import { createGraphQLSchema } from '../OpenApiToGraphQL';

export namespace OpenApiLink {
  export interface Options<TSource, TContext, TArgs> {
    schema: Oas3 | Oas2 | (Oas3 | Oas2)[];
    options?: OtgOptions<TSource, TContext, TArgs>;
  }
}

export class OpenApiLink<TSource, TContext, TArgs> extends ApolloLink {
  public schema: Promise<GraphQLSchema>;

  constructor({ schema, options = undefined }: OpenApiLink.Options<TSource, TContext, TArgs>) {
    super();

    this.schema = createGraphQLSchema(schema, options).then(({ schema }) => schema);
  }

  public request(operation: Operation): Observable<FetchResult> | null {
    return new Observable<FetchResult>((observer) => {
      this.schema
        .then((schema) =>
          execute(
            schema,
            operation.query,
            undefined, //this.rootValue,
            operation.getContext(),
            operation.variables,
            operation.operationName
          )
        )
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
