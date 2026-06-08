import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  features = [
    {
      icon: '📋',
      title: 'Gestione Richieste',
      description: 'Crea e monitora le richieste di permesso in modo semplice e veloce.',
    },
    {
      icon: '📊',
      title: 'Analytics',
      description: 'Visualizza statistiche e trend sulle richieste del tuo team.',
    },
    {
      icon: '🔔',
      title: 'Notifiche',
      description: 'Ricevi aggiornamenti in tempo reale sullo stato delle tue richieste.',
    },
  ];
}
