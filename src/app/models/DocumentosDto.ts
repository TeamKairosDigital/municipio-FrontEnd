export class DocumentosDto {
    id: number = 0;
    nombreDocumento: string = '';
    ley: string = '';
    categoria: string = '';
    archivos: Archivo[] = [];
}

export class Archivo {
    id: number = 0;
    nombreArchivo: string = '';
    periodo: string = '';
    anualidad: string = '';
}
