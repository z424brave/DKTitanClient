/**
 * Created by Damian.Kelly on 14/07/2016.
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
import 'rxjs/Rx';
import {ApplicationType} from "../model/node/application-type";


@Injectable()
export class ApplicationTypeService {

    private baseUrl: string;

    constructor(private _httpClient: HttpClient,
                private _notificationService: NotificationService) {
        this.baseUrl = API_ENDPOINT.concat('/applicationTypes/');
    }

    getApplicationType(id: string) {
        return Observable.create(observer => {
            this._httpClient.get(this.baseUrl.concat(id))
                .map((responseData) => {
                    return responseData.json();
                })
                .subscribe(
                    data => observer.next(data),
                    err => this._notificationService.handleError(
                        new ApplicationError(
                            'Error fetching applicationType',
                            err)
                    ),
                    () => observer.complete()
                );

        });
    }

    listApplicationTypes(searchNode: SearchNode) {

        console.log(`In listApplicationTypes - ${JSON.stringify(searchNode)}`);
        return Observable.create(observer => {
            this._httpClient.getQuery(this.baseUrl.concat('list'), ApplicationTypeService.convertSearchToQuery(searchNode))
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

    createApplicationType(applicationType: ApplicationType) {
        return Observable.create(observer => {
            this._httpClient.post(this.baseUrl, JSON.stringify(applicationType))
                .map((responseData) => {
                    return responseData.json();
                })
                .subscribe(
                    data => {
                        observer.next(data);
                        this._notificationService.publish(
                            new Notification(
                                'ApplicationType saved successfully',
                                Notification.types.SUCCESS)
                        );
                    },
                    err => this._notificationService.handleError(
                        new ApplicationError(
                            'Error saving applicationType',
                            err)
                    ),
                    () => observer.complete()
                );
        });
    }

    updateApplicationType(applicationType: ApplicationType) {
        return Observable.create(observer => {
            console.log(`applicationTypeService / updateApplicationType : ${JSON.stringify(applicationType)}`);
            this._httpClient.put(this.baseUrl.concat(applicationType._id), JSON.stringify(applicationType))
                .map((responseData) => {
                    return responseData.json();
                })
                .subscribe(
                    data => {
                        observer.next(data);
                        this._notificationService.publish(
                            new Notification(
                                'ApplicationType updated successfully',
                                Notification.types.SUCCESS)
                        );
                    },
                    err => this._notificationService.handleError(
                        new ApplicationError(
                            'Error updating ApplicationType',
                            err)
                    ),
                    () => observer.complete()
                );
        });
    }

}
