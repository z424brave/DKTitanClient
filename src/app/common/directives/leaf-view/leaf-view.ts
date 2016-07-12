import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {TreeNode} from '../../model/tree-node';
import {TreeNodeService} from "../../service/tree-node-service";
import {ImageBox} from "../image-box/image-box";
import {PaginatePipe, PaginationControlsCmp, PaginationService} from 'ng2-pagination';
import {EXTERNAL_URL_PREFIX} from '../../../config';

@Component({
  template: require('./leaf-view.html'),
  styles: [require('./leaf-view.css')],
  selector:'leaf-view',
  providers: [PaginationService],
  pipes: [PaginatePipe],
  directives: [PaginationControlsCmp, ImageBox]

})

export class LeafView implements OnInit, OnDestroy{

  @Input() urlPrefix: string = EXTERNAL_URL_PREFIX ;
  leafs: Array<TreeNode> = [];
  subscription: Subscription;
  leafsPerPage: number = 6;

  constructor(private _treeNodeService: TreeNodeService){

  }

  ngOnInit(){
    console.log(`In OnInit - LeafView`);
    this.subscription = this._treeNodeService.showLeafNodesChanges.subscribe(
        leafs => {
          console.log(`Received leafs count - ${leafs.length}`);
          console.log(`Received leafs data  - ${JSON.stringify(leafs)}`);
          this.leafs = leafs;
        })
  }

  ngOnDestroy(){
    console.log(`In OnDestroy - LeafView : `);
    this.subscription.unsubscribe();
  }

}
