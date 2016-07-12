import {Component, Output, EventEmitter} from '@angular/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass, NgStyle} from '@angular/common';
import {FILE_UPLOAD_DIRECTIVES, FileUploader, Headers} from 'ng2-file-upload';
import {FileItem} from 'ng2-file-upload/components/file-upload/file-item.class';
import {API_ENDPOINT} from '../../../config';
import {TreeNode} from "../../model/tree-node";
import {TreeView} from "../tree-view/tree-view";
import {TreeNodeService} from "../../service/tree-node-service";
import {Subscription} from 'rxjs/Subscription';
import {S3Service} from "../../service/s3Service";

const UPLOADURL: string = API_ENDPOINT.concat('/nodes/api/');

@Component({
    selector: 'file-upload',
    template: require('./file-upload.html'),
    styles: [require('./file-upload.css')],
    directives: [FILE_UPLOAD_DIRECTIVES, NgClass, NgStyle,
        CORE_DIRECTIVES, FORM_DIRECTIVES, TreeView],
    providers:[TreeNodeService]
})

export class FileUpload extends FileUploader {

    @Output() onUploaded = new EventEmitter<String>();
    @Output() onFileNameSaved = new EventEmitter<String>();
    s3Node: TreeNode = null;
    nodeChange: Subscription;
    currentFolder: string;
    
    constructor(private _treeNodeService: TreeNodeService,
                private _s3Service: S3Service){
        super({url:  UPLOADURL});
        this.setOptions({
            authToken: 'Bearer ' + localStorage.getItem('id_token')
        });
        this.onSuccessItem = this.handleSuccess;
        this.s3Node = new TreeNode('root','/', '');
        this.nodeChange = this._treeNodeService.showNodeChange.subscribe(
            node => {
                this.currentFolder = node;
                console.log(`Node Change to - ${this.currentFolder}`);
            })
        console.log(`Upload URL is ${UPLOADURL}`);
        
    }

    public uploadURL:string = API_ENDPOINT.concat('/nodes/api/');
//    public uploader:FileUploader = new FileUploader({url: this.uploadURL});
    public uploader:FileUploader = this;
    public fileUploaded:boolean = false;
    public fileUploadedName:string = '';
    public hasBaseDropZoneOver:boolean = false;

    public fileOverBase(e:any):void {
        this.hasBaseDropZoneOver = e;
    };

    public handleSuccess(item: FileItem, response: any, status: any, headers: Headers): any {

        console.log(`success for ${item.file.name}`);
        this.fileUploadedName = item.file.name;
        this.onUploaded.emit(item.file.name);
        this.clearQueue();
        this.fileUploaded = true;
        console.log(`success for ${this.fileUploadedName}`);
        return { item: item, response: response, status: status, headers: headers };
    };

    public removeUpload() {
        let uploadedFile = this.queue[0].file.name;
        console.log(`File uploaded is ${uploadedFile}`);
        console.log(`File uploaded is ${this.fileUploadedName}`);
        this.clearQueue();
        this.fileUploaded = true;
        this.onUploaded.emit(uploadedFile);
    };

    public saveFileName($event) {

        console.log(`saveFileName - ${JSON.stringify($event)}`);
        $event.preventDefault();
        
        let newFileName: string = this.currentFolder.concat(this.fileUploadedName);
        console.log(`saveFileName - File uploaded is : ${newFileName}`);

        this._s3Service.createFile(newFileName)
            .subscribe(res => {
                console.log(`after call to s3 createFile - ${JSON.stringify(res)}`);
                this.onFileNameSaved.emit(newFileName);
            });

    }
}
