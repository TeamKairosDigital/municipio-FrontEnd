import { Component } from '@angular/core';
import { ImportsModule } from '../../imports';
import { SideBarComponent } from '../tools/side-bar/side-bar.component';
import { Obras } from '../../models/Obras';
import { ObrasService } from '../../services/obras.service';

@Component({
  selector: 'app-obras',
  standalone: true,
  imports: [ImportsModule, SideBarComponent],
  templateUrl: './obras.component.html',
  styleUrl: './obras.component.css'
})
export class ObrasComponent {

  // Blog: blogDto = {
  //   nombre: '',
  //   descripcion: '',
  //   archivo: null
  // }

  obras: Obras[] = [];
  selectedObra: Obras | null = null;
  errorMessage: string = '';
  
  constructor(private obrasService: ObrasService) {}

  ngOnInit(): void {
    this.getAllObras();
  }

  blogs: Obras[] = [];
  blog: Obras = { id: 0, nombre: '', descripcion: '', archivo: null };
  displayDialog: boolean = false;
  isNewBlog: boolean = false;

   // Mostrar diálogo para agregar un nuevo blog
   showDialogToAdd() {
    this.isNewBlog = true;
    this.blog = { id: 0, nombre: '', descripcion: '', archivo: null }; // Limpiar el blog actual
    this.displayDialog = true;
  }

  // Ocultar el diálogo
  hideDialog() {
    this.displayDialog = false;
  }

  // Guardar el blog (agregar o editar)
  save() {
    if (this.isNewBlog) {
      this.blog.id = this.blogs.length + 1; // Generar un nuevo ID
      this.blogs.push(this.blog);
    } else {
      const index = this.blogs.findIndex(b => b.id === this.blog.id);
      this.blogs[index] = this.blog;
    }
    this.displayDialog = false; // Cerrar el diálogo
  }

  // Editar un blog
  onEdit(blog: Obras) {
    this.isNewBlog = false;
    this.blog = { ...blog }; // Copia del blog seleccionado
    this.displayDialog = true;
  }

  // Eliminar un blog
  onDelete(blog: Obras) {
    this.blogs = this.blogs.filter(b => b.id !== blog.id);
  }


    // Obtener todas las obras
    getAllObras(): void {
      this.obrasService.getAll().subscribe({
        next: (response) => {
          if (response.success) {
            this.obras = response.data || [];
          } else {
            this.errorMessage = response.message;
          }
        },
        error: (error) => {
          console.error('Error al obtener obras:', error);
          this.errorMessage = 'Error al obtener las obras';
        },
      });
    }
  
    // Crear una nueva obra
    createObra(newObra: Obras): void {
      this.obrasService.create(newObra).subscribe({
        next: (response) => {
          if (response.success) {
            this.obras.push(response.data!);
          } else {
            this.errorMessage = response.message;
          }
        },
        error: (error) => {
          console.error('Error al crear obra:', error);
          this.errorMessage = 'Error al crear la obra';
        },
      });
    }
  
    // Eliminar una obra
    deleteObra(id: number): void {
      this.obrasService.delete(id).subscribe({
        next: (response) => {
          if (response.success) {
            this.obras = this.obras.filter((obra) => obra.id !== id);
          } else {
            this.errorMessage = response.message;
          }
        },
        error: (error) => {
          console.error('Error al eliminar obra:', error);
          this.errorMessage = 'Error al eliminar la obra';
        },
      });
    }


}
