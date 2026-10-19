async stopTracking(activeTrackingId: number) {
  try {
    // Finalen GPS-Standort beim Stoppen ermitteln
    const coordinates = await Geolocation.getCurrentPosition();
    const lat = coordinates.coords.latitude;
    const lng = coordinates.coords.longitude;

    const payload = {
      end_lat: lat,
      end_lng: lng
    };

    this.http.post(`${this.apiUrl}/time-trackings/${activeTrackingId}/stop`, payload).subscribe((res: any) => {
      console.log('Zeiterfassung erfolgreich beendet', res);
      // UI aktualisieren (Timer stoppen, Status auf "beendet" setzen)
    });

  } catch (error) {
    console.warn('GPS beim Stoppen nicht verfügbar, beende ohne Standort', error);

    // Fallback ohne GPS
    const payload = {
      end_lat: null,
      end_lng: null
    };

    this.http.post(`${this.apiUrl}/time-trackings/${activeTrackingId}/stop`, payload).subscribe((res: any) => {
      // UI aktualisieren
    });
  }
}