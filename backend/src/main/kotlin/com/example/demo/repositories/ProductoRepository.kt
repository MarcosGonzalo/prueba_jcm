package com.example.demo.repositories

import com.example.demo.models.Producto
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ProductoRepository : JpaRepository<Producto, Long>