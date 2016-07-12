import {Component, Input, OnInit} from '@angular/core';
import {FORM_DIRECTIVES} from '@angular/common';
import {Router} from '@angular/router-deprecated';
import {User} from '../../common/model/user/user';
import {SearchNode} from './../../common/model/node/search-node';
import {MainMenu} from '../../menu/menu-component';
import {AuthService} from '../../auth/auth-service';
import {UserService} from '../../common/service/user-service';
import {TagService} from './../../common/service/tag-service';
import {ApplicationService} from './../../common/service/application-service';
import {IsoDatePipe} from '../../common/iso-date-pipe';
import {UpdateFromSelectValue} from '../../common/model/update-from-select-value';
import {UpdateFromSelect} from '../../common/directives/update-from-select/update-from-select';
import {Application} from "../../common/model/node/application";

let _ = require('lodash');

@Component({
    selector: 'content-list',
    directives: [MainMenu, UpdateFromSelect, FORM_DIRECTIVES],
    pipes: [IsoDatePipe],
    template: require('./content-list.html'),
    styles: [require('./content-list.css'), require('../../app.css')],
    providers: [ApplicationService, UserService, TagService]
})

export class ContentList implements OnInit {

    constructor(private _applicationService: ApplicationService,
                private _router: Router,
                private _userService: UserService,
                private _authService: AuthService) {

        this.searchNode =  new SearchNode();

    }

    @Input() searchNode: SearchNode;

    allValues: Array<UpdateFromSelectValue> = [];
    applications: Application[] = [];
    statuses = ['','active', 'deleted'];
    types = ['','text','html','image'];
    users: Array<User> = [];
    currentUser: User;

/*    public deleteNode($event, applicationId) {

        console.log(`in deleteNode for ${applicationId}`);
        $event.preventDefault();
        this._applicationService.deleteApplication(applicationId)
            .subscribe(
                this._getUserNodes(this.currentUser._id)
            );

    }*/

/*    public restoreApplication($event, application) {

        console.log(`in restoreNode for ${JSON.stringify(application)} : ${JSON.stringify(this.searchNode.user)}`);
        $event.preventDefault();
        application.status = 'active';
        this._applicationService.updateApplication(application)
            .subscribe(
                this._getUserNodes(this.currentUser._id)
            );

    }*/

    public onSelect(application: Application) {

        // let latestVersion = application.content[node.content.length - 1].versionNo;
        this._router.navigate(['ContentDetail', {id: application._id, versionNo: 1}]);

    }

    public newContent() {

        console.log("In newContent");
        this._router.navigate(['ContentDetail', {id: "", versionNo: 1}]);

    }

    public search() {

/*        this.searchNode.tags = this.allValues.filter((value) => {

         return value.selected;

         }).map((selectedValue) => {
         return selectedValue.key;
         });*/

        console.log(`Search params are : ${JSON.stringify(this.searchNode)}`);
        this._applicationService.listApplications(this.searchNode)
            .subscribe(
                data => {
                    this.applications = data;
                    console.log(`in content-list / search : ${JSON.stringify(this.applications)}`);
                    this.currentUser = this._authService.currentUser;
                }
            );

    }

    public reset($event) {

        $event.preventDefault();
        // this._getAllTags();
        this._setDefaultSearchTerms();

    }

    public ngOnInit() {

        console.log(`In content-list / ngOnInit`);
        this._getUserList();
        this._setDefaultSearchTerms();
        this.search();
    }

    private _getUserList() {

        console.log(`in getUserList`);
        this._userService.getUsers()
            .subscribe(
                data => {
                    this.users = data;
                    let user = new User();
                    user.name = '';
                    user._id = '';
                    this.users.unshift(user);
                    console.log(`Users are : ${JSON.stringify(this.users)}`);
                }
            );

    }

    private _setDefaultSearchTerms() {

        this.searchNode.user = this._authService.currentUser._id;
        this.searchNode.type = "";
        this.searchNode.status = "active";
        this.searchNode.contains = "";
        this.searchNode.tags = [];

    }

}
