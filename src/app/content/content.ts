/**
 * Created by Damian.Kelly on 01/07/2016.
 */
import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES, ComponentInstruction, RouteConfig, CanActivate} from '@angular/router-deprecated';

import {ApplicationService} from './../common/service/application-service';
import {ContentList} from './list/content-list';
import {ContentDetail} from './detail/content-detail';
import {MainMenu} from '../menu/menu-component';
import {authCheck} from '../auth/auth-check';

@Component({
    template: require('./content.html'),
    directives: [ROUTER_DIRECTIVES, MainMenu],
    providers: [ApplicationService]
})

@RouteConfig([
    {path: '/', name: 'ContentList', component: ContentList, useAsDefault: true},
    {path: '/:id', name: 'ContentDetail', component: ContentDetail}
])

@CanActivate((next: ComponentInstruction, previous: ComponentInstruction) => {
    return authCheck('admin', next, previous);
})

export class ContentComponent {

}
