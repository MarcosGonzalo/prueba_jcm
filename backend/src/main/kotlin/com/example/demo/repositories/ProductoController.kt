package com.example.demo.controllers

import com.example.demo.models.Producto
import com.example.demo.repositories.ClienteRepository
import com.example.demo.repositories.ProductoRepository
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = ["http://localhost:4200"])
class ProductoController(
    private val productoRepository: ProductoRepository,
    private val clienteRepository: ClienteRepository
) {

    // 1. Listar todos los productos
    @GetMapping
    fun obtenerTodosLosProductos(): List<Producto> {
        return productoRepository.findAll()
    }

    // 2. Crear un producto asociado a un cliente específico
    @PostMapping("/cliente/{clienteId}")
    fun guardarProductoParaCliente(
        @PathVariable clienteId: Long,
        @RequestBody producto: Producto
    ): ResponseEntity<Producto> {
        val clienteOpt = clienteRepository.findById(clienteId)
        
        if (clienteOpt.isPresent) {
            val cliente = clienteOpt.get()
            producto.cliente = cliente // Asignamos la relación ManyToOne
            val productoGuardado = productoRepository.save(producto)
            return ResponseEntity.ok(productoGuardado)
        } else {
            return ResponseEntity.notFound().build()
        }
    }
}