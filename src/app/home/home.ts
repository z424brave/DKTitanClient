import {Component} from '@angular/core';
import {ComponentInstruction, CanActivate} from '@angular/router-deprecated';

import {authCheck} from '../auth/auth-check';
import {MainMenu} from '../menu/menu-component';

@Component({

    selector: 'home',
    providers: [],
    directives: [MainMenu],
    pipes: [],
    styles: [require('./home.css')],
    template: require('./home.html')

})

@CanActivate((next: ComponentInstruction, previous: ComponentInstruction) => {
    console.log(`In home`);
    return authCheck('user', next, previous);
})

export class Home {

    constructor() {

    }

}
