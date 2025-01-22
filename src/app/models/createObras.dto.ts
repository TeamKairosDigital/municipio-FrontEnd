export class CreateObrasDto {
    id?: number = 0;
    nombre: string = '';
    archivo: any;
    descripcion: string = '';
    nombreArchivoOriginal: string = '';
    autor: string = '';
    nombreArchivo: string = '';
    Activo?: boolean;
    fechaCreacion?: string = '';
    municipality_id: number = 0;
    UsuarioCreacionId: number = 0;
    url?: string = '';
  }