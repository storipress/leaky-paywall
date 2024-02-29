/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n      mutation VerifySubscriberEmail($token: String!) {\n        verifySubscriberEmail(token: $token)\n      }\n    ": types.VerifySubscriberEmailDocument,
    "\n      mutation SignInSubscriber($token: String!) {\n        signInSubscriber(token: $token)\n      }\n    ": types.SignInSubscriberDocument,
    "\n      mutation SignInPaywall($email: EmailString!) {\n        signInLeakySubscriber(input: { email: $email })\n      }\n    ": types.SignInPaywallDocument,
    "\n      mutation TrackSubscriberActivity($input: TrackSubscriberActivityInput!) {\n        trackSubscriberActivity(input: $input)\n      }\n    ": types.TrackSubscriberActivityDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation VerifySubscriberEmail($token: String!) {\n        verifySubscriberEmail(token: $token)\n      }\n    "): (typeof documents)["\n      mutation VerifySubscriberEmail($token: String!) {\n        verifySubscriberEmail(token: $token)\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation SignInSubscriber($token: String!) {\n        signInSubscriber(token: $token)\n      }\n    "): (typeof documents)["\n      mutation SignInSubscriber($token: String!) {\n        signInSubscriber(token: $token)\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation SignInPaywall($email: EmailString!) {\n        signInLeakySubscriber(input: { email: $email })\n      }\n    "): (typeof documents)["\n      mutation SignInPaywall($email: EmailString!) {\n        signInLeakySubscriber(input: { email: $email })\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation TrackSubscriberActivity($input: TrackSubscriberActivityInput!) {\n        trackSubscriberActivity(input: $input)\n      }\n    "): (typeof documents)["\n      mutation TrackSubscriberActivity($input: TrackSubscriberActivityInput!) {\n        trackSubscriberActivity(input: $input)\n      }\n    "];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;