import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SpotifyService } from '../service/spotify.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  nomUser: string;
  monservice: SpotifyService;
  newPlaylistOn: boolean;
  nomPlaylist: string;

  @Output()
  userConnectedEmitter = new EventEmitter<string>();
  @Output()
  userDeconnectedEmitter = new EventEmitter<boolean>();

  /* l'initialisation
  du service dans le constructeur est indispensable*/

  constructor(service: SpotifyService) {
    this.newPlaylistOn = false;
    this.monservice = service;
    this.monservice.isConnected = false;
  }

  /* fonction quii gère la déconnexion*/
  deconnexion() {
    this.monservice.isConnected = false;
    this.userDeconnectedEmitter.emit(false);
  }

  /* indique qu'on a activé la visibilité du formulaire des playlists*/
  formNewPlaylistOn() {
    this.newPlaylistOn = true;
  }

  /* initialise un user */
  initUser() {
    console.log('le contenu de nomUser :' + this.nomUser);
    /* on donne le nom du user au service */
    this.monservice.ajoutUserName(this.nomUser);

    if (this.nomUser != null) {
      /* on indique que le user est connecté */
      this.monservice.isConnected = true;
      /* on envoie l'info que l'utilisateur est connecté */
      this.userConnectedEmitter.emit('this.nomUser');
    }

    /* test pour vérifier que le nom d'utilsateur est
    bien récupéré */

    console.log("l'utilisateur connecté est : " + this.monservice.login);

    /* on envoie à playlist l'info que le user est connecté */
    
  }

  ngOnInit() {}
}
