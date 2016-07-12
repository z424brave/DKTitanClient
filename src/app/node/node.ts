import {ROUTER_DIRECTIVES, RouteConfig, CanActivate, ComponentInstruction} from '@angular/router-deprecated';
import {Component} from '@angular/core';
import {MainMenu} from '../menu/menu-component';
import {authCheck} from '../auth/auth-check';
import {ContentService} from './../common/service/content-service';
import {ContentList} from './list/content-list';
import {ContentDetail} from './detail/content-detail';

@Component({
    template: require('./node.html'),
    directives: [ROUTER_DIRECTIVES, MainMenu],
    providers: [ContentService]
})

@RouteConfig([
    {path: '/', name: 'ContentList', component: ContentList, useAsDefault: true},
    {path: '/:id', name: 'ContentDetail', component: ContentDetail}
])

@CanActivate((next: ComponentInstruction, previous: ComponentInstruction) => {
    return authCheck('user', next, previous);
})

export class NodeComponent {

}
