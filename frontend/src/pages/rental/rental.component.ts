import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rental',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rental.component.html',
  styleUrls: ['./rental.component.css']
})
export class RentalComponent implements OnInit {
  customers: any[] = [];
  vehicles: any[] = [];
  activeRentals: any[] = [];
  closedRentals: any[] = [];
  allRentals: any[] = [];

  showModal = false;
  modalTitle = '';
  modalMessage = '';

  rental = {
    customerId: null,
    vehicleId: null,
    startDate: new Date().toISOString().split('T')[0]
  };

  returnForms: Record<number, {
    endDate: string;
    distanceKm: number;
    damaged: boolean;
    totalPrice?: number;
    success?: string;
    error?: string;
  }> = {};

  error = '';
  success = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loadInitialData();
  }

  loadInitialData() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<any[]>('http://localhost:3000/api/customers', { headers }).subscribe(res => this.customers = res);
    this.http.get<any[]>('http://localhost:3000/api/vehicles', { headers }).subscribe(res => this.vehicles = res.filter(v => v.status === 'free'));

    this.http.get<any[]>('http://localhost:3000/api/rentals', { headers }).subscribe(res => {
      this.allRentals = res;
      this.closedRentals = res.filter(r => r.endDate !== null);
    });

    this.http.get<any[]>('http://localhost:3000/api/rentals/active', { headers }).subscribe(res => {
      this.activeRentals = res;
      this.returnForms = {};
      res.forEach(r => {
        this.returnForms[r.id] = {
          endDate: new Date().toISOString().split('T')[0],
          distanceKm: 0,
          damaged: false
        };
      });
    });
  }

  submitRental() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.post('http://localhost:3000/api/rentals', this.rental, { headers }).subscribe({
      next: () => {
        this.success = 'Kölcsönzés rögzítve!';
        this.error = '';
        this.rental = {
          customerId: null,
          vehicleId: null,
          startDate: new Date().toISOString().split('T')[0]
        };
        this.loadInitialData();
      },
      error: () => {
        this.error = 'Hiba történt a kölcsönzés során.';
        this.success = '';
      }
    });
  }

  submitReturn(rentalId: number) {
    const form = this.returnForms[rentalId];
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
  
    this.http.post(`http://localhost:3000/api/rentals/${rentalId}/return`, form, { headers }).subscribe({
      next: (res: any) => {
        const basePrice = 2500;
        const dailyRent = 1000;
        const distanceCost = form.distanceKm * 250;
        const damageFee = form.damaged ? 50000 : 0;
        const finalPrice = res.price + damageFee;
  
        const format = (num: number) => num.toLocaleString('hu-HU');
  
        this.modalTitle = 'Kölcsönzés lezárva';
        this.modalMessage =
          `Alapdíj: ${format(basePrice)} Ft<br>` +
          `Napidíj: ${format(dailyRent)} Ft<br>` +
          `Megtett út (${form.distanceKm} km × 250 Ft): ${format(distanceCost)} Ft<br>` +
          (damageFee ? `Sérülés miatti díj: ${format(damageFee)} Ft<br>` : '') +
          `<strong>Végleges ár: ${format(finalPrice)} Ft</strong>`;
  
        this.showModal = true;

        this.activeRentals = this.activeRentals.filter(r => r.id !== rentalId);

        const closedRental = this.allRentals.find(r => r.id === rentalId);
        if (closedRental) {
          closedRental.endDate = form.endDate;
          closedRental.totalPrice = finalPrice;
          this.closedRentals.push(closedRental);
          this.allRentals = this.allRentals.filter(r => r.id !== rentalId);
        }

        delete this.returnForms[rentalId];
      },
      error: () => {
        this.returnForms[rentalId].error = 'A kölcsönzés már le van zárva.';
        this.returnForms[rentalId].success = '';
      }
    });
  }

  async deleteRental(rentalId: number) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    if (confirm('Biztosan törölni szeretnéd ezt a kölcsönzést?')) {
      try {
        await this.http.delete(`http://localhost:3000/api/rentals/${rentalId}`, { headers }).toPromise();
        this.success = 'Kölcsönzés sikeresen törölve!';
        this.error = '';
        this.loadInitialData();
      } catch (err: any) {
        this.error = `Hiba történt a törlés során: ${err.status} ${err.statusText || ''}`;
        if (err.status === 404) {
          this.loadInitialData();
        }
      }
    }
  }

  closeModal() {
    this.showModal = false;
  }
}
