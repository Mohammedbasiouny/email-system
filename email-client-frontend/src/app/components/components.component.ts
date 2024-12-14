import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router'; // Add Router here

@Component({
  selector: 'app-components', // Corrected selector
  templateUrl: './components.component.html', // Corrected templateUrl
  styleUrls: ['./components.component.css'],
  standalone: true,
  imports:[ FormsModule, RouterModule] // Add RouterModule here
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private router: Router) {}

onSubmit() {

  }
}
