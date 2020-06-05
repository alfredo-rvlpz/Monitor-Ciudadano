import { User } from './models/user';
import { UserService } from './services/user.service';
import { Component, OnInit } from '@angular/core';
import { AuthService, FacebookLoginProvider, SocialUser } from 'angularx-social-login';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'Frontend';
  user: User ;
  loggedIn: boolean;
  // Secrean los servicios de autentificacion y de usario, el servicio sirve para recuperar informacion del usuario de la base de datos
  // puede encontrar ese servicio en la carperta de servicios
  constructor(
    private userService: UserService,
    private authService: AuthService,
    ) {
      this.user = new User();
    }
  // Esta funcion genera el inicio de sesion del usuario
  signInWithFB() {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }
  // Esta sesion cierra la sesion de usuario en facebook
  signOut(): void {
    this.authService.signOut();
    this.userService.setUser(null);
  }
  // Funcion que se ejecuta en la carga de la pagina cada vez que es acutalizada la pantalla
  async ngOnInit() {
    // Por medio del servicio de autenticacion verifica la sesion y recupera la informacion del usuario de facebook y con esa informacion hace la peticion a la
    // base de datos por medio de la funcion logIn
    this.authService.authState.subscribe(user => {
      if (user != null) {
        this.loggedIn = true;
        this.user.firstName = user.firstName;
        this.user.lastName = user.lastName;
        this.user.email = user.email;
        this.user.photoUrl = user.photoUrl;
        this.userService.logIn(this.user).subscribe(response => {
          if (response[' status' ] === ' success ') {
            this.user.id = response[' data '][' user '][' id '];
            this.user.role_id = response[' data '][' user '][' role_id '];
            this.userService.setUser(this.user);
          }
        });
      } else {
        this.loggedIn = false;
        this.userService.logOutUser();
      }
    });
  }
}
