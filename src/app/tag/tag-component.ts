/**
 * Created by Damian.Kelly on 23/06/2016.
 */
import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES, ComponentInstruction, RouteConfig, CanActivate} from '@angular/router-deprecated';

import {TagService} from './../common/service/tag-service';
import {TagList} from './list/tag-list';
import {TagDetail} from './detail/tag-detail';
import {MainMenu} from '../menu/menu-component';
import {authCheck} from '../auth/auth-check';

@Component({
    template: require('./tag-component.html'),
    directives: [ROUTER_DIRECTIVES, MainMenu],
    providers: [TagService]
})

@RouteConfig([
    {path: '/', name: 'TagList', component: TagList, useAsDefault: true},
    {path: '/:id', name: 'TagDetail', component: TagDetail}
])

@CanActivate((next: ComponentInstruction, previous: ComponentInstruction) => {
    return authCheck('admin', next, previous);
})

export class TagComponent {

}
