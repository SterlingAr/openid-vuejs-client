import { AuthorizationRequest } from '@openid/appauth/built/authorization_request';
import { LocalStorageBackend, DefaultCrypto, RevokeTokenRequest } from '@openid/appauth';
import {
    AuthorizationNotifier
} from '@openid/appauth/built/authorization_request_handler';
import { RedirectRequestHandler } from '@openid/appauth/built/redirect_based_handler';
import { AuthorizationServiceConfiguration } from '@openid/appauth/built/authorization_service_configuration';
import {
    BaseTokenRequestHandler
} from '@openid/appauth/built/token_request_handler';
import {
    GRANT_TYPE_AUTHORIZATION_CODE,
    GRANT_TYPE_REFRESH_TOKEN,
    TokenRequest
} from '@openid/appauth/built/token_request';

import { NoHashQueryStringUtils } from '@/custom_utils.ts';

export class AuthFlow
{
    configuration;
    authConfig;
    notifier;
    code;
    authorizationHandler;
    tokenHandler;
    tokens;
    request;

    constructor (authConfig)
    {
        this.authConfig = authConfig;
        this.notifier = new AuthorizationNotifier();

        this.authorizationHandler = new RedirectRequestHandler(
            new LocalStorageBackend(),
            new NoHashQueryStringUtils(),
            window.location,
            new DefaultCrypto()
        );

        this.notifier.setAuthorizationListener((request, response, error) =>
        {
            console.log(error);
            this.request = request;
            if (response)
            {
                this.code = response.code;
            }
        });

        this.authorizationHandler.setAuthorizationNotifier(this.notifier);
    }

    startAuthorizationFlow ()
    {
        this._fetchServiceConfiguration().then(() =>
        {
            this._makeAuthorizationRequest();
        });
    }

    fetchTokensIfPossible ()
    {
        return this._fetchServiceConfiguration().then(() =>
        {
            return this.authorizationHandler
                .completeAuthorizationRequestIfPossible()
                .then(() =>
                {
                    if (this.code)
                    {
                        let extras;
                        if (this.request && this.request.internal)
                        {
                            extras = {};
                            extras.code_verifier = this.request.internal['code_verifier'];
                        }
                        let request = new TokenRequest({
                            client_id: this.authConfig.clientConfig.clientId,
                            redirect_uri: this.authConfig.clientConfig.redirectUri,
                            grant_type: GRANT_TYPE_AUTHORIZATION_CODE,
                            code: this.code,
                            extras: extras
                        });
                        return this._fetchTokens(request);
                    }
                });
        });
    }

    refreshTokens (tokens)
    {
        return this._fetchServiceConfiguration().then(() =>
        {
            let request = new TokenRequest({
                client_id: this.authConfig.clientConfig.clientId,
                redirect_uri: this.authConfig.clientConfig.redirectUri,
                grant_type: GRANT_TYPE_REFRESH_TOKEN,
                code: undefined,
                refresh_token: tokens.refreshToken,
                extras: undefined
            });

            return this._fetchTokens(request);
        });
    }

    async revokeToken (accessToken)
    {
        this._fetchServiceConfiguration().then(() =>
        {
            let request = new RevokeTokenRequest({
                token: accessToken,
                token_type_hint: 'bearer',
                client_id: this.authConfig.clientConfig.clientId
            });
            this.tokenHandler = new BaseTokenRequestHandler();
            this.tokenHandler.performRevokeTokenRequest(this.configuration, request).then(response =>
            {
                console.log(response);
            });
        });
    }

    async _fetchTokens (request)
    {
        this.tokenHandler = new BaseTokenRequestHandler();
        return this.tokenHandler
            .performTokenRequest(this.configuration, request)
            .then(response =>
            {
                this.tokens = response;
            })
            .catch(error =>
            {
                console.log(error);
            });
    }

    _fetchServiceConfiguration ()
    {
        return AuthorizationServiceConfiguration.fetchFromIssuer(
            this.authConfig.openIdProvider
        ).then(response =>
        {
            this.configuration = response;

            console.log(this.configuration);
        });
    }

    _makeAuthorizationRequest ()
    {
        let request = new AuthorizationRequest({
            client_id: this.authConfig.clientConfig.clientId,
            redirect_uri: this.authConfig.clientConfig.redirectUri,
            response_type: AuthorizationRequest.RESPONSE_TYPE_CODE,
            state: undefined,
            scope: this.authConfig.clientConfig.scope,
            extras: {
                'access_type': 'offline',
                // 'prompt': 'consent'
            }
        });

        this.authorizationHandler.performAuthorizationRequest(
            this.configuration,
            request
        );
    }
}
