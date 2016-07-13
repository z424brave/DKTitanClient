import {OnInit, Component, ViewChild} from "@angular/core";
import {Router, RouteParams, CanActivate, ComponentInstruction} from "@angular/router-deprecated";
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from "@angular/common";
import {TAB_DIRECTIVES} from "ng2-bootstrap/ng2-bootstrap";
import {ContentNode} from "./../../common/model/node/content-node";
import {Language} from "../../common/model/language";
import {Content} from "./../../common/model/node/content";
import {User} from "../../common/model/user/user";
import {Media} from "./../../common/model/node/media";
import {Tag} from "../../common/model/lexicon/tag";
import {UpdateFromSelectValue} from "../../common/model/update-from-select-value";
import {ContentTab} from "./../tab/content-tab";
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
import {ContentPublish} from "./publish/content-publish";
import {ContentEditjson} from "./edit/content-editjson";
import {SearchNode} from "../../common/model/node/search-node";

let _ = require('lodash');

@Component({
    directives: [InlineEditor, TAB_DIRECTIVES, CORE_DIRECTIVES,
        FORM_DIRECTIVES, MainMenu, UpdateFromSelect,
        FileUpload, ImageBox, TreeView, ContentPublish, ContentEditjson],
    providers: [ContentService, TagService, LanguageService, TreeNodeService],
    template: require('./content-detail.html'),
	pipes: [VersionSort],
    styles: [require('./content.css'), require('../../app.css')]
})

@CanActivate((next: ComponentInstruction, previous: ComponentInstruction) => {
    return authCheck('user', next, previous);
})

export class ContentDetail implements OnInit {

    urlPrefix: string = EXTERNAL_URL_PREFIX;
    content: Content;
	currentVersion: boolean;
    allValues: Array<UpdateFromSelectValue> = [];
    activeTab: ContentTab;
	editorContent: string;
	testContent: string = "Hello me";	
	types: String[] = ['text','html','image','json'];
    node: ContentNode;
	tags: Array<Tag>;
    uploadedFileName: string = "";
    isNewNode: boolean;
    saveAction: string;
    s3Node: TreeNode = null;

    private languageTabs: Array<ContentTab>;
    private submitted: boolean;
    private supportedLanguages = [];

    @ViewChild(ContentPublish)
    private contentPublish: ContentPublish;

    @ViewChild(ContentEditjson)
    private contentEditjson: ContentEditjson;
    
    constructor(private _contentService: ContentService,
                private _tagService: TagService,
                private _languageService: LanguageService,
                private _authService: AuthService,
                private _routeParams: RouteParams,
                private _router: Router) {
    
        this.languageTabs = [];
        var media = new Media();
        media.language = new Language('English', 'EN');
 		this.activeTab = new ContentTab(media, true, true);
		this.editorContent = this.activeTab.content;
        this.uploadedFileName = "";

    }

    onUploaded(upLoadedFileName: string) {
        console.log(`Content Detail : Uploaded file is : ${upLoadedFileName}`);
        this.uploadedFileName = upLoadedFileName;
    }

    onFileNameSaved(onSavedFileName: string) {
        console.log(`Content Detail : onFileNameSaved : ${onSavedFileName}`);
        this.getTabForLanguage(this.activeTab.language).content = onSavedFileName;
        this.getTabForLanguage(this.activeTab.language).media.content = onSavedFileName;
    }

    private _getLanguages() {

        this._languageService.getLanguages()
            .subscribe(languages => {
                this.supportedLanguages = languages;
                console.log(`Languages : ${JSON.stringify(languages)}`);
                this.createContentTabs();
            });
    }

    private _getAllTags() {

        console.log(`in content-details / _getAllTags`);
        this._tagService.getTags(new SearchNode()).subscribe(
            data => {

                let tags = _.flatMap(_.map(data, 'tags'));
                this.allValues = data.map((tag: Tag) => {
                    return new UpdateFromSelectValue(tag._id, tag.name);
                });

                console.log(`in getAllTags - Tags : ${this.allValues.length} - ${JSON.stringify(this.allValues)}`);
                this._initNode();
            }
        );

    }

    private _initNode() {
        let id = this._routeParams.get('id');
        if (id) {
            this._loadNode(id, true);
        } else {

            this.isNewNode = true;
            let user = new User();
            user._id = this._authService.currentUser._id;
            this.node.user = user;
            this.node.tags = [];
            this.tags = [];
            this.content = new Content();
            this.content.media = [];
            this.content.user = this._authService.currentUser._id;
            this.content.versionNo = 1;
            this.currentVersion = true;
            this.supportedLanguages = [];
            this._getLanguages()

        }

        this.saveAction = this.isNewNode ? 'Save' : 'Update';

    }

    private _loadNode(id: string, initTabs: boolean) {

        console.log(`In loadNode - ${id} : ${initTabs}`);
        this._contentService.getNode(id)
            .subscribe(
                data => {
                    this.node = data;
                    console.log(`Node : ${JSON.stringify(this.node)}`);
                    this.currentVersion = false;
                    this.initContentTabs(initTabs);
                    console.log(`All Values is - ${JSON.stringify(this.allValues)}`);
/*                    this.allValues = this.allValues.map((value) => {

                        if ( this.node.tags.indexOf(value.key) > -1 ) {
                            if (!value.selected) {
                                value.toggleSelected();
                            }
                        }

                        return value;

                    });*/
                    console.log(`set selected tags - ${JSON.stringify(this.allValues)}`);
                }
            );

    }

    ngOnInit() {
	
		console.log(`In content-details / ngOnInit`);	
        this.node = new ContentNode();
        this.content = new Content();
        this.content.media = [];
        let id = this._routeParams.get('id');
		console.log(`In ngOnInit - ${this._routeParams.get('versionNo')}`);
        this._getAllTags();
        this.s3Node = new TreeNode('root','/', '');

    }

	editorContentChanged(event) {
	
		console.log(`content-detail / editorContentChanged - ${event.target.value}`);
		console.log(`content-detail / editorContentChanged - ${JSON.stringify(this.getTabForLanguage(this.activeTab.language))}`);		
		this.activeTab.content = event.target.value;
		this.getTabForLanguage(this.activeTab.language).content = event.target.value;
        this.getTabForLanguage(this.activeTab.language).media.content = event.target.value;
        for (let media of this.content.media) {
            if (media.language === this.activeTab.language) {
                media.content = event.target.value;
                console.log(`Saving editor content : ${JSON.stringify(media.content)} for ${JSON.stringify(media.language)}`);
            }
        }
		console.log(`content-detail / editorContentChanged - ${JSON.stringify(this.getTabForLanguage(this.activeTab.language))}`);

    }

    createContentTabs() {

		console.log(`In createContentTabs`);	
        let counter = 0;
        for (let language of this.supportedLanguages) {
            let media = new Media();
            media.language = new Language(language.name, language.iso3166);
            media.content = '';
            this.content.media.push(media);
            this.languageTabs.push(new ContentTab(
                media,
                counter++ === 0,
                true
            ));
        }

    }

    initContentTabs(init) {

		console.log(`In initContentTabs - ${init}`);		
        let counter = 1;
        this.content.user = this._authService.currentUser._id;
		let versionNo: any = this._routeParams.get('versionNo');
		let versionNoRef = (versionNo && versionNo > 0) ? versionNo - 1 : this.node.content.length - 1;
        this.content.versionNo = this.node.content[versionNoRef].versionNo;
//        console.log(`initContentTabs - versionNo is : ${this.content.versionNo} / ${this.node.content[versionNoRef].versionNo}`);
		this.currentVersion = (this.content.versionNo === this.node.content.length) ? true : false;
        console.log(`initContentTabs : ${versionNo} : ${this.currentVersion} : ${this.node.content.length} `);
		this.content.versionMessage = this.node.content[versionNoRef].versionMessage;
        var medialist = this.node.content[versionNoRef].media;
        for (var media of medialist) {
            var newMedia = new Media();
            newMedia.content = media.content;
            newMedia.language = media.language;
            this.content.media.push(newMedia);
            if (init) {
                this.languageTabs.push(new ContentTab(
                    newMedia,
                    counter++ === 1,
                    counter === medialist.length + 1
                ));
            } else {
                var tab = _.find(this.languageTabs, {title: newMedia.language.iso3166});
                tab.media = newMedia;
            }
        }
		this.activeTab = this.languageTabs[0];
		this.editorContent = this.activeTab.content;
		console.log(`In ngOnInit - ${this.editorContent} : ${JSON.stringify(this.activeTab)}`);		
    }

    _saveTagsToNode() {
        return this.allValues.filter((value) => {

            return value.selected;

        }).map((selectedValue) => {
            return selectedValue.key;
        });
    }

    onSubmit(valid) {
	
        this.submitted = true;

        if (valid) {
            if (this.isNewNode) {
				console.log(`In onSubmit about to create node`);
                // this.node.tags = this._saveTagsToNode();
                this.node.content[0] = this.content;
				console.log(JSON.stringify(this.node));
                this._contentService.createNode(this.node)
                    .subscribe(node => {
						console.log(JSON.stringify(this.content));
                        this.node = node;
                        this._router.navigate(['ContentDetail', {id: this.node._id}]);
                    })

            } else {
                //Check if content has changed. If not, discard new version.
				console.log(`In onSubmit checking node changed`);
                // this.node.tags = this._saveTagsToNode();

				console.log(JSON.stringify(this.node));				
                var contentChanged = ContentDetail.hasContentChanged(this.node.content[this.node.content.length - 1].media, this.content.media);
				console.log(`In onSubmit before update node - contentChanged is ${contentChanged}`);

				console.log(JSON.stringify(this.node));
                if (contentChanged) {
                    ++this.content.versionNo;
                    this.node.content.push(this.content);
                }
                this._contentService.updateNode(this.node)
                    .subscribe(node => {
                        console.log(`before server ${JSON.stringify(this.node)}`);
                        this._router.navigate(['ContentDetail', {id: this.node._id}]);
                    });
/*                    .toPromise()
                    .then(() => {
                        if (contentChanged) {
                            ++this.content.versionNo;
                            return this._contentService.addContent(this.node._id, this.content).toPromise()
                        } else {
                            return new Promise((resolve, reject) => resolve('ok'))
                        }
                    })
                    .then(() => {
                        console.log(`Reloading node after update : ${this.node._id}`);
                        this._router.navigate(['ContentDetail', {id: this.node._id}]);
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

    copyVersionContent($event, changeContent: Content){
	
	    console.log(`New content should be ${changeContent.versionMessage}`);
        $event.preventDefault();		
		this.content.versionMessage = changeContent.versionMessage;
	    console.log(`New content has ${changeContent.media.length} media`);
		this.currentVersion = (changeContent.versionNo < changeContent.media.length) ? false : true;

//		while(this.languageTabs.length > 0) { this.languageTabs.pop(); }	
 	    console.log(`2 New content should be ${changeContent.versionMessage}`);       
		let counter = 1;
	    console.log(`copyVersionContent - there were ${this.languageTabs.length} tabs`);				
//		for (var oldTab of this.languageTabs)   {
//			this.languageTabs.splice(this.languageTabs.indexOf(oldTab),1);
//		}
	    console.log(`copyVersionContent - there are now ${this.languageTabs.length} tabs`);		
        for (var media of changeContent.media) {
            var newMedia = new Media();
            newMedia.content = media.content;
            newMedia.language = media.language;
            this.content.media.push(newMedia);
            this.languageTabs.push(new ContentTab(
                newMedia,
                counter++ === 1,
                counter === changeContent.media.length + 1
            ));

        }	
	    console.log(`copyVersionContent - there are now ${this.languageTabs.length} tabs`);			
	    console.log(`3 New content should be ${changeContent.versionMessage}`);
		
    }

	changeVersion(changeContent: Content){

		console.log(`changeVersion - changing to version ${changeContent.versionNo}`);
		this._router.navigate(['ContentDetail', {id: this.node._id, versionNo: changeContent.versionNo}]);		
	
	}
	
    getTabForLanguage(language: Language){
	
//	    console.log(`getTabForLanguage - passed ${JSON.stringify(language)}`);
        return _.find(this.languageTabs, (tab: ContentTab) => {
            console.log(`getTabForLanguage - passed ${JSON.stringify(language.iso3166)} - returning ${JSON.stringify(tab.media.language.iso3166)}`);
            return tab.media.language.iso3166 == language.iso3166;
        });

    }

    refreshMedia() {
	
        for (var media of this.content.media) {
            if (media.language.iso3166 === this.activeTab.media.language.iso3166) {
                this.activeTab.content = media.content;
				this.editorContent = this.activeTab.content;
            }
        }
		console.log(`In ngOnInit - ${this.editorContent} : ${JSON.stringify(this.activeTab)}`);		
    }

    onTypeChanged($event) {
	    console.log(`onTypeChanged ${$event}`);
        this.node.type = _.find(this.types, (t) => {
            console.log(`onTypeChanged : ${t}`);
            return t === $event;
        });
        console.log(`onTypeChanged ${this.node.type}`);
    }

    onVersionMessageChanged($event) {
	
	    console.log(`onVersionMessageChanged ${JSON.stringify($event)}`);	
        this.content.versionMessage = $event;
		
    }

    onEditorContentChanged($event) {
	
	    console.log(`onEditorContentChanged ${JSON.stringify($event)}`);	
        this.activeTab.media.content = $event;
        this.getTabForLanguage(this.activeTab.language).content = this.activeTab.media.content;
		this.content.versionMessage = '';

		
    }

    selectTab(tab) {
	
		console.log(`In selectTab before - ${tab.title} - ${this.editorContent} : ${JSON.stringify(this.activeTab)}`);  
		if (!tab.active) {tab.active = true;}
        this.activeTab = tab;
		this.editorContent = this.activeTab.content;
		console.log(`In selectTab after - ${tab.title} - ${this.editorContent} : ${JSON.stringify(this.activeTab)}`);		
		
    }

    cancel($event) {
	
        $event.preventDefault();
        this._router.navigate(['Content']);
		
    }

    translate($event) {

        console.log(`Translate - ${JSON.stringify($event)}`);
        $event.preventDefault();

    }

    publish($event) {

        console.log(`Publish - ${JSON.stringify($event)}`);
        $event.preventDefault();
        this.contentPublish.node = this.node;
        this.contentPublish.showPublish(`Lets publish this - ${this.node.name}`);

    }
    
    editJson($event) {

        console.log(`Edit - ${JSON.stringify($event)}`);
        $event.preventDefault();
        this.contentEditjson.node = this.node;
        this.contentEditjson.showEditjson();

    }
}
