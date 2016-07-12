import {Injectable} from '@angular/core';
import {TreeNode} from '../model/tree-node';

@Injectable()
export class LeafNodeService{

  private _selectedNodeLeafNodes: Array<TreeNode> = [];

  constructor(){
  }

  setLeafNodes(leafNodes){
    this._selectedNodeLeafNodes = leafNodes;
    console.log(`In leafNodeService - leafs : ${this._selectedNodeLeafNodes.length}`);
  }

  getLeafNodes(){
    return this._selectedNodeLeafNodes;
  }

}
