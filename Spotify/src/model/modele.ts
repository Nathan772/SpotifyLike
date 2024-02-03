export interface Album {
  album_id: string;
  album: string;
}

export interface AlbumResponse {
  albums: Album[];
}

export interface groupPlayList {
  name: string[] /* noms des playlists */;
  contenu: Track[] /* musiques des playlist*/;
}

export interface Playlist {
  name: string;
  creationDate: number;
  id: string;
}

export interface PlaylistCreation {
  name: string;
}

export interface AddSongToPlaylist {
  songId: string;
}

export interface PlaylistResponse {
  playlists: Playlist[];
}

export interface Track {
  id: string;
  name: string;
  albumId: string;
  artistId: string;
}

export interface TrackResponse {
  tracks: Track[];
}

export interface Artist {
  id: string;
  name: string;
}

export interface ArtistResponse {
  artists: Artist[];
}
