import { Component, Input, OnInit } from '@angular/core';
import { SpotifyService } from '../service/spotify.service';
import { Album, Artist, Playlist, Track } from '../model/modele';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css'],
})
export class AlbumComponent implements OnInit {
  /* indique si l'on cherche des musiques par album :
  elle vaut true quand on clique sur la partie 
  de recherche par nom d'album et false sinon*/
  searchAlbumOn: boolean;

  /* indique si on a trouvé des musiques associées à un album */
  musicAlbumFound: boolean;
  /* liste qui contient tous les noms de playlist
  il faut préciser @input pour qu'il puisse se remplir 
  en recevant les infos venant du père
  */

  playlists: Playlist[];

  /* indique le nom de l'album que l'on a cherché*/
  albumSearched: string;
  tracksAlbum: Track[];
  /* tableau qui contient les infos de plusieurs albums,
  il contiendra les infos des albums ayant le même nom */
  arrayAlbum: Album[];

  /* variable qui indique qu'on souhaite ajouter des infos dans une playlist*/
  addPlaylist: boolean;

  /*Id de la musique choisit pour l'ajout dans la playlist*/
  musicChosenId: string;

  /* service utilisé pour traiter et récupérer les données */
  /* ici j'utilise deux services, c'est une mauvaise pratique mais c'est pour gagner
  du temps car j'ai commis une erreur dans mes choix d'implémentation
  en faisant en sorte que monSevice soit en Input
  */
  /* un service pour le cas où le user est déconnecté*/
  monService: SpotifyService;

  @Input()
  /* un service pour le cas où le user est connecté*/
  monService2: SpotifyService;

  /* indique que l'utilisateur a activé la navbar pour chercher un album*/
  albumSearchOn() {
    console.log('test test');
    this.searchAlbumOn = true;
    this.musicAlbumFound = false;
  }

  playListAddOn(music: string) {
    this.musicChosenId = music;
    /* on indique que l'utilisateur souhaite ajouter des musiques à ses playlists */
    this.addPlaylist = true;
  }

  /* fonction qui récupère les infos de l'album (: id,nom) */
  retrieveAlbumInfo(album: string) {
    /* si le user est connecté on récupère les infos du service connecté
    pour avoir l'info sur le nom d'utilisateur*/
    /*if (this.monService2 != null) {
      console.log('mon service2 est différent de null');
      //this.monService2 = this.monService;
      this.playlists = this.monService2.playlists;
    } else {
      console.log('mon service2 est null ? : ' + this.monService2);
    }*/
    console.log('on appelle retrieve');
    /* console.log(
      'maintenant le user est connecté ? : ' + this.monService2.isConnected
    );*/
    if (this)
      this.monService.searchAlbum(album).subscribe(
        (datas) =>
          /* on récupères les infos des différents albums ayant ce nom */
          (this.arrayAlbum = datas)
      );

    /* fonction qui récupère les musiques associées à l'album */
    this.retrieveMusicsAlbum();
  }

  /* fonction qui permet de récupérer les musiques associées à un album 
  et les stocke dans "tracksAlbum" */
  retrieveMusicsAlbum() {
    /*on récupère le tableau qui contient l'ensemble des artistes ayant ce nom
    et on les mets dans arrayArtist*/

    console.log('tableau album : ' + this.arrayAlbum);
    /* on lance la recherche par rapport à l'artiste choisi */
    this.arrayAlbum.forEach((alb1) => {
      this.monService.SearchTrackAlbum(alb1.album_id).subscribe((datas) => {
        if (datas.length > 0) {
          //on précise au premier tour que des oeuvres ont été trouvée dans l'album
          if (this.musicAlbumFound == false)
            console.log(
              "des oeuvres ont bien été trouvé pour ce nom d'album \n"
            );
          /* si on a bien trouvé des musiques associées à cet
          album, alors on met musicArtistFound à true */
          this.musicAlbumFound = true;
          /* on met les infos
          des musiques dans la trackAlbum associé à l'artiste traité en sachant qu'il peut y
          avoir plusieurs artistes donc des tableaux dans le tableau */
          this.tracksAlbum = datas;
        } else {
          console.log("aucune oeuvre présente dans l'album choisi");
        }
      });
    });
  }

  addSongPlaylist(infoPlaylist: Playlist) {
    /*console.log(
      'Le son va être ajouté à la playlist' +
        titrePlaylist +
        'via la requête API '
    );*/

    this.monService2
      .AddSongPlaylist(
        this.monService2.login,
        infoPlaylist.id,
        this.musicChosenId
      )
      .subscribe((reponse) =>
        console.log(
          "l'ajout de la musique pour la playlist a fonctionné ? : " + reponse
        )
      );
    /*.subscribe((datas) => {
        datas.name = this.musicChosen;
      });*/

    /* on donne à cette playlist le nom que le user avait choisi*/
    //datas.name = this.nomPlaylist;
  }

  ngOnInit() {}

  constructor(service: SpotifyService) {
    /* on initialise les services*/
    if (service != null) {
      //this.monService = service;
      this.monService = service;
      console.log('le service du père est connecté ? : ' + service.isConnected);
      console.log("le service du père n'est pas null");
    }
    if (service != null && service.isConnected) {
      console.log(' La liste des playlist est : ' + this.monService2.playlists);
    }
    console.log(
      'Mon service et monservice2 sont équivalents : ' +
        (this.monService == this.monService2)
    );
    console.log("l'utilisateur est connecté : " + this.monService.isConnected);
    //this.monService2.isConnected = false;
    this.monService.isConnected = false;
    /* on initilalise le tableau d'artiste*/
    this.arrayAlbum = [];
    this.searchAlbumOn = false;
    /* au départ on ne souhaite pas afficher le formulaire qui permet d'ajouter des musiques 
    dans des playlists*/
    this.addPlaylist = false;
    /* au départ il n'y a pas de playlists*/
    this.playlists = [];
  }
}
