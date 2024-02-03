import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { LoginComponent } from './login/login.component';
import { ArtistComponent } from './artist/artist.component';
import { HttpClientModule } from '@angular/common/http';
import { AlbumComponent } from './album/album.component';
import { PlaylistComponent } from './playlist/playlist.component';

@NgModule({
  imports: [BrowserModule, FormsModule, HttpClientModule],
  declarations: [
    AppComponent,
    LoginComponent,
    ArtistComponent,
    AlbumComponent,
    PlaylistComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
