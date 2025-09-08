import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-photo-gallery',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './photo-gallery.html',
  styleUrls: ['./photo-gallery.scss']
})
export class PhotoGalleryPage implements OnInit {
  eventId: string = '';
  eventTitle: string = '';
  photos: any[] = [];
  loading: boolean = true;
  error: string = '';
  currentUserId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService
  ) {}

  ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get('id') || '';
    this.eventTitle = this.route.snapshot.queryParamMap.get('title') || 'Evento';
    this.currentUserId = this.eventService.getCurrentUserId();
    this.loadPhotos();
  }

  loadPhotos() {
    this.loading = true;
    this.error = '';
    this.eventService.getEventPhotos(this.eventId).then((photos) => {
      this.photos = photos;
      this.loading = false;
    }).catch((error) => {
      this.error = 'Error al cargar las fotos';
      this.loading = false;
      console.error('Error loading photos:', error);
    });
  }

  deletePhoto(photoId: string) {
    if (confirm('¿Estás seguro de que quieres eliminar esta foto?')) {
      this.eventService.deletePhoto(photoId).then(() => {
        this.photos = this.photos.filter(photo => photo.id !== photoId);
      }).catch((error) => {
        this.error = 'Error al eliminar la foto';
        console.error('Error deleting photo:', error);
      });
    }
  }

  goToUpload() {
    this.router.navigate(['/event', this.eventId, 'upload-photo'], { 
      queryParams: { title: this.eventTitle } 
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }

  canDeletePhoto(photo: any): boolean {
    return photo.userId === this.currentUserId;
  }
}
