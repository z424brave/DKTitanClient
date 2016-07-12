/**
 * Created by Damian.Kelly on 01/07/2016.
 */
import {OnInit, Component, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked } from "@angular/core";
import {Router, RouteParams, CanActivate, ComponentInstruction} from "@angular/router-deprecated";
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from "@angular/common";
import {TAB_DIRECTIVES} from "ng2-bootstrap/ng2-bootstrap";
import {Content} from "./../../common/model/node/content";
import {User} from "../../common/model/user/user";
import {Media} from "./../../common/model/node/media";
import {Tag} from "../../common/model/lexicon/tag";
import {UpdateFromSelectValue} from "../../common/model/update-from-select-value";
import {UpdateFromSelect} from "../../common/directives/update-from-select/update-from-select";
import {InlineEditor} from "../../common/directives/inline-editor/inline-editor";
import {MainMenu} from "../../menu/menu-component";
import {authCheck} from "../../auth/auth-check";
import {AuthService} from "../../auth/auth-service";
import {ContentService} from "../../common/service/content-service";
import {LanguageService} from "../../common/service/language-service";
import {VersionSort} from "../../common/version-sort-pipe";
import {TagService} from "../../common/service/tag-service";
import {FileUpload} from "../../common/directives/file-upload/file-upload";
import {EXTERNAL_URL_PREFIX} from '../../config';
import {ImageBox} from "../../common/directives/image-box/image-box";
import {TreeNode} from "../../common/model/tree-node";
import {TreeView} from "../../common/directives/tree-view/tree-view";
import {TreeNodeService} from "../../common/service/tree-node-service";
import {ContentPublish} from "../../node/detail/publish/content-publish";
import {ContentEditjson} from "../../node/detail/edit/content-editjson";
import {Application} from "../../common/model/node/application";
import {ApplicationService} from "../../common/service/application-service";
import {ContentNode} from "../../common/model/node/content-node";
import {ContentTab} from "../../node/tab/content-tab";
import {NodeType} from "../../common/model/node/node-type";

let _ = require('lodash');

@Component({
    directives: [InlineEditor, TAB_DIRECTIVES, CORE_DIRECTIVES,
        FORM_DIRECTIVES, MainMenu, UpdateFromSelect,
        FileUpload, ImageBox, TreeView, ContentPublish, ContentEditjson],
    providers: [ContentService, TagService, LanguageService, TreeNodeService],
    template: require('./content-detail.html'),
    pipes: [VersionSort],
    styles: [require('./content-detail.css'), require('../../app.css')]
})

@CanActivate((next: ComponentInstruction, previous: ComponentInstruction) => {
    return authCheck('user', next, previous);
})

export class ContentDetail implements OnInit, AfterContentChecked, AfterContentInit,
    AfterViewInit, AfterViewChecked {

    urlPrefix: string = EXTERNAL_URL_PREFIX;
    content: Content;
    currentVersion: boolean;
    allValues: Array<UpdateFromSelectValue> = [];
    editorContent: string;
    testContent: string = "Hello me";
    types: String[] = ['text','html','image','json'];
    contentNode: Application;
    tags: Array<Tag>;
    uploadedFileName: string = "";
    isNewContentNode: boolean;
    saveAction: string;
    s3Node: TreeNode = null;
    contentTypes: String[] = ['john','paul']
    textNodes: ContentNode[];
    imageNodes: ContentNode[];

    private languageTabs: Array<NodeType> = [];

    private submitted: boolean;
    private supportedLanguages = [];

    constructor(private _applicationService: ApplicationService,
                private _authService: AuthService,
                private _routeParams: RouteParams,
                private _router: Router) {

        this.contentNode = new Application();
        console.log(`constructor - contentNode : ${JSON.stringify(this.contentNode)}`);
        this.languageTabs.push(new NodeType('text/html',true, false));
        this.languageTabs.push(new NodeType('Background Image',false, true));
    }

    private _initNode() {
        let id = this._routeParams.get('id');
        if (id) {
            this._loadNode(id, true);
        } else {

            this.isNewContentNode = true;
            let user = new User();
            user._id = this._authService.currentUser._id;
            this.contentNode.user = user;
            this.contentNode.tags = [];
            this.tags = [];
            this.content = new Content();
            this.content.media = [];
            this.content.user = this._authService.currentUser._id;
            this.content.versionNo = 1;
            this.currentVersion = true;
            this.supportedLanguages = [];

        }

        this.saveAction = this.isNewContentNode ? 'Save' : 'Update';

    }

    private _loadNode(id: string, initTabs: boolean) {

        console.log(`In loadNode - ${id} : ${initTabs}`);
        this._applicationService.getApplication(id)
            .subscribe(
                data => {
                    this.contentNode = data;
                    console.log(`Node : ${JSON.stringify(this.contentNode)}`);
                    console.log(`Node : ${this.contentNode.applicationType.name}`);
                    this.currentVersion = false;
                    this.textNodes = this.contentNode.nodes.filter((cNode: ContentNode ) => {
                        return cNode.type === 'text';
                    });
                    this.imageNodes = this.contentNode.nodes.filter((cNode: ContentNode ) => {
                        return cNode.type === 'image';
                    });
                    console.log(`content-detail : ${this.contentNode.name} - ${this.textNodes.length} text nodes` );
                    console.log(`content-detail : ${this.contentNode.name} - ${this.imageNodes.length} image nodes` );
                }
            );

    }

    ngOnInit() {

        console.log(`In content-details / ngOnInit`);
        this.contentNode = new Application();
        this.content = new Content();
        this.content.media = [];
        let id = this._routeParams.get('id');
        console.log(`content-detail - In ngOnInit - ${this._routeParams.get('versionNo')}`);
        this.s3Node = new TreeNode('root','/', '');
        this._initNode();

    }

    ngAfterViewInit() {

        console.log(`In content-details / ngAfterViewInit`);

    }

    ngAfterViewChecked() {

        console.log(`In content-details / ngAfterViewChecked`);

    }

    ngAfterContentInit() {

        console.log(`In content-details / ngAfterContentInit`);

    }

    ngAfterContentChecked() {

        console.log(`In content-details / ngAfterContentChecked`);
        console.log(`ngAfterContentChecked - contentNode : ${JSON.stringify(this.contentNode)}`);

    }

    onSubmit(valid) {

        this.submitted = true;

        if (valid) {
            if (this.isNewContentNode) {
                console.log(`In onSubmit about to create node`);
                console.log(JSON.stringify(this.contentNode));
                this._applicationService.createApplication(this.contentNode)
                    .subscribe(application => {
                        console.log(JSON.stringify(this.contentNode));
                        this.contentNode = application;
                        this._router.navigate(['ContentDetail', {id: this.contentNode._id}]);
                    })

            } else {
                //Check if content has changed. If not, discard new version.
                console.log(`In onSubmit checking node changed`);

                console.log(JSON.stringify(this.contentNode));
/*                var contentChanged = ContentDetail.hasContentChanged(this.contentNode.content[this.contentNode.content.length - 1].media, this.content.media);
                console.log(`In onSubmit before update node - contentChanged is ${contentChanged}`);

                console.log(JSON.stringify(this.contentNode));
                if (contentChanged) {
                    ++this.content.versionNo;
                    this.contentNode.content.push(this.content);
                }
                this._applicationService.updateNode(this.contentNode)
                    .subscribe(node => {
                        console.log(`before server ${JSON.stringify(this.contentNode)}`);
                        this._router.navigate(['ContentDetail', {id: this.contentNode._id}]);
                    });*/
                /*                    .toPromise()
                 .then(() => {
                 if (contentChanged) {
                 ++this.content.versionNo;
                 return this._applicationService.addContent(this.contentNode._id, this.content).toPromise()
                 } else {
                 return new Promise((resolve, reject) => resolve('ok'))
                 }
                 })
                 .then(() => {
                 console.log(`Reloading node after update : ${this.contentNode._id}`);
                 this._router.navigate(['ContentDetail', {id: this.contentNode._id}]);
                 });*/

            }
        }

    }

    static hasContentChanged(oldMedia, newMedia) {

        console.log(`old : ${JSON.stringify(oldMedia)} / new : ${JSON.stringify(newMedia)}`);
        for (var media of oldMedia) {
            let matchNew = newMedia.filter((newM: Media ) => {
                return newM.language === media.language;
            });
            // got matching language in new for old - now check content
            console.log(`found : ${JSON.stringify(matchNew)}`);
            if (!(matchNew[0].content === media.content)) {
                console.log(`different : ${JSON.stringify(matchNew.content)} / ${JSON.stringify(media.content)}`);
                return true;
            }

        }
        return false;

    }

    changeVersion(changeContent: Content){

        console.log(`changeVersion - changing to version ${changeContent.versionNo}`);
        this._router.navigate(['ContentDetail', {id: this.contentNode._id, versionNo: changeContent.versionNo}]);

    }

    onTypeChanged($event) {
        console.log(`onTypeChanged ${$event}`);
        this.contentNode.applicationType = _.find(this.types, (t) => {
            console.log(`onTypeChanged : ${t}`);
            return t === $event;
        });
        console.log(`onTypeChanged ${this.contentNode.applicationType}`);
    }

    onVersionMessageChanged($event) {

        console.log(`onVersionMessageChanged ${JSON.stringify($event)}`);
        this.content.versionMessage = $event;

    }

    cancel($event) {

        $event.preventDefault();
        this._router.navigate(['ContentList']);

    }

    translate($event) {

        console.log(`Translate - ${JSON.stringify($event)}`);
        $event.preventDefault();

    }

    selectTab(tab) {

        console.log(`In selectTab - ${tab.title} - ${tab.active}`);
        if (!tab.active) {tab.active = true;}

    }

    publish($event) {

        console.log(`Publish - ${JSON.stringify($event)}`);
        $event.preventDefault();
        console.log(`Publish - ${this.contentNode.name}`);

    }

    editJson($event) {

        console.log(`Edit - ${JSON.stringify($event)}`);
        $event.preventDefault();
        console.log(`Edit - ${this.contentNode.name}`);

    }
}
