import { shuffle } from 'fantom-vue-components/src/utils/array.js';
import { HttpLink } from 'apollo-link-http';
import { ApolloLink } from 'apollo-link';
import FNetworkStatus from 'fantom-vue-components/src/components/FNetworkStatus/FNetworkStatus.vue';
import { setContext } from 'apollo-link-context';
import { getBearerToken } from '@/modules/account/auth.js';
import { onError } from 'apollo-link-error';
import { RetryLink } from 'apollo-link-retry';

export class FApolloClient {
    constructor({ apolloProviders = [], defaultProviderIndex = 'random', maxRetryLinkAttempts = Infinity }) {
        this.apolloProviders = apolloProviders;
        this.maxRetryLinkAttempts = maxRetryLinkAttempts;

        this.defaultProviderIndex = defaultProviderIndex;
        if (defaultProviderIndex === 'random') {
            this.defaultProviderIndex = Math.floor(Math.random() * this.apolloProviders.length);
        }

        this.netError = false;
        this.defaultHttpProvider = this.apolloProviders[this.defaultProviderIndex].http;
        this.httpProvider = this.defaultHttpProvider;
        this.httpApolloProviders = this.setHttpApolloProviders(this.apolloProviders, this.defaultHttpProvider);
        this.lastOperationName = '';
    }

    setHttpApolloProviders(_providers, _defaultHttpProvider) {
        const providers = _providers.map(_item => _item.http).filter(_value => _value !== _defaultHttpProvider);

        shuffle(providers);

        return providers;
    }

    resetHttpApolloProviders() {
        this.httpApolloProviders = this.setHttpApolloProviders(this.apolloProviders, this.defaultHttpProvider);
        this.lastOperationName = '';
    }

    getCurrentHttpProvider() {
        return this.httpProvider;
    }

    getHttpLink() {
        return new HttpLink({
            uri: this.httpProvider,
        });
    }

    getHttpAuthLink() {
        return setContext((operation, { headers }) => {
            const token = getBearerToken();

            const h = { ...headers };

            if (token) {
                h.authorization = 'Bearer ' + token;
            } else if ('authorization' in h) {
                delete h.authorization;
            }

            return {
                headers: h,
            };
        });
    }

    getErrorLink() {
        return onError(({ graphQLErrors, networkError }) => {
            if (graphQLErrors)
                graphQLErrors.forEach(({ message, locations, path }) =>
                    console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
                );
            if (networkError) {
                console.log(`[Network error]: ${networkError}`, networkError);

                if (!this.netError) {
                    this.netError = true;

                    // run "offline" a little later, because it can only be switching providers
                    setTimeout(() => {
                        if (this.netError) {
                            FNetworkStatus.offline();
                        }
                    }, 600);
                }

                this.resetHttpApolloProviders();
            }
        });
    }

    getNetErrorLink() {
        return new ApolloLink((operation, forward) => {
            return forward(operation).map(response => {
                if (this.netError) {
                    this.netError = false;
                    FNetworkStatus.online();
                }

                return response;
            });
        });
    }

    getRetryLink() {
        return new RetryLink({
            delay: {
                initial: 350,
                // max: Infinity,
                max: 6000,
                jitter: true,
            },
            attempts: {
                max: this.maxRetryLinkAttempts,
                retryIf: (_error, _operation) => {
                    // change http provider
                    if (
                        this.httpApolloProviders.length > 0 &&
                        (!this.lastOperationName || _operation.operationName === this.lastOperationName)
                    ) {
                        this.httpProvider = this.httpApolloProviders.pop();
                        this.lastOperationName = _operation.operationName;
                    }

                    return !!_error;
                },
            },
        });
    }
}
