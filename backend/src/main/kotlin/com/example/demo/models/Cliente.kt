package com.example.demo.models


import jakarta.persistence.*

@Entity
@Table(name = "clientes")
class Cliente(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(nullable = false)
    var nombre: String,

    @Column(nullable = false)
    var email: String,

    // Aquí está la magia de la relación. Un cliente tiene una lista de productos.
    // cascade = CascadeType.ALL significa que si guardas un cliente con productos, todo se guarda junto.
    @OneToMany(mappedBy = "cliente", cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
    var productos: MutableList<Producto> = mutableListOf()
)