/**
 * Created by Damian.Kelly on 24/06/2016.
 */
import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES, ComponentInstruction, RouteConfig, CanActivate} from '@angular/router-deprecated';

import {LexiconService} from './../common/service/lexicon-service';
import {LexiconList} from './list/lexicon-list';
import {LexiconDetail} from './detail/lexicon-detail';
import {MainMenu} from '../menu/menu-component';
import {authCheck} from '../auth/auth-check';

@Component({
    template: require('./lexicon-component.html'),
    directives: [ROUTER_DIRECTIVES, MainMenu],
    providers: [LexiconService]
})

@RouteConfig([
    {path: '/', name: 'LexiconList', component: LexiconList, useAsDefault: true},
    {path: '/:id', name: 'LexiconDetail', component: LexiconDetail}
])

@CanActivate((next: ComponentInstruction, previous: ComponentInstruction) => {
    return authCheck('admin', next, previous);
})

export class LexiconComponent {

}
