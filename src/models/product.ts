export interface Product {

    id_producto: number;
    nombre_producto: string;
    color?: string;
    precio: number;
    imagen?: string;
    descripcion_producto?: string;
    cantidad: number;
    estado: number;
    id_categoria: number;

}