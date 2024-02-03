import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Playlist, Track } from '../model/modele';
import { SpotifyService } from '../service/spotify.service';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css'],
})
export class PlaylistComponent implements OnInit {
  /* service que l'on va utiliser pour stocker et afficher les playlists*/

  monService: SpotifyService;
  nomUser: string;
  isconnected: boolean;
  newPlaylistOn: boolean;
  /*indique le nom de la playlist que l'on souhaite créer*/
  nomPlaylist: string;
  /*récupère les infos de la playlist choisie*/
  playlistChosen: Playlist;
  /* ensemble de playlist créée par le user*/
  listDePlaylist: Playlist[];
  /* compte le nombre de playlist dans la liste de playlist*/
  compteurPlaylist: number;
  /* variable qui indique qu'il faut indiquer le contenu d'une playlist */
  displayPlaylistOn: boolean;
  /* champ qui contient les titres d'une playlist*/
  playlistContent: Track[];

  /* émetteur qui va permettre d'envoyer la listes des playlists au père (app.component) à chaque fois 
  que celle-ci est mise à jour
  pour que les autres composants puissent s'en servir
  */
  @Output()
  serviceEmit = new EventEmitter<SpotifyService>();

  /* l'initialisation
  du service dans le constructeur est indispensable*/

  constructor(service: SpotifyService) {
    this.newPlaylistOn = false;
    this.monService = service;
    /* au départ il n'y a pas track dans la liste de musique*/
    this.playlistContent = [];
    this.monService.playlists = [];
    this.monService.isConnected = false;

    console.log(
      'côté playlist le user est connecté : ' + this.monService.isConnected
    );
    /* au départ il ne faut pas afficher la playlist*/
    this.displayPlaylistOn = false;
    /* on initialise la liste de playlist*/
    this.listDePlaylist = [];
    this.compteurPlaylist = 0;
  }

  /* fonction qui gère la déconnexion*/

  deconnexion() {
    this.monService.isConnected = false;
  }

  /* fonction qui indique la connexion de l'utilisateur avec son nom*/
  userConnected(nom: string) {
    /*le nom du user est "nom"*/
    this.monService.login = nom;
    /* l'utilisateur est connecté */
    this.monService.isConnected = true;
  }

  /* fonction qui indique la déconnexion de l'utilisateur et met son nom à null*/
  userDeconnected(nom: boolean) {
    /*le nom du user passe à null */
    this.monService.login = null;
    /*l'utilisateur n'est plus connecté*/
    this.monService.isConnected = false;
  }

  /* indique qu'on a activé la visibilité du formulaire des playlists*/

  formNewPlaylistOn() {
    this.newPlaylistOn = true;
  }

  /* fonction qui ajoute une playlist à la liste des playlist du service en enregistrant ses infos*/

  addNewNamePlaylist() {
    this.monService
      .createPlayListUser(this.monService.login)
      .subscribe((datas) => {
        /* on donne à cette playlist le nom que le user avait choisi*/
        datas.name = this.nomPlaylist;
        /* on ajoute une playlist à la liste de playlists */
        this.listDePlaylist.push(datas);
        this.monService.playlists.push(datas);
        /* on incrémente le nombre de playlist existante*/
        this.compteurPlaylist += 1;
      });

    /*on envoie les infos sur la nouvelle playlist au père pour qu'il la transmette aux autres enfants*/
    this.serviceEmit.emit(this.monService);
  }

  /*fonction qui permet d'afficher le contenu d'une playlist
  id correspond à l'id de la playlist
  */
  showPlaylistContent(chosen: Playlist) {
    /* on indique qu'il faudra afficher le contenu de la playlist*/
    this.displayPlaylistOn = true;
    this.monService.RecupSong(this.monService.login, chosen.id).subscribe(
      (datas) =>
        /* on récupère les titres qui composent chaque playlist*/
        (this.playlistContent = datas)
    );

    if (this.playlistContent.length <= 0) {
      console.log("il n'y a pas de musique dans la playlist ");
    }
  }

  /*permet de supprimer définitivement une playlist lorsque son ID est donné en argument.*/

  deletePlaylist(playlistId: string) {
    this.monService
      .deletePlaylist(this.monService.login, playlistId)
      .subscribe((reponse) =>
        console.log('la suppression de la playlist a fonctionné ? : ' + reponse)
      );
  }

  ngOnInit() {}
}
