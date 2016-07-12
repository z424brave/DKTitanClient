import {Injectable} from '@angular/core';
import {User} from './../model/user/user';
import {HttpClient} from '../http-client';
import {Observable} from 'rxjs/Observable';
import {NotificationService} from './notification-service';
import {Notification} from '../directives/notification-center/notification';
import {ApplicationError} from '../error';
import {API_ENDPOINT} from '../../config';

@Injectable()
export class UserService {

    private baseUrl: string;

    constructor(private _httpClient: HttpClient,
                private _notificationService: NotificationService) {
        this.baseUrl = API_ENDPOINT.concat('/users/');
    }

    getUsers() {
        return Observable.create(observer => {
            this._httpClient.get(this.baseUrl.concat('list'))
                .map((responseData) => {
                    return responseData.json();
                })
                .subscribe(
                    data => observer.next(data),
                    err => this._notificationService.handleError(
                        new ApplicationError(
                            'Error loading users',
                            err)
                    ),
                    () => observer.complete()
                );

        });
    };

    getUser(id: string) {
        return Observable.create(observer => {
            this._httpClient.get(this.baseUrl.concat(id))
                .map((responseData) => {
                    return responseData.json();
                })
                .subscribe(
                    data => observer.next(data),
                    err => this._notificationService.handleError(
                        new ApplicationError(
                            'Error loading user',
                            err)
                    ),
                    () => observer.complete()
                );
        });
    };

    saveUser(user: User) {

        return Observable.create(observer => {
            var response;
            if (!user.hasOwnProperty('_id')) {
                response = this._httpClient.post(this.baseUrl, JSON.stringify(user))
                    .map((responseData) => {
                        return responseData.json();
                    });

            } else {
                response = this._httpClient.put(this.baseUrl.concat(user._id), JSON.stringify(user))
                    .map((responseData) => {
                        return responseData.json();
                    });
            }
            response.subscribe(
                data => {
                    observer.next(data);
                    this._notificationService.publish(
                        new Notification(
                            'User saved successfully',
                            Notification.types.SUCCESS)
                    );
                },
                err => {
                    var message = 'Error saving user';
                    if(err.status === 422){
                        message = err._body
                    }
                    this._notificationService.handleError(
                        new ApplicationError(
                            message ,
                            err)
                    )
                },
                () => observer.complete()
            );
        });

    }

}
