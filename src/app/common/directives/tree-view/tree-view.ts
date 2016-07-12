import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {TreeNode} from '../../model/tree-node';
import {TreeNodeService} from '../../service/tree-node-service';

@Component({
    template: require('./tree-view.html'),
    styles: [require('./tree-view.css')],
    selector:'tree-view',
    directives:[TreeView]
})

export class TreeView implements OnInit, OnDestroy{

    @Input() root: TreeNode;

    items: Array<TreeNode> = [];
    nodes: Array<TreeNode> = [];
    leafs: Array<TreeNode> = [];
    loaded: boolean = false;

    constructor(private _treeNodeService: TreeNodeService){
    }

    ngOnInit() {
        console.log(`In OnInit - TreeView : ${JSON.stringify(this.root)}`);
        this._treeNodeService.loadTreeNodes(this.root)
            .subscribe(res => {

                console.log(`OnInit - after call to s3 list - ${JSON.stringify(res)}`);
                this.items = res;
                this.leafs = res.filter((n: TreeNode) => {
                    return !n.showIcon;
                });
                this.nodes = res.filter((n: TreeNode) => {
                    return n.showIcon;
                });

                this._treeNodeService.displayLeafNodes(this.root.key === "root" ? "" : this.root.key);
                this.loaded = true;
            });
    }

    selectNode(node) {
        console.log(`Node selected - ${node.key}`);
        this._treeNodeService.displayLeafNodes("");
        this._treeNodeService.displayLeafNodes(node.key);

    }
    
    ngOnDestroy(){
        console.log(`In OnDestroy - TreeView : ${JSON.stringify(this.root.key)}`);
    }

}
