import {Injector} from '@angular/core';
import {Router, ComponentInstruction} from '@angular/router-deprecated';
import {appInjector} from '../common/app-injector';
import {AuthService} from './auth-service';

export const authCheck = (role: string, next: ComponentInstruction, previous: ComponentInstruction) => {

    let injector: Injector = appInjector();
    let router: Router = injector.get(Router);
    let authService: AuthService = injector.get(AuthService);

    return new Promise((resolve) => {

        let result = authService.authorise(role);
        console.log(`AuthCheck Pass : ${result} for ${role} / Next : ${JSON.stringify(next)} / Prev : ${JSON.stringify(previous)}`);

        if (result) {
            resolve(true);
        } else {
            resolve(false);
            router.navigate(['/Login']);
        }
    });
};
