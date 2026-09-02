import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService, Cliente, Producto } from '../../services/cliente';

@Component({
  selector: 'app-cliente-crud',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cliente-crud.html', 
  styleUrls: ['./cliente-crud.css']   
})
export class ClienteCrudComponent implements OnInit {
  clientes: Cliente[] = [];
  clienteSeleccionadoParaProductos?: Cliente;
  

  nuevoCliente: Cliente = {
    nombre: '',
    email: ''
  };

  nuevoProducto: Producto = {
    nombreProducto: '',
    precio: 0
  };
  
  constructor(
    private clienteService: ClienteService,
    private cdr: ChangeDetectorRef 
  ) {}

  verProductos(c: Cliente): void {
    this.clienteSeleccionadoParaProductos = c;
  }


  guardarProducto(): void {
    if (this.clienteSeleccionadoParaProductos && this.clienteSeleccionadoParaProductos.id) {
      // Validar que los campos no estén vacíos
      if (!this.nuevoProducto.nombreProducto || this.nuevoProducto.precio <= 0) {
        alert('Por favor ingresa un nombre y un precio válido');
        return;
      }

      // Llamamos al servicio para guardar el producto asociado a este cliente
      this.clienteService.agregarProducto(this.clienteSeleccionadoParaProductos.id, this.nuevoProducto).subscribe({
        next: (productoGuardado) => {
          // Si el cliente no tiene la lista inicializada, la creamos
          if (!this.clienteSeleccionadoParaProductos!.productos) {
            this.clienteSeleccionadoParaProductos!.productos = [];
          }
          // Añadimos el producto recién creado a la lista visual de ese cliente
          this.clienteSeleccionadoParaProductos!.productos.push(productoGuardado);
          
          // Limpiamos el formulario del producto
          this.nuevoProducto = { nombreProducto: '', precio: 0 };
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error al guardar el producto:', err)
      });
    }
  }


  editandoId?: number;

  prepararEdicion(c: Cliente): void {
    this.editandoId = c.id;
    this.nuevoCliente = { nombre: c.nombre, email: c.email };
  }

  ngOnInit(): void {
    this.obtenerClientes();
  }

  // 1. READ: Cargar la lista de clientes
  obtenerClientes(): void {
    this.clienteService.getClientes().subscribe({
      next: (data) => {
        this.clientes = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al obtener clientes:', err)
    });
  }

  // 2. CREATE: Guardar un nuevo cliente
  guardarCliente(): void {
    if (this.editandoId) {
      // Si hay un ID en edición, hacemos PUT (Actualizar)
      this.clienteService.actualizarCliente(this.editandoId, this.nuevoCliente).subscribe({
        next: () => {
          this.obtenerClientes();
          this.cancelarEdicion();
        },
        error: (err) => console.error('Error al actualizar:', err)
      });
    } else {
      // Si no, hacemos POST (Crear nuevo)
      this.clienteService.crearCliente(this.nuevoCliente).subscribe({
        next: () => {
          this.obtenerClientes();
          this.nuevoCliente = { nombre: '', email: '' };
        },
        error: (err) => console.error('Error al guardar:', err)
      });
    }
  }

  cancelarEdicion(): void {
    this.editandoId = undefined;
    this.nuevoCliente = { nombre: '', email: '' };
  }

  // 4. DELETE: Eliminar cliente por ID
  eliminar(id?: number): void {
    if (id) {
      this.clienteService.eliminarCliente(id).subscribe({
        next: () => {
          this.obtenerClientes(); // Recargamos la lista tras borrar
        },
        error: (err) => console.error('Error al eliminar:', err)
      });
    }
  }

  descargarPdf(): void {
    window.open('http://localhost:8080/api/clientes/reporte-pdf', '_blank');
  }

  descargarXml(): void {
    window.open('http://localhost:8080/api/clientes/reporte-xml', '_blank');
  }

}