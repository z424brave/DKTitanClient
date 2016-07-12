import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {S3Service} from '../../../service/s3Service'
import {TreeNode} from '../../../model/tree-node';
import {treeNodeReducer} from './tree-node-reducer';

@Injectable()
export class Store{

  private dispatcher = new Subject<any>();
  private treeNodes = {};

  private nodes = {};
  private selectedNode = {};  

  constructor(private _s3Service: S3Service){
    this.dispatcher.subscribe((action) => this.handleAction(action));
  }

  private handleAction(action) {

    console.log(`In Store - ${JSON.stringify(action)}`);
    if(action.name === 'LOAD_NODES') {
          if (this.nodes[action.key]) {
              console.log(`in action LOAD_NODES - ${JSON.stringify(this.nodes[action.key])}`);
              this.treeNodes[action.key].next(this.nodes[action.key]);
          }
          else {
              console.log(`calling S3 with ${action.url}`);
              this._s3Service.list(action.url)
                  .subscribe(res => {
                      console.log(`after call to s3 list - ${JSON.stringify(res)}`);
                      this.nodes[action.key] = treeNodeReducer(this.convertS3ToNodes(res), action);
                      this.treeNodes[action.key].next(this.nodes[action.key]);
                  });
          }
    }
      console.log(`In Store - ${JSON.stringify(action)}`);
      if(action.name === 'SELECT_NODE') {
          console.log(`in action SELECT_NODE - ${JSON.stringify(action)}`);
          if (this.treeNodes[action.key]) {
              console.log(`in action SELECT_NODE - `);
//              this.selectedNode = treeNodeReducer(this.treeNodes[action.key], action)
//              this.selectedNode = this.treeNodes[action.key];
              this.treeNodes[action.key].next(this.nodes[action.key]);
          }
    }
  }

  getTreeNodes(key){
      console.log(`in getTreeNodes : ${key}`);
      if(!this.treeNodes.hasOwnProperty(key)){
          this.treeNodes[key] = new Subject<Array<TreeNode>>();
      }
      return this.treeNodes[key].asObservable();
  }

  getLeafNodes(key){
        console.log(`in getLeafNodes (store) : ${key}`);
        if(!this.treeNodes.hasOwnProperty(key)){
            this.treeNodes[key] = new Subject<Array<TreeNode>>();
        }
        return this.treeNodes[key].asObservable();
  }

  getSelectedNode(key) {
      console.log(`in getSelectedNode : ${key}`);
      this.selectedNode[key] = new Subject<TreeNode>();
      return this.selectedNode[key].asObservable();
  }
    
  dispatchAction(action){
    console.log(`in dispatchAction : ${JSON.stringify(action)}`);
    this.dispatcher.next(action);
  }

  convertS3ToNodes(data) {
        let leafNodes = data.Contents.map(n => {
            return new TreeNode(n.Key,null,n.Key.replace(data.Prefix, ""));
        });
        let dataNodes = data.CommonPrefixes.map(n => {
            return new TreeNode(n.Prefix,this.removeDelimiter(n.Prefix),this.removeDelimiter(n.Prefix).replace(data.Prefix, ""));
        });
        return dataNodes.concat(leafNodes);
  }
    
   removeDelimiter(key) {
       return key.slice(0,-1);
   }
}