import { Component, OnInit } from '@angular/core';

import { StoreService } from '../../services/store.service'
import { UsersService } from '../../services/users.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  activeMenu = false;
  counter = 0;
  token = '';
  profile: User | null = null;

  constructor(
    private storeService: StoreService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.storeService.myCart$.subscribe(products => {
      this.counter = products.length;
    });
  }

  toggleMenu() {
    this.activeMenu = !this.activeMenu;
  }

  login() {
    this.authService.login('sebas@gmail.com', '123342').subscribe(
      rta => {
        console.log(rta.access_token);
        this.token = rta.access_token;
        this.getProfile();
      }
    )
  }

  getProfile() {
    this.authService.profile().subscribe(
      profile => {
       this.profile = profile;
      }
    )
  }

}
