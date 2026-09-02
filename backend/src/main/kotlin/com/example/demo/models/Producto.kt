package com.example.demo.models

import com.fasterxml.jackson.annotation.JsonIgnore
import jakarta.persistence.*

@Entity
@Table(name = "productos")
class Producto(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(nullable = false)
    var nombreProducto: String,

    @Column(nullable = false)
    var precio: Double,

    // Relación inversa: Este producto pertenece a un cliente específico
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id")
    @JsonIgnore // Evita un bucle infinito al enviar los datos al frontend
    var cliente: Cliente? = null
)