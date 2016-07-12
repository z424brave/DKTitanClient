import {provide} from '@angular/core';
import {bootstrap} from '@angular/platform-browser-dynamic';
import {ELEMENT_PROBE_PROVIDERS} from '@angular/platform-browser';
import {ROUTER_PROVIDERS} from '@angular/router-deprecated';
import {Http, HTTP_PROVIDERS} from '@angular/http';
import {FORM_PROVIDERS} from '@angular/common';
import {AuthHttp, AuthConfig} from 'angular2-jwt';
import {appInjector} from './app/common/app-injector';
import {AuthService} from './app/auth/auth-service';

import {App} from './app/app';
import {HttpClient} from './app/common/http-client';
import {NotificationService} from './app/common/service/notification-service';

document.addEventListener('DOMContentLoaded', function main() {
	console.log(`Running app in ${process.env.NODE_ENV} pointing at ${process.env.API}`);
    console.log(`ENV is  ${process.env.ENV}`);
    console.log(`Host is ${process.env.HOST}`);
    console.log(`Port is ${process.env.PORT}`);
    console.log(`API is  ${process.env.API}`);
	bootstrap(App, [
        AuthService,
        HttpClient,
        NotificationService,
        ...('production' === process.env.ENV ? [] : ELEMENT_PROBE_PROVIDERS),
        ...HTTP_PROVIDERS,
        ROUTER_PROVIDERS,
        ...FORM_PROVIDERS,
        provide(AuthHttp, {
            useFactory: (http) => {
                return new AuthHttp(new AuthConfig(), http);
            },
            deps: [Http]
        })
    ])
        .then((appRef) => appInjector(appRef.injector))
        .catch(err => console.error(err));
});
