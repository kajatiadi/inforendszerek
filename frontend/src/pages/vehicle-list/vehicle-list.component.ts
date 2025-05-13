import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-vehicle-list",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./vehicle-list.component.html",
  styleUrls: ["./vehicle-list.component.css"]
})
export class VehicleListComponent implements OnInit {
  vehicles: any[] = [];
  filteredVehicles: any[] = [];
  searchTerm: string = '';

  newVehicle = {
    type: "",
    manufacturer: "",
    model: "",
    licensePlate: "",
    acquisitionDate: "",
    serialNumber: "",
    baseRate: 2500,
    kmRate: 250,
    status: "free"
  };

  error = "";
  success = "";

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadVehicles();
  }

  loadVehicles() {
    this.http.get<any[]>("http://localhost:3000/api/vehicles").subscribe({
      next: (res) => {
        this.vehicles = res;
        this.applyFilter();
      },
      error: () => (this.error = "Nem sikerült lekérni a járműveket.")
    });
  }

  applyFilter() {
    const term = this.searchTerm.toLowerCase();
  
    this.filteredVehicles = this.vehicles.filter(v => {
      const typeHu = v.type === 'auto' ? 'autó' : v.type === 'hajo' ? 'hajó' : '';
  
      return (
        typeHu.includes(term) ||
        (v.licensePlate || '').toLowerCase().includes(term) ||
        (v.manufacturer || '').toLowerCase().includes(term) ||
        (v.model || '').toLowerCase().includes(term)
      );
    });
  }

  deleteVehicle(id: number): void {
    this.http.delete(`http://localhost:3000/api/vehicles/${id}`).subscribe({
      next: () => this.loadVehicles(),
      error: () => (this.error = "Hiba a jármű törlésekor.")
    });
  }

  addVehicle() {
    this.http.post("http://localhost:3000/api/vehicles", this.newVehicle).subscribe({
      next: () => {
        this.success = "Jármű hozzáadva!";
        this.error = "";
        this.newVehicle = {
          type: "",
          manufacturer: "",
          model: "",
          licensePlate: "",
          acquisitionDate: "",
          serialNumber: "",
          baseRate: 2500,
          kmRate: 250,
          status: "free"
        };
        this.loadVehicles();
      },
      error: () => {
        this.error = "Hiba történt a jármű mentésekor.";
        this.success = "";
      }
    });
  }
}
