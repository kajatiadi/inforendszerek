import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent {
  username = "";
  password = "";
  error = "";

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.http.post<any>("http://localhost:3000/api/auth/login", {
      username: this.username,
      password: this.password
    }).subscribe({
      next: (res) => {
        localStorage.setItem("token", res.token);
        localStorage.setItem("username", res.username);
        this.router.navigate(["/vehicles"]);
      },
      error: () => {
        this.error = "Hibás felhasználónév vagy jelszó";
      }
    });
  }
}
