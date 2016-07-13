/**
 * Created by Damian.Kelly on 24/06/2016.
 */
import {Component, OnInit} from '@angular/core';
import {ComponentInstruction, CanActivate, Router} from '@angular/router-deprecated';
import {FORM_DIRECTIVES, CORE_DIRECTIVES} from '@angular/common';

import {Lexicon} from './../../common/model/lexicon/lexicon';

import {LexiconService} from './../../common/service/lexicon-service';
import {authCheck} from '../../auth/auth-check';
import {PaginatePipe, PaginationControlsCmp, PaginationService} from 'ng2-pagination';

@Component({
    template: require('./lexicon-list.html'),
    styles: [require('./lexicon-list.css'), require('../../app.css')],
    providers: [LexiconService, PaginationService],
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES,PaginationControlsCmp],
    pipes: [PaginatePipe]
})

@CanActivate((next: ComponentInstruction, previous: ComponentInstruction) => {
    return authCheck('admin', next, previous);
})

export class LexiconList implements OnInit {

    lexicons: Lexicon[];
    newLexicon: Lexicon;

    constructor(private _lexiconService: LexiconService,
                private _router: Router) {

    }

    ngOnInit() {
        this._init();
    }

    private _init() {
        console.log(`In init in lexicon list`);
        this._lexiconService.getLexicons()
            .subscribe(
                data => {
                    this.lexicons = data;
                }
            );
        this.newLexicon = new Lexicon();
    }

    createLexicon() {
        this._router.navigate(['LexiconDetail', {id: undefined}]);
    }

    onSelectLexicon(lexicon) {
        this._router.navigate(['LexiconDetail', {id: lexicon._id}]);
    }

}
