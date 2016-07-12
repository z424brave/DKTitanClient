import {Component, OnInit} from '@angular/core';
import {ComponentInstruction, CanActivate} from '@angular/router-deprecated';
import {TreeView} from '../common/directives/tree-view/tree-view';
import {LeafView} from '../common/directives/leaf-view/leaf-view';
import {TreeNode} from '../common/model/tree-node';
import {TreeNodeService} from '../common/service/tree-node-service';
import {authCheck} from '../auth/auth-check';
import {MainMenu} from '../menu/menu-component';
import {Subscription} from 'rxjs/Subscription';
import {S3Service} from '../common/service/s3Service';

@Component({
    template: require('./media.html'),
    styles: [require('./media.css'), require('../app.css')],
    directives:[TreeView, LeafView, MainMenu],
    providers:[TreeNodeService]
})

@CanActivate((next: ComponentInstruction, previous: ComponentInstruction) => {
    return authCheck('admin', next, previous);
})

export class MediaComponent implements OnInit {

    node: TreeNode = null;
    leafs: Array<TreeNode> = null;
    newFolder: string = '';
    currentFolder: string;
    nodeChange: Subscription;

    constructor(private _treeNodeService: TreeNodeService,
                private _s3Service: S3Service){

    }

    ngOnInit(){
        this.node = new TreeNode('root','/', '');
        this.nodeChange = this._treeNodeService.showNodeChange.subscribe(
            node => {
                this.currentFolder = node;
                console.log(`Node Change to - ${this.currentFolder}`);
            })
    }

    displayLeafsForNode(leafs) {
        console.log(`In displayLeafsForNode - ${leafs.length}`);
        this.leafs = leafs;
    }
    selectNode(node) {
        console.log(`Node selected is - ${JSON.stringify(node)}`);
    }

    addFolder(val) {
        let newFolderName: string = this.currentFolder.concat(val);
        console.log(`In addFolder - ${newFolderName}`);
//        Observable.create(observer => {
            console.log(`In addFolder 2 - ${newFolderName}`);
            this._s3Service.createFolder(newFolderName)
                .subscribe(res => {
                    console.log(`after call to s3 createFolder - ${JSON.stringify(res)}`);
                    this.newFolder = '';
//                    observer.next();
                });
//        });

    }

}
