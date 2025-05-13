import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-customer-list",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./customer-list.component.html",
  styleUrls: ["./customer-list.component.css"]
})
export class CustomerListComponent implements OnInit {
  customers: any[] = [];

  newCustomer = {
    fullName: "",
    address: "",
    idNumber: "",
    phoneNumber: ""
  };

  error = "";
  success = "";

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.http.get<any[]>("http://localhost:3000/api/customers").subscribe({
      next: (res) => (this.customers = res),
      error: () => (this.error = "Nem sikerült lekérni az ügyfeleket.")
    });
  }

  deleteCustomer(id: number): void {
    this.http.delete(`http://localhost:3000/api/customers/${id}`).subscribe({
      next: () => this.loadCustomers(),
      error: () => (this.error = "Hiba az ügyfél törlésekor.")
    });
  }

  addCustomer() {
    this.http.post("http://localhost:3000/api/customers", this.newCustomer).subscribe({
      next: () => {
        this.success = "Ügyfél hozzáadva!";
        this.error = "";
        this.newCustomer = {
          fullName: "",
          address: "",
          idNumber: "",
          phoneNumber: ""
        };
        this.loadCustomers();
      },
      error: () => {
        this.error = "Hiba történt az ügyfél mentésekor.";
        this.success = "";
      }
    });
  }
}
