import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router-deprecated';

import {User} from '../../common/model/user/user';
import {UserDetail} from '../detail/user-detail';
import {UserService} from '../../common/service/user-service';
import {NameSort} from '../../common/name-sort-pipe';
import {IsoDatePipe} from '../../common/iso-date-pipe';
import {UpdateFromSelectValue} from '../../common/model/update-from-select-value';
import {UpdateFromSelect} from '../../common/directives/update-from-select/update-from-select';

@Component({
    selector: 'user-list',
    directives: [UserDetail, UpdateFromSelect],
    providers: [UserService],
    styles: [require('./user-list.css'), require('../../app.css')],
    pipes:[NameSort, IsoDatePipe],
    template: require('./user-list.html')

})

export class UserList implements OnInit {

    constructor(private _userService: UserService,
                private _router: Router) {
    }
    
    allValues: Array<UpdateFromSelectValue> = [];
    
    public users = [];

    getUsers() {
        this._userService.getUsers()
            .subscribe(
                data => this.users = data
            );

    }

    onSelect(user: User) {
        console.log('Selected ' + user.name);
        this._router.navigate(['UserDetail', {id: user._id}]);
    }

    newUser() {
        this._router.navigate(['UserDetail', {id: undefined}]);
    }


    ngOnInit() {
        this.getUsers();
    }

}
