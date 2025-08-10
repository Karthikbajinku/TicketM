import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.redirectBasedOnRole();
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (user) => {
        this.loading = false;
        this.redirectBasedOnRole();
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Invalid email or password';
        console.error('Login error:', error);
      }
    });
  }

  private redirectBasedOnRole(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      switch (user.role) {
        case 'ADMIN':
          this.router.navigate(['/admin-dashboard']);
          break;
        case 'AGENT':
          this.router.navigate(['/agent-dashboard']);
          break;
        case 'USER':
          this.router.navigate(['/user-dashboard']);
          break;
        default:
          this.router.navigate(['/']);
      }
    }
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
