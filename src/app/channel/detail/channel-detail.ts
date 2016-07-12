import {Component, OnInit, Input} from '@angular/core';
import {FORM_DIRECTIVES,
    FormBuilder,
    Validators,
    AbstractControl,
    ControlGroup} from '@angular/common';
import {Router, RouteParams, CanActivate, ComponentInstruction} from '@angular/router-deprecated';
import {HttpClient} from '../../common/http-client';
import {Channel} from '../../common/model/channel/channel';
import {ChannelService} from '../../common/service/channel-service';
import {authCheck} from '../../auth/auth-check';

@Component({
    directives: [FORM_DIRECTIVES],
    providers: [ChannelService, HttpClient],
    template: require('./channel-detail.html'),
    styles: [require('./channel-detail.css'), require('../../app.css')]
})

@CanActivate((next: ComponentInstruction, previous: ComponentInstruction) => {
    return authCheck('admin', next, previous);
})

export class ChannelDetail implements OnInit {

    channel: Channel;
//    roles = ['admin', 'user'];
    statuses = ['active', 'deleted'];
    drivers = ['Twitter', 'Facebook', 'Game Guide', 'Launcher', 'S3'];
    channelForm: ControlGroup;
    name: AbstractControl;
	driver: AbstractControl;
    submitted: boolean = false;

    constructor(private _formBuilder: FormBuilder,
                private _channelService: ChannelService,
                private _routeParams: RouteParams,
                private _router: Router) {
    }

    submitChannel(value) {

        this.submitted = true;
		console.log(`in submitChannel - ${this.channelForm.valid}`);
        if (this.channelForm.valid) {
            this._channelService.saveChannel(this.channel).subscribe(
                data => {
                     this.channel =  data;
                     this._router.navigate(['ChannelDetail', {id: this.channel._id}]);
                }
            );
        } else {
		
			console.log(`Name is ${this.name.value} ${this.name.valid}`);
			console.log(`Driver is ${this.driver.value} ${this.driver.valid}`);

		}
    }

    ngOnInit() {
        console.log('Channel detail init');
        let id = this._routeParams.get('id');
        if (id) {
            this.getChannel(id);
        } else {
            this.channel = new Channel();
            this.initForm();
        }
    }

    initForm() {
        console.log('initiating form: ' + JSON.stringify(this.channel));
        this.channelForm = this._formBuilder.group({
            name: ['', Validators.required],
            driver: ['', Validators.required]
        });

        this.name = this.channelForm.controls['name'];
        this.driver = this.channelForm.controls['driver'];

    }

    onChannelDriverChange(driver) {

        console.log(`in driver change - ${driver}`);
    }

    cancel($event) {
        $event.preventDefault();
        this._router.navigate(['ChannelList']);
    }

    private getChannel(id: string) {
        this._channelService.getChannel(id).subscribe(
            data => {
                this.channel = data;
                this.initForm();
            }
        );
    }

}
