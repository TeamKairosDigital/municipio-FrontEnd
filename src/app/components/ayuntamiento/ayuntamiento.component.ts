import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ayuntamiento',
  standalone: true,
  imports: [],
  templateUrl: './ayuntamiento.component.html',
  styleUrl: './ayuntamiento.component.css'
})
export class AyuntamientoComponent {

  constructor(private router: Router) {}

  irAPagina1() {
    this.router.navigate(['ayuntamiento/obras']);
  }

  irAPagina2() {
    this.router.navigate(['ayuntamiento/sevac']);
  }

}
