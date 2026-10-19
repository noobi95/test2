import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Geolocation } from '@capacitor/geolocation';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-time-tracking-modal',
  templateUrl: './time-tracking-modal.component.html',
})
export class TimeTrackingModalComponent implements OnInit {
  types: any[] = [];
  appointments: any[] = [];
  subcategories: any[] = [];
  
  selectedTypeId: number | null = null;
  selectedSubcategoryId: number | null = null;
  selectedAppointmentId: number | null = null;

  // Passe hier deine Netcup-Domain an
  private apiUrl = 'https://ucp.mh-ebs.de/api';

  constructor(
    private http: HttpClient,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.loadTypes();
    this.loadAppointments();
  }

  loadTypes() {
    this.http.get(`${this.apiUrl}/time-trackings/types`).subscribe((res: any) => {
      this.types = res.data;
    });
  }

  loadAppointments() {
    this.http.get(`${this.apiUrl}/user/active-appointments`).subscribe((res: any) => {
      this.appointments = res.data;
    });
  }

  onTypeChange(event: any) {
    const typeId = event.detail.value;
    const selectedType = this.types.find(t => t.id === typeId);
    this.subcategories = selectedType ? selectedType.subcategories : [];
    this.selectedSubcategoryId = null; // Reset bei Typwechsel
  }

  closeModal() {
    this.modalController.dismiss();
  }

  async startTracking() {
    try {
      // GPS-Standort beim Start abrufen
      const coordinates = await Geolocation.getCurrentPosition();
      const lat = coordinates.coords.latitude;
      const lng = coordinates.coords.longitude;

      const payload = {
        type_id: this.selectedTypeId,
        subcategory_id: this.selectedSubcategoryId,
        appointment_id: this.selectedAppointmentId,
        start_lat: lat,
        start_lng: lng
      };

      this.http.post(`${this.apiUrl}/time-trackings/start`, payload).subscribe((res: any) => {
        console.log('Erfolgreich gestartet', res);
        // Modal mit Erfolg schließen
        this.modalController.dismiss({ success: true, data: res.data });
      });

    } catch (error) {
      console.warn('GPS konnte nicht ermittelt werden, starte ohne Standort', error);
      
      // Fallback: Starten auch ohne GPS erlauben, falls der Nutzer im Tunnel/Bahnhof kein GPS hat
      const payload = {
        type_id: this.selectedTypeId,
        subcategory_id: this.selectedSubcategoryId,
        appointment_id: this.selectedAppointmentId,
        start_lat: null,
        start_lng: null
      };

      this.http.post(`${this.apiUrl}/time-trackings/start`, payload).subscribe((res: any) => {
        this.modalController.dismiss({ success: true, data: res.data });
      });
    }
  }
}