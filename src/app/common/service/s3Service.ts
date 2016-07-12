import {Injectable} from '@angular/core';
import {HttpClient} from '../http-client';
import {Observable} from 'rxjs/Observable';
import {NotificationService} from './notification-service';
import {ApplicationError} from '../error';
import {API_ENDPOINT} from '../../config';

@Injectable()
export class S3Service {

    private baseUrl: string;

    constructor(private _httpClient: HttpClient,
                private _notificationService: NotificationService) {
        this.baseUrl = API_ENDPOINT.concat('/s3');
    }

    list(s3Prefix: string) {
		console.log(`In s3 / list - ${s3Prefix}`);
        let dirName = s3Prefix === "/" ? s3Prefix.slice(0, -1) : s3Prefix;

        return Observable.create(observer => {
            this._httpClient.get(`${this.baseUrl}?dirName=${dirName}`)
                .map((responseData) => {
                    console.log(`In s3 / list - ${dirName} - after get ${JSON.stringify(responseData.json())}`);
                    return responseData.json();
                })
                .subscribe(
                    data => observer.next(data),
                    err => this._notificationService.handleError(
                        new ApplicationError(
                            'Error loading from S3',
                            err)
                    ),
                    () => observer.complete()
                );

        });
    };

    createFolder(newFolder: string) {
        console.log(`In s3 / createFolder - ${newFolder}`);
        return Observable.create(observer => {
            this._httpClient.put(`${this.baseUrl}?dirName=${newFolder}`,'')
                .map((responseData) => {
                    console.log(`In s3 / createFolder - ${newFolder} - after put ${JSON.stringify(responseData.json())}`);
                    return responseData.json();
                })
                .subscribe(
                    data => observer.next(data),
                    err => this._notificationService.handleError(
                        new ApplicationError(
                            'Error updating S3',
                            err)
                    ),
                    () => observer.complete()
                );

        });
    };

    createFile(newFile: string) {
        console.log(`In s3 / createFile - ${newFile}`);
        return Observable.create(observer => {
            this._httpClient.put(`${this.baseUrl}?fileName=${newFile}`,'')
                .map((responseData) => {
                    console.log(`In s3 / createFile - ${newFile} - after put ${JSON.stringify(responseData.json())}`);
                    return responseData.json();
                })
                .subscribe(
                    data => observer.next(data),
                    err => this._notificationService.handleError(
                        new ApplicationError(
                            'Error updating S3',
                            err)
                    ),
                    () => observer.complete()
                );

        });
    };
}
