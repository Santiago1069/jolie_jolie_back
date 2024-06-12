
export interface Compras {

    id_compra: number;
    fecha: string;
    direccion: string;
    estado: string;
    valor_total: number;
    usuario: string;
    metodopago: number;
    producto?:any[]
  }