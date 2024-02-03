import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Artist, Playlist, Track } from '../model/modele';
import { SpotifyService } from '../service/spotify.service';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css'],
})
export class ArtistComponent implements OnInit {
  /* indique si l'on cherche une musique :
  elle vaut true quand on clique sur la partie 
  de recherche par nom d'artiste et false sinon*/
  searchArtistOn: boolean;

  /* indique si on a trouvé des musiques associées à un artiste */
  musicArtistFound: boolean;

  /* indique le nom de l'artiste que l'on a cherché*/
  artistSearched: string;
  tracksArtist: Track[];
  /* tableau qui contient les infos de plusieurs artistes,
  il contiendra les infos des artistes ayant le même nom */
  arrayArtist: Artist[];
  musicChosenId: string;
  addPlaylist: boolean;

  /* service utilisé pour traiter les données */
  monService: SpotifyService;
  @Input()
  /* service utilisé pour traiter les données lorsque le user est connecté */
  monService2: SpotifyService;

  /* émetteur qui va permettre d'envoyer la listes des playlists au père (app.component) à chaque fois 
  que celle-ci est mise à jour
  pour que les autres composants puissent s'en servir
  */
  @Output()
  serviceEmit = new EventEmitter<SpotifyService>();

  constructor(service: SpotifyService) {
    /* par défaut on ne cherche pas par artiste*/
    this.monService = service;
    this.monService.isConnected = false;
    /* on initilalise le tableau d'artiste*/
    this.arrayArtist = [];
    this.searchArtistOn = false;
  }

  /* indique que l'utilisateur a activé la navbar pour chercher un artiste*/
  artistSearchOn() {
    console.log('test test');
    this.searchArtistOn = true;
    this.musicArtistFound = false;
  }

  /* gère l'ajout d'une musique dans les musiques de la playlist
  on a calqué ce modèle sur celui de album mais c'est seulement
  pcq la problématique était la même
  */
  playListAddOn(music: string) {
    this.musicChosenId = music;
    /* on indique que l'utilisateur souhaite ajouter des musiques à ses playlists */
    this.addPlaylist = true;
  }

  /* fonction qui récupère les infos de l'artiste (: id,nom) */
  retrieveArtistInfo(artiste: string) {
    console.log('on appelle retrieve');
    this.monService.SearchArtiste(artiste).subscribe(
      (datas) =>
        /* on récupères les infos des différents artistes ayant ce nom */
        (this.arrayArtist = datas)
    );
  }

  addSongPlaylist(infoPlaylist: Playlist) {
    /* ajoute la musique choisie à la playlist du user et ensuite renvoie un booléen
    qui indique si l'envoie s'est bien passé */
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
  }

  /* fonction qui permet de récupérer les musiques associées à un artiste */
  retrieveMusicsArtist(artiste: string) {
    console.log("le nom de l'artiste " + artiste);
    /*on récupère le tableau qui contient l'ensemble des artistes ayant ce nom
    et on les mets dans arrayArtist*/
    //this.arrayArtist = [];
    this.retrieveArtistInfo(artiste);

    console.log('tableau artiste : ' + this.arrayArtist);
    /* on lance la recherche par rapport à l'artiste choisi */
    this.arrayArtist.forEach((artist1) => {
      this.monService.SearchTrackArtiste(artist1.id).subscribe((datas) => {
        if (datas.length > 0) {
          /* si on a bien trouvé des musiques associées à cet
          artiste, alors on met musicArtistFound à true */
          this.musicArtistFound = true;
          console.log("les oeuvres de l'artiste ont été trouvée \n");
          /* on met les infos
          des films dans la trackArtist associé à l'artiste traité en sachant qu'il peut y
          avoir plusieurs artistes donc des tableaux dans le tableau */
          this.tracksArtist = datas;
        } else {
          console.log('roro');
        }
      });
    });
  }

  ngOnInit() {}
}
