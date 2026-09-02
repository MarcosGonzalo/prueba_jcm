import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Producto {
  id?: number;
  nombreProducto: string;
  precio: number;
}

export interface Cliente {
  id?: number;
  nombre: string;
  email: string;
  productos?: Producto[];
}

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private apiUrlClientes = 'http://localhost:8080/api/clientes';
  private apiUrlProductos = 'http://localhost:8080/api/productos'; // <--- URL específica para productos

  constructor(private http: HttpClient) {}

  // --- MÉTODOS DE CLIENTES ---

  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrlClientes);
  }

  crearCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrlClientes, cliente);
  }

  actualizarCliente(id: number, cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrlClientes}/${id}`, cliente);
  }

  eliminarCliente(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrlClientes}/${id}`);
  }

  // --- MÉTODOS DE PRODUCTOS ---

  agregarProducto(clienteId: number, producto: Producto): Observable<Producto> {
    // Ahora apunta correctamente a: http://localhost:8080/api/productos/cliente/{clienteId}
    return this.http.post<Producto>(`${this.apiUrlProductos}/cliente/${clienteId}`, producto);
  }
}