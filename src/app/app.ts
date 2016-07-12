import {Component} from '@angular/core';
import {RouteConfig, ROUTER_DIRECTIVES} from '@angular/router-deprecated';

import {S3Service} from './common/service/s3Service';
import {NotificationCenter} from './common/directives/notification-center/notification-center';
import {MainMenu} from './menu/menu-component';

import {Home} from './home/home';
import {LoginComponent} from './login/login';
import {UserComponent} from './user/user-component';
import {LexiconComponent} from './lexicon/lexicon-component';
import {TagComponent} from './tag/tag-component';
import {MediaComponent} from './media/media';
import {ChannelComponent} from './channel/channel';
import {NodeComponent} from "./node/node";
import {ContentComponent} from "./content/content";

/*
 * App Component
 * Top Level Component
 */
@Component({
    selector: 'app',
    providers: [S3Service],
    directives: [...ROUTER_DIRECTIVES, NotificationCenter, MainMenu],
    styles: [require('./app.css')],
    template: require('./app.html')
})

@RouteConfig([
    {path: '/', component: Home, name: 'Home', useAsDefault: true},
    {path: '/login', component: LoginComponent, name: 'Login'},
    {path: '/user/...', component: UserComponent, name: 'User'},
    {path: '/content/...', component: ContentComponent, name: 'Content'},
    {path: '/node/...', component: NodeComponent, name: 'Node'},
    {path: '/lexicon/...', component: LexiconComponent, name: 'Lexicon'},
    {path: '/tag/...', component: TagComponent, name: 'Tag'},
    {path: '/media', component: MediaComponent, name: 'Media'},	
    {path: '/channel/...', component: ChannelComponent, name: 'Channel'},
    {path: '/**', redirectTo: ['Home']}
])

export class App {

    public name: string ;

    constructor() {
        this.name = 'Titan';
        console.log(`App : ${this.getMessage()}`);
    }

    getName() : string {
        return this.name;
    }

    getMessage() : string {
        return "Hello Titan";
    }

}
