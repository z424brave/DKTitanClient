import {Injectable} from '@angular/core';
import {tokenNotExpired, JwtHelper} from 'angular2-jwt';
import {Observable} from '../../../node_modules/rxjs/Observable';
import {HttpClient} from '../common/http-client';
import {API_ENDPOINT} from '../config';
import {User} from '../common/model/user/user';
import {LoginUser} from './../common/model/user/login-user';
import {ApplicationError} from '../common/error';
import {NotificationService} from '../common/service/notification-service';

@Injectable()
export class AuthService {

    currentUser: User;

    private baseUrl: string;

    private jwtHelper: JwtHelper;

    constructor(private _httpClient: HttpClient,
                private _notificationService: NotificationService) {
        this.baseUrl = API_ENDPOINT.concat('/auth/local/');
		console.log(`baseurl : ${this.baseUrl}`)
        this.jwtHelper = new JwtHelper();
        //the user doesn't need to login as long as the token is valid
        if (tokenNotExpired()) {
            let idToken = localStorage.getItem('id_token');
            let token = this.jwtHelper.decodeToken(idToken);
            this.currentUser = new User();
            this.currentUser._id = token._id;
            this.currentUser.name = token.name;
            this.currentUser.roles = token.roles;
			console.log(`existing token - ${this.currentUser.name}`);	
        }

    }

    authenticate(user: LoginUser) {
		console.log(`in authenticate - ${user.email}`);	
        this.logout();
		console.log(`in authenticate after logout - ${user.email}`);			
        return Observable.create(observer => {
			console.log(`in authenticate in create - ${user.email}`);
			console.log(`API Endpoint is ${API_ENDPOINT}`);
			console.log(`URL is ${this.baseUrl}`);
			console.log(JSON.stringify(user));			
            this._httpClient.postUnsec(this.baseUrl, JSON.stringify(user))
                .subscribe(
                    response => {
                        var idToken = response.json().token;
                        localStorage.setItem('id_token', idToken);
                        let token = this.jwtHelper.decodeToken(idToken);
                        console.log(`Token is ${idToken}`); 
                        console.log(`Token is ${JSON.stringify(token)}`);					
                        //TODO get the user from the response object;
                        this.currentUser = new User();
                        this.currentUser._id = token._id;
                        this.currentUser.name = token.name;
                        this.currentUser.roles = token.roles;
                        observer.next('SUCCESS');
                    },
                    err => {
						console.log(`in authenticate err - ${JSON.stringify(err)}`);
                        if (err.status === 401) {
                            let jsonResponse = JSON.parse(err._body);
                            let errResponse = jsonResponse.message ? jsonResponse.message : 'ACCESS_DENIED' ;
                            console.log(`in 401 : ${JSON.stringify(jsonResponse)} / ${errResponse}`);
                            observer.next(errResponse);
                        } else {
                            this._notificationService.handleError(
                                new ApplicationError(
                                    'Authentication error',
                                    err));
                            observer.error(err);
                        }

                    }
                    ,
                    () => observer.complete()
                );
        });
    }

    authorise(role: string) {
        return tokenNotExpired() &&
            ( ( this.currentUser.roles.indexOf('admin') > -1 ) || ( this.currentUser.roles.indexOf(role) > -1 ) );
//            ( ( this.currentUser.roles.filter((r: Role) => {return r.name ==='admin'}) ) || ( this.currentUser.roles.filter((r: Role) => {return r.name === role}) ) );
        
    }

    logout() {
        localStorage.removeItem('id_token');
    }

}
