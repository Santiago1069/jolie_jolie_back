export interface User {

    identificacion: string;
    nombre: string;
    correo: string;
    password: string;
    celular: number;
    id_perfiles_fk: number;
    id_tipo_documento_fk: number;

}