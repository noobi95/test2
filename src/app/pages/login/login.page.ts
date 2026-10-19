import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
})
export class LoginPage {
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        console.log('Erfolgreich eingeloggt', res);
        // Weiterleitung zur Hauptseite / Dashboard / Zeiterfassung
        this.router.navigateByUrl('/dashboard', { replaceUrl: true });
      },
      error: (err) => {
        console.error('Login fehlgeschlagen', err);
        alert('E-Mail oder Passwort falsch.');
      }
    });
  }
}