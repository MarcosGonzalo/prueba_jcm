package com.example.demo.controllers

import com.example.demo.models.Cliente
import com.example.demo.repositories.ClienteRepository
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.thymeleaf.TemplateEngine
import org.thymeleaf.context.Context
import java.io.ByteArrayOutputStream

@RestController
@RequestMapping("/api/clientes")
@CrossOrigin(origins = ["http://localhost:4200"])
class ClienteController(
    private val clienteRepository: ClienteRepository,
    private val templateEngine: TemplateEngine // <--- Inyectamos Thymeleaf aquí
) {

    @GetMapping
    fun obtenerTodos(): List<Cliente> {
        return clienteRepository.findAll()
    }

    @PostMapping
    fun guardarCliente(@RequestBody cliente: Cliente): ResponseEntity<Cliente> {
        val nuevoCliente = clienteRepository.save(cliente)
        return ResponseEntity.ok(nuevoCliente)
    }

    @PutMapping("/{id}")
    fun actualizarCliente(@PathVariable id: Long, @RequestBody clienteDetalles: Cliente): ResponseEntity<Cliente> {
        val clienteExistente = clienteRepository.findById(id)
        if (clienteExistente.isPresent) {
            val cliente = clienteExistente.get()
            cliente.nombre = clienteDetalles.nombre
            cliente.email = clienteDetalles.email
            val clienteActualizado = clienteRepository.save(cliente)
            return ResponseEntity.ok(clienteActualizado)
        } else {
            return ResponseEntity.notFound().build()
        }
    }

    @DeleteMapping("/{id}")
    fun eliminarCliente(@PathVariable id: Long): ResponseEntity<Void> {
        if (clienteRepository.existsById(id)) {
            clienteRepository.deleteById(id)
            return ResponseEntity.ok().build()
        } else {
            return ResponseEntity.notFound().build()
        }
    }

    // --- NUEVO ENDPOINT PARA EL REPORTE PDF ---
    @GetMapping("/reporte-pdf")
    fun descargarPdf(): ResponseEntity<ByteArray> {
        val listaClientes = clienteRepository.findAll()

        // Pasamos los clientes al contexto de la plantilla HTML
        val context = Context()
        context.setVariable("clientes", listaClientes)

        // Procesamos el HTML con Thymeleaf
        val htmlProcesado = templateEngine.process("reporte-clientes", context)

        // Convertimos el HTML procesado a PDF con OpenHTMLtoPDF
        val os = ByteArrayOutputStream()
        val builder = PdfRendererBuilder()
        builder.withHtmlContent(htmlProcesado, null)
        builder.toStream(os)
        builder.run()
        val pdfBytes = os.toByteArray()

        val headers = HttpHeaders().apply {
            contentType = MediaType.APPLICATION_PDF
            set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=reporte-clientes.pdf")
        }

        return ResponseEntity.ok().headers(headers).body(pdfBytes)
    }

    // --- NUEVO ENDPOINT PARA EL REPORTE XML ---
   // --- ENDPOINT XML CON DESCARGA FORZADA ---
    @GetMapping(value = ["/reporte-xml"], produces = [MediaType.APPLICATION_XML_VALUE])
    fun descargarXml(): ResponseEntity<List<Cliente>> {
        val listaClientes = clienteRepository.findAll()

        // Forzamos al navegador a que lo descargue como un archivo XML físico
        val headers = HttpHeaders().apply {
            set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=reporte-clientes.xml")
        }

        return ResponseEntity.ok()
            .headers(headers)
            .body(listaClientes)
    }
}