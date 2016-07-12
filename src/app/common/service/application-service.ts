/**
 * Created by Damian.Kelly on 01/07/2016.
 */
import {Injectable} from '@angular/core';
import {URLSearchParams} from '@angular/http';
import {HttpClient} from '../http-client';
import {NotificationService} from './notification-service';
import {API_ENDPOINT} from '../../config';
import {ApplicationError} from '../error';
import {Observable} from 'rxjs/Observable';
import {SearchNode} from './../model/node/search-node';
import {Notification} from '../directives/notification-center/notification';
import {Application} from '../model/node/application';
import 'rxjs/Rx';


@Injectable()
export class ApplicationService {

    private baseUrl: string;

    constructor(private _httpClient: HttpClient,
                private _notificationService: NotificationService) {
        this.baseUrl = API_ENDPOINT.concat('/applications/');
    }

    getApplication(id: string) {
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

    listApplications(searchNode: SearchNode) {

        console.log(`In listApplications - ${JSON.stringify(searchNode)}`);
        return Observable.create(observer => {
            this._httpClient.getQuery(this.baseUrl.concat('list'), ApplicationService.convertSearchToQuery(searchNode))
                .map((responseData) => {
                    console.log(`list applications - ${JSON.stringify(responseData)}`);
                    return responseData.json();
                })
                .subscribe(
                    data => observer.next(data),
                    err => this._notificationService.handleError(
                        new ApplicationError(
                            'Error loading applications for search ',
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

    createApplication(application: Application) {
        return Observable.create(observer => {
            this._httpClient.post(this.baseUrl, JSON.stringify(application))
                .map((responseData) => {
                    return responseData.json();
                })
                .subscribe(
                    data => {
                        observer.next(data);
                        this._notificationService.publish(
                            new Notification(
                                'Application saved successfully',
                                Notification.types.SUCCESS)
                        );
                    },
                    err => this._notificationService.handleError(
                        new ApplicationError(
                            'Error saving application',
                            err)
                    ),
                    () => observer.complete()
                );
        });
    }


    updateApplication(application: Application) {
        return Observable.create(observer => {
            console.log(`applicationService / updateApplication : ${JSON.stringify(application)}`);
            this._httpClient.put(this.baseUrl.concat(application._id), JSON.stringify(application))
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

    publishApplication(application: Application, targetFileName: string) {
        return Observable.create(observer => {
            console.log(`contentService / publishApplication : ${JSON.stringify(application)}`);
            this._httpClient.put(this.baseUrl.concat('publish/').concat(application._id).concat('?fileName=').concat(targetFileName), JSON.stringify(application))
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
}
