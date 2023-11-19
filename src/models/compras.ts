
export interface Compras {

    id_compra: number;
    fecha: string;
    direccion: string;
    estado: string;
    valor_total: number;
    cantidad_productos: number;
    usuario: string;
    metodopago: string;
    producto:any[]
}