import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {S3Service} from './s3Service';
import {TreeNode} from '../model/tree-node';

@Injectable()

export class TreeNodeService {

    private _treeNodes: any = {};
    private _leafNodes: any = {};
    private _defaultPrefix: string = "/";

    private _showLeafNodes = new Subject<Array<TreeNode>>();
    private _showCurrentNode = new Subject<string>();    

    showLeafNodesChanges = this._showLeafNodes.asObservable();
    showNodeChange       = this._showCurrentNode.asObservable();
    
    constructor(private _s3Service:S3Service) {

    }

    loadTreeNodes(root) {

        console.log(`TreeNodeService / loadTreeNodes - ${JSON.stringify(root)}`);

        return Observable.create(observer => {

            this._s3Service.list(root.url)
                .subscribe(res => {
                    console.log(`after call to s3 list - ${JSON.stringify(res)}`);
                    observer.next(this.convertS3ToNodes(res));
                });
        });
    }

    convertS3ToNodes(data: any) {
        let prefix: string = this._defaultPrefix.concat(data.Prefix);
        this._leafNodes[prefix] = data.Contents.filter(n => {
            return (!(n.Key === data.Prefix))
        }).map(n => {
            return new TreeNode(n.Key, null, n.Key.replace(data.Prefix, ""));
        });
        this._treeNodes[prefix] = data.CommonPrefixes.map(n => {
            return new TreeNode(n.Prefix, TreeNodeService.removeDelimiter(n.Prefix), TreeNodeService.removeDelimiter(n.Prefix).replace(data.Prefix, ""));
        });
        console.log(`in convertS3ToNodes - ${prefix} : ${this._leafNodes[prefix].length}`);
        return this._treeNodes[prefix].concat(this._leafNodes[prefix]);
    }
    
    static removeDelimiter(key) {
        return key.slice(0,-1);
    }

    displayLeafNodes(key: string) {
        console.log(`in getLeafNodes - ${key}`);
        this._showLeafNodes.next(this.getLeafNodes(key));
        this._showCurrentNode.next(key);
    }

    getLeafNodes(key) : Array<TreeNode> {
        console.log(`in getLeafNodes - ${key} : ${this._defaultPrefix.concat(key)} : leafs : ${this._leafNodes[this._defaultPrefix.concat(key)]}`);
        return this._leafNodes[this._defaultPrefix.concat(key)] ? this._leafNodes[this._defaultPrefix.concat(key)] : [];
    }

}
