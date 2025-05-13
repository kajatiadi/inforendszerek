import { Routes } from "@angular/router";
import { LoginComponent } from "../pages/login/login.component";
import { VehicleListComponent } from "../pages/vehicle-list/vehicle-list.component";
import { CustomerListComponent } from "../pages/customer-list/customer-list.component";
import { RentalComponent } from '../pages/rental/rental.component';


export const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: "vehicles", component: VehicleListComponent },
  { path: "customers", component: CustomerListComponent },
  { path: 'rentals',  component: RentalComponent}
];
