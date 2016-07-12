import {Component} from '@angular/core';
import {Router, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {AuthService} from '../auth/auth-service';
import {User} from '../common/model/user/user';

@Component({
    selector: 'main-menu',
    template: require('./main-menu.html'),
    styles: [require('./menu.css')],
    directives: [...ROUTER_DIRECTIVES],
    providers: [AuthService]
})

export class MainMenu {

    user: User;

    constructor(private _authService: AuthService,
                private _router: Router) {
        this.user = _authService.currentUser;
    }

    logout() {
        this._authService.logout();
        this._router.navigate(['/Login']);
    }

    authCheck(roleRequired) : boolean {
        return this.user.roles.indexOf(roleRequired) > -1 ;
    }

}
