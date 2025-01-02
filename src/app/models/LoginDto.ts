import { Deserializable } from "./interfaces";

export class LoginDto implements Deserializable {
    id: number;
    username: string;
    nombre: string;
    mombreMunicipio: string;
    municipality_id: number;
    access_token: string;

    constructor() {
        this.id = 0;
        this.username = '';
        this.nombre = '';
        this.mombreMunicipio = '';
        this.municipality_id = 0;
        this.access_token = '';
    }

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}