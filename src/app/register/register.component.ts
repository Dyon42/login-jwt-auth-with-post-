import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { User } from '../user';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  user: User = {
    fullName: '',
    email: '',
    password: ''
  };
  constructor(private _auth: AuthService, private _router: Router,private authService: AuthService) { }

  ngOnInit() {
  }
  register(theUser: User) {
    this._auth.register(theUser).subscribe(data => {
      const loginUser = {
        email: this.user.email,
        password:this.user.password
      }
      this.authService.login(loginUser).subscribe(data => {
        this._router.navigate(['/dashboard']);
        localStorage.setItem('user', JSON.stringify(data));;
    }, (err) => console.log(err));
  }
    )}}
