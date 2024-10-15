import { Component } from '@angular/core';
import { ImportsModule } from '../../imports';
import { blogDto } from '../../models/blogDto';
import { SideBarComponent } from '../tools/side-bar/side-bar.component';

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

  blogs: blogDto[] = [];
  blog: blogDto = { id: 0, nombre: '', descripcion: '', archivo: null };
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
  onEdit(blog: blogDto) {
    this.isNewBlog = false;
    this.blog = { ...blog }; // Copia del blog seleccionado
    this.displayDialog = true;
  }

  // Eliminar un blog
  onDelete(blog: blogDto) {
    this.blogs = this.blogs.filter(b => b.id !== blog.id);
  }

}
