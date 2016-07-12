import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {AuthHttp} from 'angular2-jwt';

const CONTENT_TYPE: string = 'Content-Type';
const APP_JSON:     string = 'application/json';

@Injectable()
export class HttpClient {

    constructor(private _http: Http,
                private _authHttp: AuthHttp) {

    }

    //TODO add interceptor: if 401/403 => logout

    getQuery(url, searchParams) {
        let headers = new Headers();
        return this._authHttp.get(url, {
            headers: headers,
            search: searchParams
        });
    }

    get(url) {
        let headers = new Headers();
        return this._authHttp.get(url, {
            headers: headers
        });
    }

    post(url, data) {
        let headers = new Headers();
        headers.append(CONTENT_TYPE, APP_JSON);
        return this._authHttp.post(url, data, {
            headers: headers
        });
    }

    postUnsec(url, data) {
        let headers = new Headers();
        headers.append(CONTENT_TYPE, APP_JSON);
        return this._http.post(url, data, {
            headers: headers
        });
    }

    put(url, data) {
        let headers = new Headers();
        headers.append(CONTENT_TYPE, APP_JSON);
        return this._authHttp.put(url, data, {
            headers: headers
        });
    }

    delete(url) {
        let headers = new Headers();
        headers.append(CONTENT_TYPE, APP_JSON);
        return this._authHttp.delete(url, {
            headers: headers
        });
    }

}
