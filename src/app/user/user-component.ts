import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES, ComponentInstruction, RouteConfig, CanActivate} from '@angular/router-deprecated';

import {UserService} from './../common/service/user-service';
import {UserList} from './list/user-list';
import {UserDetail} from './detail/user-detail';
import {MainMenu} from '../menu/menu-component';
import {authCheck} from '../auth/auth-check';

@Component({
    template: require('./user.html'),
    directives: [ROUTER_DIRECTIVES, MainMenu],
    providers: [UserService]
})

@RouteConfig([
    {path: '/', name: 'UserList', component: UserList, useAsDefault: true},
    {path: '/:id', name: 'UserDetail', component: UserDetail}
])

@CanActivate((next: ComponentInstruction, previous: ComponentInstruction) => {
    return authCheck('admin', next, previous);
})

export class UserComponent {

}
