import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ClienteCrudComponent } from './components/cliente-crud/cliente-crud';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ClienteCrudComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'frontend';
}