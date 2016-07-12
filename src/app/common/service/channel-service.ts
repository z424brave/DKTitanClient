import {Injectable} from '@angular/core';
import {Channel} from './../model/channel/channel';
import {HttpClient} from '../http-client';
import {Observable} from 'rxjs/Observable';
import {NotificationService} from './notification-service';
import {Notification} from '../directives/notification-center/notification';
import {ApplicationError} from '../error';
import {API_ENDPOINT} from '../../config';

@Injectable()
export class ChannelService {

    private baseUrl: string;

    constructor(private _httpClient: HttpClient,
                private _notificationService: NotificationService) {
        this.baseUrl = API_ENDPOINT.concat('/channels/');
    }

    getChannels() {
        return Observable.create(observer => {
            this._httpClient.get(this.baseUrl.concat('list'))
                .map((responseData) => {
                    return responseData.json();
                })
                .subscribe(
                    data => observer.next(data),
                    err => this._notificationService.handleError(
                        new ApplicationError(
                            'Error loading channels',
                            err)
                    ),
                    () => observer.complete()
                );

        });
    };

    getChannel(id: string) {
        return Observable.create(observer => {
            this._httpClient.get(this.baseUrl.concat(id))
                .map((responseData) => {
                    return responseData.json();
                })
                .subscribe(
                    data => observer.next(data),
                    err => this._notificationService.handleError(
                        new ApplicationError(
                            'Error loading channel',
                            err)
                    ),
                    () => observer.complete()
                );
        });
    };

    saveChannel(channel: Channel) {
        var that = this;
        return Observable.create(observer => {
            var response;
            if (!channel.hasOwnProperty('_id')) {
                response = this._httpClient.post(this.baseUrl, JSON.stringify(channel))
                    .map((responseData) => {
                        return responseData.json();
                    });

            } else {
                response = this._httpClient.put(this.baseUrl.concat(channel._id), JSON.stringify(channel))
                    .map((responseData) => {
                        return responseData.json();
                    });
            }
            response.subscribe(
                data => {
                    observer.next(data);
                    that._notificationService.publish(
                        new Notification(
                            'Channel saved successfully',
                            Notification.types.SUCCESS)
                    );
                },
                err => {
                    var message = 'Error saving channel';
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
