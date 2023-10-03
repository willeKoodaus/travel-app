import { ApolloClient, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
  uri: 'http://localhost:3003/graphql',  // GraphQL server url goes here
  cache: new InMemoryCache()
});
