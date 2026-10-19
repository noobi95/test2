import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Geolocation } from '@capacitor/geolocation';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TimeTrackingService {

  // Passe hier deine Netcup-Domain an
  private apiUrl = 'https://ucp.mh-ebs.de/api';

  constructor(private http: HttpClient) {}

  // 1. Schichten von gestern bis morgen laden (3-Tages-Fenster)
  getActiveAppointments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/active-appointments`);
  }

  // 2. Erfassungstypen & Unterkategorien laden
  getTypes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/time-trackings/types`);
  }

  // 3. Zeiterfassung starten (inkl. automatischem GPS-Standort)
  startTracking(typeId: number, subcategoryId: number | null, appointmentId: number | null): Observable<any> {
    // Wir holen zuerst den GPS-Standort und senden dann den Request ab
    return from(Geolocation.getCurrentPosition()).pipe(
      switchMap(position => {
        const payload = {
          type_id: typeId,
          subcategory_id: subcategoryId,
          appointment_id: appointmentId,
          start_lat: position.coords.latitude,
          start_lng: position.coords.longitude
        };
        return this.http.post(`${this.apiUrl}/time-trackings/start`, payload);
      })
    );
  }

  // Fallback, falls GPS fehlschlägt oder blockiert wird
  startTrackingWithoutGps(typeId: number, subcategoryId: number | null, appointmentId: number | null): Observable<any> {
    const payload = {
      type_id: typeId,
      subcategory_id: subcategoryId,
      appointment_id: appointmentId,
      start_lat: null,
      start_lng: null
    };
    return this.http.post(`${this.apiUrl}/time-trackings/start`, payload);
  }

  // 4. Zeiterfassung stoppen (inkl. finalem GPS-Standort)
  stopTracking(trackingId: number): Observable<any> {
    return from(Geolocation.getCurrentPosition()).pipe(
      switchMap(position => {
        const payload = {
          end_lat: position.coords.latitude,
          end_lng: position.coords.longitude
        };
        return this.http.post(`${this.apiUrl}/time-trackings/${trackingId}/stop`, payload);
      })
    );
  }

  // Fallback zum Stoppen ohne GPS
  stopTrackingWithoutGps(trackingId: number): Observable<any> {
    const payload = {
      end_lat: null,
      end_lng: null
    };
    return this.http.post(`${this.apiUrl}/time-trackings/${trackingId}/stop`, payload);
  }
}