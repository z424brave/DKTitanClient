import {Injectable} from '@angular/core';
import {HttpClient} from '../../common/http-client';
import {Observable} from 'rxjs/Observable';
import {Notification} from '../directives/notification-center/notification';
import {ApplicationError} from '../../common/error';
import {API_ENDPOINT} from '../../config';
import {NotificationService} from './notification-service';
import {Lexicon} from '../model/lexicon/lexicon';

@Injectable()
export class LexiconService {

    private baseUrl: string;

    constructor(private _httpClient: HttpClient,
				private _notificationService: NotificationService) {
				
        this.baseUrl = API_ENDPOINT.concat('/lexicons/');

    }

    getLexicon(id: string) {

        console.log(`In getLexicon`);

        return Observable.create(observer => {
                this._httpClient.get(this.baseUrl.concat(id))
                    .map((responseData) => {
                        console.log(`Lexicon : ${JSON.stringify(responseData)}`);
                        return responseData.json();
                    })
                    .subscribe(
                        data => {
                            observer.next(data);
                        },
                        err => {
                            this._notificationService.handleError(
                                new ApplicationError(
                                    'Error loading lexicon',
                                    err));
                        },
                        () => {
                            observer.complete();
                        }

                    );

            }

        );

    }

	getLexicons() {

        console.log(`In getLexicons`);

        return Observable.create(observer => {
            this._httpClient.get(`${this.baseUrl}list?status=active`)
                .map((responseData) => {
                    console.log(`Lexicons : ${JSON.stringify(responseData)}`);
                    return responseData.json();
                })
                .subscribe(
                    data => {
                        observer.next(data);
                    },
                    err => {
                        this._notificationService.handleError(
                            new ApplicationError(
                                'Error loading lexicons',
                                err));
                    },
                    () => {
                        observer.complete();
                    }

                );

            }

        );

    }

    saveLexicon(lexicon: Lexicon) {

        if (lexicon.hasOwnProperty('_id')) {

            return this.updateLexicon(lexicon);

        } else {

            return this.createLexicon(lexicon);

        }

    }

    createLexicon(lexicon: Lexicon) {

        return Observable.create(observer => {
                this._httpClient.post(this.baseUrl, JSON.stringify(lexicon))
                    .map((responseData) => {
                        return responseData.json();
                    })
                    .subscribe(
                        data => {
                            observer.next(data);
                            this._notificationService.publish(new Notification(
                                'Lexicon saved successfully',
                                Notification.types.SUCCESS));

                        },
                        err => {
                            this._notificationService.handleError(
                                new ApplicationError(
                                    'Error saving lexicon',
                                    err));
                        },
                        () => {
                            observer.complete();
                        }

                    );

                }

        );

    }

    updateLexicon(lexicon: Lexicon) {

        return Observable.create(observer => {
                this._httpClient.put(this.baseUrl.concat(lexicon._id), JSON.stringify(lexicon))
                    .map((responseData) => {
                        return responseData.json();
                    })
                    .subscribe(
                        data => {
                            observer.next('SUCCESS');
                            this._notificationService.publish(new Notification(
                                'Lexicon updated successfully',
                                Notification.types.SUCCESS));
                        },
                        err => {
                            this._notificationService.handleError(
                                new ApplicationError(
                                    'Error updating lexicon',
                                    err));
                        },
                        () => {
                            observer.complete();
                        }

                    );

                }

        );

    }

    deleteLexicon(lexicon: Lexicon) {

        return Observable.create(observer => {
                this._httpClient.delete(this.baseUrl.concat(lexicon._id))
                    .map((responseData) => {
                        return responseData.json();
                    })
                    .subscribe(
                        data => {
                            observer.next('SUCCESS');
                            this._notificationService.publish(new Notification(
                                'Lexicon deleted successfully',
                                Notification.types.SUCCESS));

                        },
                        err => {
                            this._notificationService.handleError(
                                new ApplicationError(
                                    'Error deleting lexicon',
                                    err));
                        },
                        () => {
                            observer.complete();
                        }

                    );

                }

        );

    }

}
