import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-private-login',
  standalone: true,
  imports: [FormsModule, TranslateModule, CommonModule],
  templateUrl: './private-login.component.html',
  styleUrl: './private-login.component.scss'
})
export class PrivateLoginComponent {
  loginData = {
    id: '',
    password: '',
  };

  isError = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  login(): void {
    this.authService.login(this.loginData.id, this.loginData.password).subscribe({
      next: (response: any) => {
        this.authService.saveToken(response.token);
        this.router.navigate(['/admin/manage-news']);
      }, error: () => {
        this.loginData.password = '';
        this.isError = true;
      }
    });
  }
}
