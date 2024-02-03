import { Component, Input, OnInit } from '@angular/core';
import { SpotifyService } from '../service/spotify.service';
import { Playlist } from '../model/modele';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @Input()
  monService: SpotifyService;

  updateService(service: SpotifyService) {
    this.monService = service;
    console.log(
      'le mon Service de appComponent a été mis à jour, mtnt le user est connecté : ' +
        this.monService.isConnected
    );
  }
  name = 'Angular';
}
