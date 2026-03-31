import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterModule, MatButtonModule, MatMenuModule, RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  userData: any;
  userInitials: string = '';
  convertedName: string = '';

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    // 1️⃣ UserData initial laden
    this.loadUserData();

    // 2️⃣ Auf Änderungen der UserData reagieren (Guest-Login oder andere Logins)
    this.authService.userDataChanged.subscribe(() => {
      this.loadUserData();
      this.convertUsername();
      this.getInitials();
    });

    // 3️⃣ Wenn UserData schon vorhanden, direkt Initialen setzen
    if (this.userData) {
      this.convertUsername();
      this.getInitials();
    }
  }

  private loadUserData(): void {
    const storedUserData = sessionStorage.getItem('user_data');
    if (storedUserData) {
      this.userData = JSON.parse(storedUserData);
    }
  }

  private convertUsername(): void {
    const username = this.userData?.username; // sicherstellen, dass userData existiert
    if (username) {
      this.convertedName = username.replace(/_/g, ' ');
    }
  }

  private getInitials(): void {
    const nameParts = this.convertedName.split(' ');
    const firstInitial = nameParts[0]?.charAt(0).toUpperCase() || '';
    const lastInitial = nameParts[1]?.charAt(0).toUpperCase() || '';
    this.userInitials = firstInitial + lastInitial;
  }

  logout(): void {
    this.authService.logout();
  }
}