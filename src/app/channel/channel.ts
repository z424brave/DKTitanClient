import {Component, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, ComponentInstruction, RouteConfig, CanActivate} from '@angular/router-deprecated';

import {UserService} from './../common/service/user-service';
import {ChannelList} from './list/channel-list';
import {ChannelDetail} from './detail/channel-detail';
import {MainMenu} from '../menu/menu-component';
import {authCheck} from '../auth/auth-check';

@Component({
    template: require('./channel.html'),
    styles: [require('./channel.css'), require('../app.css')],    
    directives: [ROUTER_DIRECTIVES, MainMenu],
    providers: [UserService]
})

@RouteConfig([
    {path: '/', name: 'ChannelList', component: ChannelList, useAsDefault: true},
    {path: '/:id', name: 'ChannelDetail', component: ChannelDetail}
])

@CanActivate((next: ComponentInstruction, previous: ComponentInstruction) => {
    return authCheck('admin', next, previous);
})

export class ChannelComponent implements OnInit {

    constructor() {

    }

    ngOnInit() {

        this.init();

    }

    init() {

        console.log(`In init in channelComponent`);

    }
}
