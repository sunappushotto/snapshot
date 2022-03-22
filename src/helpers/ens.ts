import {
  ApolloClient,
  createHttpLink,
  InMemoryCache
} from '@apollo/client/core';

const uri =
  import.meta.env.VITE_DEFAULT_NETWORK === '10001'
    ? 'https://graph.bch.domains/subgraphs/name/graphprotocol/ens-amber'
    : 'https://graph.bch.domains/subgraphs/name/graphprotocol/ens';

const httpLink = createHttpLink({ uri });

export const ensApolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    addTypename: false
  }),
  defaultOptions: {
    query: {
      fetchPolicy: 'no-cache'
    }
  }
});
