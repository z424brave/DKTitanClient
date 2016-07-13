import {Component, Input, OnInit} from '@angular/core';
import {FORM_DIRECTIVES} from '@angular/common';
import {Router} from '@angular/router-deprecated';
import {User} from '../../common/model/user/user';
import {ContentNode} from './../../common/model/node/content-node';
import {SearchNode} from './../../common/model/node/search-node';
import {MainMenu} from '../../menu/menu-component';
import {AuthService} from '../../auth/auth-service';
import {UserService} from '../../common/service/user-service';
import {TagService} from './../../common/service/tag-service';
import {ContentService} from './../../common/service/content-service';
import {IsoDatePipe} from '../../common/iso-date-pipe';
import {UpdateFromSelectValue} from '../../common/model/update-from-select-value';
import {UpdateFromSelect} from '../../common/directives/update-from-select/update-from-select';
import {Tag} from "../../common/model/lexicon/tag";

let _ = require('lodash');

@Component({
    selector: 'content-list',
    directives: [MainMenu, UpdateFromSelect, FORM_DIRECTIVES],
    pipes: [IsoDatePipe],
    template: require('./content-list.html'),
    styles: [require('./content-list.css'), require('../../app.css')],
    providers: [ContentService, UserService, TagService]
})

export class ContentList implements OnInit {

    constructor(private _contentService: ContentService,
                private _router: Router,
                private _userService: UserService,
                private _tagService: TagService,
                private _authService: AuthService) {

        this.searchNode =  new SearchNode();
		
    }

    @Input() searchNode: SearchNode;

    allValues: Array<UpdateFromSelectValue> = [];
    nodes: Array<ContentNode> = [];
    statuses = ['','active', 'deleted'];
    types = ['','text','html','image'];
    users: Array<User> = [];
    currentUser: User;

    public deleteNode($event, nodeId) {

		console.log(`in deleteNode for ${nodeId}`);	
        $event.preventDefault();
        this._contentService.deleteNode(nodeId)
            .subscribe(
                this._getUserNodes(this.currentUser._id)
            );
			
    }

    public restoreNode($event, node) {

		console.log(`in restoreNode for ${JSON.stringify(node)} : ${JSON.stringify(this.searchNode.user)}`);	
        $event.preventDefault();
		node.status = 'active';

        this._contentService.updateNode(node)
            .subscribe(
                this._getUserNodes(this.currentUser._id)
            );
			
    }	
	
    public onSelect(node: ContentNode) {
    
		let latestVersion = node.content[node.content.length - 1].versionNo;
		this._router.navigate(['ContentDetail', {id: node._id, versionNo: latestVersion}]);
    
	}

    public newContent() {
		
		console.log("In newContent");	
        this._router.navigate(['ContentDetail', {id: "", versionNo: 1}]);
    
	}

	public search() {

		this.searchNode.tags = this.allValues.filter((value) => {

            return value.selected;

        }).map((selectedValue) => {
            return selectedValue.key;
        });
        
		console.log(`Search params are : ${JSON.stringify(this.searchNode)}`);
        this._contentService.searchNodes(this.searchNode)
            .subscribe(
                data => {
                    this.nodes = data;
					console.log(`in content-list / getUserNodes : ${JSON.stringify(this.nodes)}`);					
                    this.currentUser = this._authService.currentUser;
                }
            );

	}

	public reset($event) {

		$event.preventDefault();
        this._getAllTags();
		this._setDefaultSearchTerms();

	}
	
    public ngOnInit() {

		console.log(`In content-list / ngOnInit`);
        this._getAllTags();
		this._getUserList();
		this._setDefaultSearchTerms();
//        this._getUserNodes(this.searchNode.user);
        this.search();
	}

    private _getUserNodes(userId: string) {

        console.log(`in content-list / getUserNodes for ${userId}`);
        this._contentService.getUserNodes(userId)
            .subscribe(
                data => {
                    this.nodes = data;
                    console.log(`in content-list / getUserNodes : ${JSON.stringify(this.nodes)}`);
                    this.currentUser = this._authService.currentUser;
                }
            );

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

    private _getAllTags() {

        console.log(`in content-list / getAllTags`);
        this._tagService.getTags(new SearchNode()).subscribe(
            data => {

                let tags = _.flatMap(_.map(data, 'tags'));
                console.log(`in content-list / getAllTags : ${JSON.stringify(tags)}`);
                this.allValues = data.map((tag: Tag) => {
                    return new UpdateFromSelectValue(tag._id, tag.name);
                });

                console.log(`in getAllTags - Tags : ${this.allValues.length} - ${JSON.stringify(this.allValues)}`);

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
