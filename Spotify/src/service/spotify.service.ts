import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  Playlist,
  PlaylistCreation,
  ArtistResponse,
  Artist,
  AlbumResponse,
  Album,
  Track,
  TrackResponse,
  PlaylistResponse,
  AddSongToPlaylist,
} from '../model/modele';
import { EmptyExpr } from '@angular/compiler';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  /* ce champ indique le nom du user*/
  login: string;
  /* ce champ indique si le user est connecté*/
  isConnected: boolean;
  //searchAlbum: String;
  /* ce champ contiendra l'ensemble des playlist créées par le user*/
  playlists: Playlist[];

  constructor(private httpClient: HttpClient) {}

  ajoutUserName(name: string) {
    this.login = name;
  }

  SearchArtiste(artiste: string): Observable<Artist[]> {
    return this.httpClient
      .get<ArtistResponse>(
        'https://europe-west1-cours-angular-263913.cloudfunctions.net/apiSpotify/api/data/artist?name=' +
          artiste
      )
      .pipe(map((todoResponse) => todoResponse.artists));
  }

  searchAlbum(album: string): Observable<Album[]> {
    return this.httpClient
      .get<AlbumResponse>(
        ' https://europe-west1-cours-angular-263913.cloudfunctions.net/apiSpotify/api/data/album?name=' +
          album
      )
      .pipe(map((todoResponse) => todoResponse.albums));
  }

  SearchTrackArtiste(id: string): Observable<Track[]> {
    return this.httpClient
      .get<TrackResponse>(
        'https://europe-west1-cours-angular-263913.cloudfunctions.net/apiSpotify/api/data/artist/' +
          id +
          '/tracks'
      )
      .pipe(map((rpns) => rpns.tracks));
  }

  SearchTrackAlbum(id: string): Observable<Track[]> {
    return this.httpClient
      .get<TrackResponse>(
        'https://europe-west1-cours-angular-263913.cloudfunctions.net/apiSpotify/api/data/album/' +
          id +
          '/tracks'
      )
      .pipe(map((rpns) => rpns.tracks));
  }

  SearchPlaylist(nom: string): Observable<Playlist[]> {
    return this.httpClient
      .get<PlaylistResponse>(
        'https://europe-west1-cours-angular-263913.cloudfunctions.net/apiSpotify/api/user/' +
          nom +
          '/playlist'
      )
      .pipe(map((rpns) => rpns.playlists));
  }

  /* ajoute une musique à une playlist */
  AddSongPlaylist(
    nomUser: string,
    idPlaylist: string,
    musicId: string
  ): Observable<boolean> {
    /*ici on précise la musique que l'on veut ajouter */
    let data: AddSongToPlaylist = { songId: musicId };
    console.log(
      "la valeur de data qui doit contenir l'id de la musique est : " +
        data.songId
    );
    console.log("on a ajouté la musique avec l'id : " + musicId);

    console.log(' on ajoute la musique choisie dans la playlist ' + idPlaylist);
    return this.httpClient
      .put<boolean>(
        'https://europe-west1-cours-angular-263913.cloudfunctions.net/apiSpotify/api/user/' +
          nomUser +
          '/playlist/' +
          idPlaylist,
        data
      )
      .pipe(
        map((rpns) => true),
        catchError((err) => of(false))
      );
  }

  RecupSong(user: string, id: string): Observable<Track[]> {
    console.log(
      'le user pour lequel on récupère des musiques se nomme :' +
        user +
        ' et la playlist a pour code : ' +
        id
    );
    return this.httpClient
      .get<TrackResponse>(
        'https://europe-west1-cours-angular-263913.cloudfunctions.net/apiSpotify/api/user/' +
          user +
          '/playlist/' +
          id
      )
      .pipe(map((rpns) => rpns.tracks));
  }

  /* supprimer une playlist pour un user spécifique */

  deletePlaylist(nomUser: string, idPlaylist: string): Observable<boolean> {
    console.log(
      "suppression de la playlist d'id : " +
        idPlaylist +
        ' pour le user : ' +
        nomUser
    );

    return this.httpClient
      .delete<boolean>(
        'https://europe-west1-cours-angular-263913.cloudfunctions.net/apiSpotify/api/user/' +
          nomUser +
          '/playlist/' +
          idPlaylist
      )
      .pipe(
        map((rpns) => true),
        catchError((err) => of(false))
      );
  }

  /* créé une nouvelle playlist associée au user 'nom'*/
  createPlayListUser(nomUser: string): Observable<Playlist> {
    let data: PlaylistCreation = {
      name: nomUser,
    };
    return this.httpClient
      .post<Playlist>(
        'https://europe-west1-cours-angular-263913.cloudfunctions.net/apiSpotify/api/user/' +
          nomUser +
          '/playlist',
        data
      )
      .pipe(map((rpns) => rpns));
  }
}
