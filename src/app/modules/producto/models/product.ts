import { Category } from './category';
import { Provider } from './provider';

export interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  valor_unitario: number;
  cantidad_disponible: number;
  categoria: string;
  condiciones_almacenamiento: string;
  fecha_vencimiento: string;
  lote: string;
  id_proveedor: string;
  tiempo_estimado_entrega: string;
  ubicacion: string;
}
