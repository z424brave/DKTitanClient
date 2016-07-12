import {Injectable} from '@angular/core';
import {URLSearchParams} from '@angular/http';
import {HttpClient} from '../http-client';
import {NotificationService} from './notification-service';
import {API_ENDPOINT} from '../../config';
import {ApplicationError} from '../error';
import {Observable} from 'rxjs/Observable';
import {ContentNode} from './../model/node/content-node';
import {SearchNode} from './../model/node/search-node';
import {Notification} from '../directives/notification-center/notification';
import {Content} from '../model/node/content';
import 'rxjs/Rx';


@Injectable()
export class ContentService {

    private baseUrl: string;

    constructor(private _httpClient: HttpClient,
                private _notificationService: NotificationService) {
        this.baseUrl = API_ENDPOINT.concat('/nodes/');
    }

    getNode(id: string) {
        return Observable.create(observer => {
            this._httpClient.get(this.baseUrl.concat(id))
                .map((responseData) => {
                    return responseData.json();
                })
                .subscribe(
                    data => observer.next(data),
                    err => this._notificationService.handleError(
                        new ApplicationError(
                            'Error loading node',
                            err)
                    ),
                    () => observer.complete()
                );

        });
    }

    getUserNodes(userId: string) {
	    console.log(`In getUserNodes - ${userId}`);
        return Observable.create(observer => {
            this._httpClient.get(`${this.baseUrl}list?user=${userId}`)
                .map((responseData) => {
					console.log(`getUserNodes - ${JSON.stringify(responseData)}`);
                    return responseData.json();
                })
                .subscribe(
                    data => observer.next(data),
                    err => this._notificationService.handleError(
                        new ApplicationError(
                            'Error loading nodes for user ' + userId,
                            err)
                    ),
                    () => observer.complete()
                );

        });
    };
    static convertSearchToQuery(searchNode: SearchNode) : URLSearchParams {

        let params: URLSearchParams = new URLSearchParams();

        for (var property in searchNode) {
            if (searchNode.hasOwnProperty(property)) {

                console.log(`${property} : ${searchNode[property]}`);

                if (searchNode[property]) {

                    if (searchNode[property] instanceof Array) {
                        if (searchNode[property].length > 0) {
                            params.set(property, searchNode[property]);
                        }
                    } else {
                        params.set(property, searchNode[property]);
                    }

                }
            }
        }

        return params;
    }

	searchNodes(searchNode: SearchNode) {

		console.log(`In searchNodes - ${JSON.stringify(searchNode)}`);
        return Observable.create(observer => {
            this._httpClient.getQuery(`${this.baseUrl}list`, ContentService.convertSearchToQuery(searchNode))
                .map((responseData) => {
					console.log(`searchNodes - ${JSON.stringify(responseData)}`);
                    return responseData.json();
                })
                .subscribe(
                    data => observer.next(data),
                    err => this._notificationService.handleError(
                        new ApplicationError(
                            'Error loading nodes for search ' + searchNode.user,
                            err)
                    ),
                    () => observer.complete()
                );

        });
    };
	
    createNode(node: ContentNode) {
        return Observable.create(observer => {
            this._httpClient.post(this.baseUrl, JSON.stringify(node))
                .map((responseData) => {
                    return responseData.json();
                })
                .subscribe(
                    data => {
                        observer.next(data);
                        this._notificationService.publish(
                            new Notification(
                                'Node saved successfully',
                                Notification.types.SUCCESS)
                        );
                    },
                    err => this._notificationService.handleError(
                        new ApplicationError(
                            'Error saving node',
                            err)
                    ),
                    () => observer.complete()
                );
        });
    }


    updateNode(node: ContentNode) {
        return Observable.create(observer => {
			console.log(`contentService / updateNode : ${JSON.stringify(node)}`);
            this._httpClient.put(this.baseUrl.concat(node._id), JSON.stringify(node))
                .map((responseData) => {
                    return responseData.json();
                })
                .subscribe(
                    data => {
                        observer.next(data);
                        this._notificationService.publish(
                            new Notification(
                                'Node updated successfully',
                                Notification.types.SUCCESS)
                        );
                    },
                    err => this._notificationService.handleError(
                        new ApplicationError(
                            'Error updating node',
                            err)
                    ),
                    () => observer.complete()
                );
        });
    }

    publishNode(node: ContentNode, targetFileName: string) {
        return Observable.create(observer => {
            console.log(`contentService / publishNode : ${JSON.stringify(node)}`);
            this._httpClient.put(this.baseUrl.concat('publish/').concat(node._id).concat('?fileName=').concat(targetFileName), JSON.stringify(node))
                .map((responseData) => {
                    return responseData.json();
                })
                .subscribe(
                    data => {
                        observer.next(data);
                        this._notificationService.publish(
                            new Notification(
                                'Node updated successfully',
                                Notification.types.SUCCESS)
                        );
                    },
                    err => this._notificationService.handleError(
                        new ApplicationError(
                            'Error updating node',
                            err)
                    ),
                    () => observer.complete()
                );
        });
    }

    addContent(nodeId: string, content: Content){
        return Observable.create(observer => {
            this._httpClient.post(this.baseUrl.concat(nodeId).concat('/contents/'), JSON.stringify(content))
                .map((responseData) => {
                    return responseData.json();
                })
                .subscribe(
                    data => {
                        observer.next(data);
                        this._notificationService.publish(
                            new Notification(
                                'Content added successfully',
                                Notification.types.SUCCESS)
                        );
                    },
                    err => this._notificationService.handleError(
                        new ApplicationError(
                            'Error adding content',
                            err)
                    ),
                    () => observer.complete()
                );
        });
    }


    fetchNodeContent(nodeId: string) {

        return Observable.create(observer => {
            this._httpClient.get(this.baseUrl.concat(nodeId + '/contents'))
                .map((responseData) => {
                    return responseData.json();
                })
                .subscribe(
                    data => observer.next(data),
                    err => this._notificationService.handleError(
                        new ApplicationError(
                            'Error loading content from node',
                            err)
                    ),
                    () => observer.complete()
                );

        });

    }

    deleteNode(nodeId: string){
        return Observable.create(observer => {
            this._httpClient.delete(this.baseUrl.concat(nodeId))
                .map((responseData) => {
					console.log(`return from delete - ${JSON.stringify(responseData)}`);
                    return responseData.json();
                })
                .subscribe(
                    data => observer.next('SUCCESS'),
                    err => this._notificationService.handleError(
                        new ApplicationError(
                            'Error removing node',
                            err)
                    ),
                    () => observer.complete()
                );
        });

    }


}