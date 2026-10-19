import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TimeTrackingService } from '../../services/time-tracking.service';

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

  constructor(
    private timeTrackingService: TimeTrackingService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.timeTrackingService.getTypes().subscribe((res: any) => {
      this.types = res.data;
    });

    this.timeTrackingService.getActiveAppointments().subscribe((res: any) => {
      this.appointments = res.data;
    });
  }

  onTypeChange(event: any) {
    const typeId = event.detail.value;
    const selectedType = this.types.find(t => t.id === typeId);
    this.subcategories = selectedType ? selectedType.subcategories : [];
    this.selectedSubcategoryId = null;
  }

  closeModal() {
    this.modalController.dismiss();
  }

  startTracking() {
    if (!this.selectedTypeId) return;

    this.timeTrackingService.startTracking(
      this.selectedTypeId, 
      this.selectedSubcategoryId, 
      this.selectedAppointmentId
    ).subscribe({
      next: (res: any) => {
        console.log('Erfolgreich gestartet mit GPS', res);
        this.modalController.dismiss({ success: true, data: res.data });
      },
      error: (err) => {
        console.warn('GPS fehlgeschlagen, versuche ohne GPS...', err);
        // Fallback ohne GPS ausführen
        this.timeTrackingService.startTrackingWithoutGps(
          this.selectedTypeId!, 
          this.selectedSubcategoryId, 
          this.selectedAppointmentId
        ).subscribe((res: any) => {
          this.modalController.dismiss({ success: true, data: res.data });
        });
      }
    });
  }
}