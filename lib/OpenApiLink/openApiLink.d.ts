import { ApolloLink, Operation, FetchResult, Observable } from 'apollo-link';
import { GraphQLSchema } from 'graphql';
import { Options as OtgOptions } from '../OpenApiToGraphQL/types/options';
import { Oas3 } from '../OpenApiToGraphQL/types/oas3';
import { Oas2 } from '../OpenApiToGraphQL/types/oas2';
export declare namespace OpenApiLink {
    interface Options<TSource, TContext, TArgs> {
        schema: Oas3 | Oas2 | (Oas3 | Oas2)[];
        options?: OtgOptions<TSource, TContext, TArgs>;
    }
}
export declare class OpenApiLink<TSource, TContext, TArgs> extends ApolloLink {
    schema: Promise<GraphQLSchema>;
    constructor({ schema, options }: OpenApiLink.Options<TSource, TContext, TArgs>);
    request(operation: Operation): Observable<FetchResult> | null;
}
