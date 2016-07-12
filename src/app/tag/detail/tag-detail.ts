import {Component, OnInit} from '@angular/core';
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

@Component({
    selector: 'user-detail',
    directives: [FORM_DIRECTIVES],
    providers: [UserService, HttpClient],
    template: require('./tag-detail.html'),
    styles: [require('./tag-detail.css'), require('../../app.css')],
    inputs: ['tag']
})

@CanActivate((next: ComponentInstruction, previous: ComponentInstruction) => {
    return authCheck('admin', next, previous);
})

export class TagDetail implements OnInit {

    tag: Tag;
    tagForm: ControlGroup;
    name: AbstractControl;
    description: AbstractControl;
    status: AbstractControl;
    requiresValue: AbstractControl;

    statuses = ['active', 'deleted'];
    trueOrFalse = [true, false];
    newTag: boolean = false;
    submitted: boolean = false;

    constructor(private _formBuilder: FormBuilder,
                private _tagService: TagService,
                private _routeParams: RouteParams,
                private _router: Router) {
    }

    ngOnInit() {

        console.log('Tag detail init');
        let id = this._routeParams.get('id');
        this.newTag = id ? false : true;
        if (id) {
            this._getTag(id);
        } else {
            this.tag = new Tag();
            this._initForm();
        }
    }

    private _initForm() {
        console.log('initiating form: ' + JSON.stringify(this.tag));
        this.tagForm = this._formBuilder.group({
            name: ['', Validators.required],
            description: ['', Validators.required],
            status: ['', Validators.required],
            requiresValue: ['', Validators.required]
        });

        this.name = this.tagForm.controls['name'];
        this.description = this.tagForm.controls['description'];
        this.status = this.tagForm.controls['status'];
        this.requiresValue = this.tagForm.controls['requiresValue'];
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
        console.log(`in submitTag - ${this.tagForm.valid}`);
        if (this.tagForm.valid) {
            this._tagService.saveTag(this.tag).subscribe(
                () => {
                    this._router.navigate(['TagDetail', {id: this.tag._id}]);
                }
            );
        } else {

            console.log(`Name is ${this.name.value} ${this.name.valid}`);
            console.log(`Email is ${this.description.value} ${this.description.valid}`);

        }
    }

    cancel($event) {
        $event.preventDefault();
        this._router.navigate(['TagList']);
    }

}
