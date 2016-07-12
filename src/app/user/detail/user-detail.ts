import {Component, OnInit} from '@angular/core';
import {FORM_DIRECTIVES,
    FormBuilder,
    Validators,
    AbstractControl,
    ControlGroup} from '@angular/common';
import {Router, RouteParams, CanActivate, ComponentInstruction} from '@angular/router-deprecated';
import {HttpClient} from '../../common/http-client';
import {User} from '../../common/model/user/user';
import {UserService} from '../../common/service/user-service';
import {authCheck} from '../../auth/auth-check';
import {UpdateFromSelectValue} from '../../common/model/update-from-select-value';
import {UpdateFromSelect} from '../../common/directives/update-from-select/update-from-select';

@Component({
    selector: 'user-detail',
    directives: [FORM_DIRECTIVES, UpdateFromSelect],
    providers: [UserService, HttpClient],
    template: require('./user-detail.html'),
    styles: [require('./user-detail.css'), require('../../app.css')],
    inputs: ['user']
})

@CanActivate((next: ComponentInstruction, previous: ComponentInstruction) => {
    return authCheck('admin', next, previous);
})

export class UserDetail implements OnInit {

    user: User;
    roles = ['admin', 'user'];
    statuses = ['active', 'deleted'];
    userForm: ControlGroup;
    name: AbstractControl;
	email: AbstractControl;
//	role: AbstractControl;
	status: AbstractControl;
    newUser: boolean = false;
    submitted: boolean = false;
    allValues: Array<UpdateFromSelectValue> = [];

    constructor(private _formBuilder: FormBuilder,
                private _userService: UserService,
                private _routeParams: RouteParams,
                private _router: Router) {
    }

    private _getUser(id: string) {
        this._userService.getUser(id).subscribe(
            data => {
                this.user = data;
                this._initForm();
                this.allValues = this.allValues.map((value) => {
                   if ( this.user.roles.indexOf(value.name) > -1 ) {
                       if (!value.selected) {
                           value.toggleSelected();
                       }
                   }
                   return value;
                });
            }
        );
    }

    private _setRoles() {

        let i: number = 0;

        this.allValues = this.roles.map((role) => {

            return new UpdateFromSelectValue((++i).toString(), role);

        });
    }

    private _saveRolesToUser() {
        return this.allValues.filter((value) => {

            return value.selected;

        }).map((selectedValue) => {
            return selectedValue.name;
        });
    }

    private _initForm() {
        console.log('initiating form: ' + JSON.stringify(this.user));
        this.userForm = this._formBuilder.group({
            name: ['', Validators.required],
            email: ['', Validators.required],
//            role: ['', Validators.required],
            status: ['', Validators.required]
        });

        this.name = this.userForm.controls['name'];
        this.email = this.userForm.controls['email'];
//        this.role = this.userForm.controls['role'];
        this.status = this.userForm.controls['status'];

    }

    ngOnInit() {
        this._setRoles();
        //console.log('User detail init');
        let id = this._routeParams.get('id');
        this.newUser = id ? false : true;
        if (id) {
            this._getUser(id);
        } else {
            this.user = new User();
            this._initForm();
        }
    }

    submitUser(value) {

        this.submitted = true;
		console.log(`in submitUser - ${this.userForm.valid}`);
        if (this.userForm.valid) {
            this.user.roles = this._saveRolesToUser();
            this._userService.saveUser(this.user).subscribe(
                data => {
 //                    this.user =  data;
                     this._router.navigate(['UserDetail', {id: this.user._id}]);
                }
            );
        } else {
		
			console.log(`Name is ${this.name.value} ${this.name.valid}`);
			console.log(`Email is ${this.email.value} ${this.email.valid}`);
//			console.log(`Role is ${this.role.value} ${this.role.valid}`);
			console.log(`Status is ${this.status.value} ${this.status.valid}`);
			
		}
    }

    cancel($event) {
        $event.preventDefault();
        this._router.navigate(['UserList']);
    }

}
