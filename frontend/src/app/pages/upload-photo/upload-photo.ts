import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-upload-photo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upload-photo.html',
  styleUrls: ['./upload-photo.scss']
})
export class UploadPhotoPage implements OnInit {
  eventId: string = '';
  eventTitle: string = '';
  caption: string = '';
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  uploading: boolean = false;
  error: string = '';
  success: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService
  ) {}

  ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get('id') || '';
    this.eventTitle = this.route.snapshot.queryParamMap.get('title') || 'Evento';
  }

  onFileSelected(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        this.error = 'Por favor selecciona una imagen válida';
        return;
      }

      // Validar tamaño (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        this.error = 'La imagen debe ser menor a 5MB';
        return;
      }

      this.selectedFile = file;
      this.error = '';

      // Crear preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeFile() {
    this.selectedFile = null;
    this.previewUrl = null;
    this.error = '';
  }

  async uploadPhoto() {
    if (!this.selectedFile) {
      this.error = 'Por favor selecciona una imagen';
      return;
    }

    console.log('Starting upload...');
    console.log('EventId:', this.eventId);
    console.log('File:', this.selectedFile);
    console.log('Caption:', this.caption);

    this.uploading = true;
    this.error = '';

    try {
      await this.eventService.uploadPhoto(this.eventId, this.selectedFile, this.caption.trim());
      this.success = '¡Foto subida exitosamente!';
      
      // Limpiar form
      this.selectedFile = null;
      this.previewUrl = null;
      this.caption = '';
      
      // Redirigir a galería después de un momento
      setTimeout(() => {
        this.router.navigate(['/event', this.eventId, 'photos'], {
          queryParams: { title: this.eventTitle }
        });
      }, 1500);

    } catch (error: any) {
      console.error('Upload error:', error);
      this.error = error?.error?.error || error?.message || 'Error al subir la foto';
    } finally {
      this.uploading = false;
    }
  }

  goToGallery() {
    this.router.navigate(['/event', this.eventId, 'photos'], {
      queryParams: { title: this.eventTitle }
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
