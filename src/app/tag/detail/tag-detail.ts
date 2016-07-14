import {Component, Input, OnInit} from '@angular/core';
import {FORM_DIRECTIVES,
    FormBuilder,
    Validators,
    AbstractControl,
    ControlGroup} from '@angular/common';
import {Router, RouteParams, CanActivate, ComponentInstruction} from '@angular/router-deprecated';
import {HttpClient} from '../../common/http-client';
import {UserService} from '../../common/service/user-service';
import {authCheck} from '../../auth/auth-check';
import {TagService} from "../../common/service/tag-service";
import {Tag} from "../../common/model/lexicon/tag";
import {LexiconService} from "../../common/service/lexicon-service";
import {Lexicon} from "../../common/model/lexicon/lexicon";

@Component({
    directives: [FORM_DIRECTIVES],
    template: require('./tag-detail.html'),
    styles: [require('./tag-detail.css'), require('../../app.css')]
})

@CanActivate((next: ComponentInstruction, previous: ComponentInstruction) => {
    return authCheck('admin', next, previous);
})

export class TagDetail implements OnInit {

    @Input() tag: Tag;
/*    tagForm: ControlGroup;
    name: AbstractControl;
    description: AbstractControl;
    status: AbstractControl;
    requiresValue: AbstractControl;*/

    statuses = ['active', 'deleted'];
    trueOrFalse = [true, false];
    submitted: boolean = false;
    lexicons: Lexicon[];
    selectedLexicon: string = "";
    defaultLexicon: Lexicon[];

    constructor(private _formBuilder: FormBuilder,
                private _tagService: TagService,
                private _lexiconService: LexiconService,
                private _routeParams: RouteParams,
                private _router: Router)
    {
        this.tag = new Tag();

    }

    ngOnInit() {
        console.log('Tag detail init');
        this._lexiconService.getLexicons()
            .subscribe(
                data => {
                    this.lexicons = data;
                    this.defaultLexicon = this.lexicons.filter((l: Lexicon) => {
                        return l.name ==='Default'
                    });
                    console.log(`default lexicon is ${this.defaultLexicon[0]._id}`);
                    this._init();
                }

            );

    }

    private _init() {
        let id = this._routeParams.get('id');
        if (id) {
            this._getTag(id);
        } else {
            this._initForm();
        }
    }

    private _initForm() {
        console.log('initiating form: ' + JSON.stringify(this.tag));
        this.selectedLexicon = this.tag.lexicon ? this.tag.lexicon._id : this.defaultLexicon[0]._id;
        console.log(`_initForm: ${this.selectedLexicon}`);
    }

    private _getTag(id: string) {
        this._tagService.getTag(id).subscribe(
            data => {
                this.tag = data;
                this._initForm();
            }
        );
    }

    submitTag(value) {

        this.submitted = true;
        console.log(`in submitTag `);
        console.log(`tag is  + ${JSON.stringify(this.tag)}`);
            this._tagService.saveTag(this.tag).subscribe(
                () => {
                    this._router.navigate(['TagDetail', {id: this.tag._id}]);
                }
            );

    }

    cancel($event) {
        $event.preventDefault();
        this._router.navigate(['TagList']);
    }

    onChangeLexicon(lexiconId) {

        console.log(`Tag is ${JSON.stringify(this.tag)}`);
        if (lexiconId) {
            console.log(`+ Lexicon ID is ${lexiconId}`);
            if (this.tag.lexicon) {
                this.tag.lexicon._id = lexiconId;
            } else {
                this.tag.lexicon = new Lexicon();
                this.tag.lexicon._id = lexiconId;
            }
        }
        if (!lexiconId) {

            console.log(`- Lexicon ID is ${lexiconId}`);
            this.tag.lexicon = new Lexicon();
            console.log(`remove : Tag is ${JSON.stringify(this.tag)}`);
        }
        console.log(`Tag is now  ${JSON.stringify(this.tag)}`);
    }

    _removeLexicon() : Tag {
        let newTag = new Tag();
        newTag.name = this.tag.name;
        newTag.description = this.tag.description;
        newTag.status = this.tag.status;
        newTag.requiresValue = this.tag.requiresValue;
        console.log(`remove : Tag is ${JSON.stringify(newTag)}`);
        return newTag;
    }
}
