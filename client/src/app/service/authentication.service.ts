import {Injectable} from "@angular/core";
import {LOGIN, REGISTER} from "./api.urls";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import {User} from "../model/user";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {UserService} from "./user.service";

export const CURRENT_USER: string = 'currentUser';
export const JWT_TOKEN: string = 'jwt';

@Injectable()
export class AuthenticationService {

  private user: User;
  private authenticatedUser = new BehaviorSubject<any>(null);
  private currentUser = this.authenticatedUser.asObservable();

  constructor(private router: Router,
              private userService: UserService,
              private http: HttpClient) {}

  registerUser(user: User) {
    return this.http.post(REGISTER.baseUrl, user).subscribe(response => {
      this.router.navigate(['/home']);
    });
  }

  login(user: User) {
    return this.http.post(LOGIN.baseUrl, user, { observe: 'response' }).subscribe(response => {
      localStorage.setItem(JWT_TOKEN, response.headers.get('authorization'));
      this.userService.getByUsername(user.username).subscribe((data: User) => {
        localStorage.setItem(CURRENT_USER, JSON.stringify(data));
        this.setAuthenticatedUser(data);
        this.router.navigate(['/home']);
      });
    }, error => {
      console.log(error);
    });
  }


  logout(): void {
    this.currentUser = null;
    localStorage.removeItem(JWT_TOKEN);
    localStorage.removeItem(CURRENT_USER);
    this.router.navigate(['/home']);
  }

  getCurrentUser(): Observable<any> {
    if (!this.authenticatedUser.getValue()) {
      this.user = JSON.parse(localStorage.getItem(CURRENT_USER));
      if (this.user) {
        this.setAuthenticatedUser(this.user);
      }
    }
    return this.authenticatedUser.asObservable();
  }

  setAuthenticatedUser(user: User) {
    this.authenticatedUser.next(user);
  }

}
