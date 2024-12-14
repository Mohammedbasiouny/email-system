import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule, NgForm } from '@angular/forms'; // Correct import path
import { RouterModule } from '@angular/router'; // Correct import path
import { CommonModule } from '@angular/common'; // Correct import path
import { HttpClientModule } from '@angular/common/http'; // Correct import path

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule, HttpClientModule]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(form: NgForm) {
    if (form.invalid) {
      this.errorMessage = 'Please fill out all fields correctly.';
      return;
    }

    this.authService.login(this.email, this.password).subscribe(
      response => {
        console.log('Login successful', response);
        const userRole = response.role;
        this.authService.setToken(response.token);
        if (userRole === 'admin') {
          this.router.navigate(['/admin']);
        } else if (userRole === 'user') {
          this.router.navigate(['/home']);
        }
      },
      error => {
        console.error('Login failed', error);
        if (error.status === 401) {
          this.errorMessage = 'Invalid email or password. Please try again.';
        } else {
          this.errorMessage = 'Login failed. Please try again later.';
        }
      }
    );
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
