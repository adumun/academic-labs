package cl.adumun.dsy1105.supportdesk

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

data class TicketUiModel(
    val id: Long,
    val title: String,
    val description: String,
    val category: String,
    val priority: String,
    val status: String,
    val requester: String
)

private val previewTickets = listOf(
    TicketUiModel(101, "No puedo iniciar sesión", "El sistema rechaza mis credenciales.", "Acceso", "ALTA", "ABIERTO", "Camila Soto"),
    TicketUiModel(102, "La aplicación se cierra", "La app se cierra al abrir el perfil.", "Aplicación", "MEDIA", "EN_PROCESO", "Diego Rojas"),
    TicketUiModel(103, "Solicito cambio de correo", "Necesito actualizar mi correo registrado.", "Cuenta", "BAJA", "RESUELTO", "Fernanda Díaz")
)

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { MaterialTheme { SupportDeskApp() } }
    }
}

@Composable
fun SupportDeskApp() {
    var tickets by remember { mutableStateOf(previewTickets) }
    var selected by remember { mutableStateOf<TicketUiModel?>(null) }
    var formTicket by remember { mutableStateOf<TicketUiModel?>(null) }
    var showForm by remember { mutableStateOf(false) }

    when {
        showForm -> TicketFormScreen(initial = formTicket, onCancel = { showForm = false }, onSavePreview = { edited ->
            // Demo local solamente. Reemplaza con POST o PUT en la implementación REST.
            tickets = if (formTicket == null) tickets + edited.copy(id = (tickets.maxOfOrNull { it.id } ?: 100) + 1) else tickets.map { if (it.id == edited.id) edited else it }
            showForm = false
            selected = null
        })
        selected != null -> TicketDetailScreen(
            ticket = selected!!,
            onBack = { selected = null },
            onEdit = { formTicket = selected; showForm = true },
            onChangeStatus = {
                // TODO(REST): implementar PATCH /api/tickets/{id}/status.
                tickets = tickets.map { if (it.id == selected!!.id) it.copy(status = "EN_PROCESO") else it }
                selected = selected!!.copy(status = "EN_PROCESO")
            },
            onDeletePreview = {
                // Demo local solamente. Reemplaza con DELETE.
                tickets = tickets.filterNot { it.id == selected!!.id }
                selected = null
            }
        )
        else -> TicketListScreen(
            tickets = tickets,
            onCreate = { formTicket = null; showForm = true },
            onSelect = { selected = it }
        )
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TicketListScreen(tickets: List<TicketUiModel>, onCreate: () -> Unit, onSelect: (TicketUiModel) -> Unit) {
    Scaffold(topBar = { TopAppBar(title = { Text("Support Desk") }) }, floatingActionButton = {
        FloatingActionButton(onClick = onCreate) { Text("+") }
    }) { padding ->
        Column(Modifier.fillMaxSize().padding(padding).padding(16.dp)) {
            Text("Solicitudes de soporte", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
            Text("Vista de demostración local · conecta la API para trabajar con datos persistentes.", color = Color(0xFF65718A))
            Spacer(Modifier.height(16.dp))
            LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                items(tickets, key = { it.id }) { ticket ->
                    Card(Modifier.fillMaxWidth().clickable { onSelect(ticket) }, shape = RoundedCornerShape(14.dp)) {
                        Column(Modifier.padding(16.dp)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(ticket.title, Modifier.weight(1f), fontWeight = FontWeight.Bold)
                                Text("#${ticket.id}", color = Color(0xFF65718A))
                            }
                            Spacer(Modifier.height(6.dp))
                            Text("${ticket.category} · ${ticket.priority} · ${ticket.status}", color = Color(0xFF65718A), style = MaterialTheme.typography.bodySmall)
                        }
                    }
                }
            }
            Spacer(Modifier.height(8.dp))
            Text("TODO(REST): GET /api/tickets", color = Color(0xFF187D79), style = MaterialTheme.typography.labelMedium)
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TicketDetailScreen(
    ticket: TicketUiModel,
    onBack: () -> Unit,
    onEdit: () -> Unit,
    onChangeStatus: () -> Unit,
    onDeletePreview: () -> Unit
) {
    Scaffold(topBar = { TopAppBar(title = { Text("Detalle del ticket") }, navigationIcon = {
        TextButton(onClick = onBack) { Text("←") }
    }) }) { padding ->
        Column(Modifier.fillMaxSize().padding(padding).padding(20.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Text("#${ticket.id}", color = Color(0xFF65718A))
            Text(ticket.title, style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold)
            Text(ticket.description)
            Text("Solicitante: ${ticket.requester}")
            Text("Categoría: ${ticket.category}")
            Text("Prioridad: ${ticket.priority}")
            Text("Estado: ${ticket.status}")
            Button(onClick = onEdit) { Text("Editar ticket (demo)") }
            OutlinedButton(onClick = onChangeStatus) { Text("Marcar en proceso (demo)") }
            OutlinedButton(onClick = onDeletePreview) { Text("Eliminar (demo local)") }
            Text("TODO(REST): GET detalle · PUT · PATCH estado · DELETE", color = Color(0xFF187D79))
        }
    }
}

@Composable
fun TicketFormScreen(initial: TicketUiModel?, onCancel: () -> Unit, onSavePreview: (TicketUiModel) -> Unit) {
    var title by remember(initial?.id) { mutableStateOf(initial?.title.orEmpty()) }
    var description by remember(initial?.id) { mutableStateOf(initial?.description.orEmpty()) }
    var category by remember(initial?.id) { mutableStateOf(initial?.category ?: "General") }
    var priority by remember(initial?.id) { mutableStateOf(initial?.priority ?: "MEDIA") }
    var requester by remember(initial?.id) { mutableStateOf(initial?.requester.orEmpty()) }

    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(20.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
        Text(if (initial == null) "Nuevo ticket" else "Editar ticket", style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold)
        OutlinedTextField(title, { title = it }, label = { Text("Título") }, modifier = Modifier.fillMaxWidth(), singleLine = true)
        OutlinedTextField(description, { description = it }, label = { Text("Descripción") }, modifier = Modifier.fillMaxWidth(), minLines = 2)
        OutlinedTextField(category, { category = it }, label = { Text("Categoría") }, modifier = Modifier.fillMaxWidth(), singleLine = true)
        OutlinedTextField(priority, { priority = it.uppercase() }, label = { Text("Prioridad: BAJA, MEDIA, ALTA o CRITICA") }, modifier = Modifier.fillMaxWidth(), singleLine = true)
        OutlinedTextField(requester, { requester = it }, label = { Text("Solicitante") }, modifier = Modifier.fillMaxWidth(), singleLine = true)
        Text("TODO(REST): validar y enviar POST /api/tickets o PUT /api/tickets/{id}.")
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            OutlinedButton(onClick = onCancel) { Text("Cancelar") }
            Button(onClick = {
                val id = initial?.id ?: 0L
                onSavePreview(TicketUiModel(id, title.trim(), description.trim(), category.trim(), priority.trim(), initial?.status ?: "ABIERTO", requester.trim()))
            }, enabled = title.isNotBlank() && description.isNotBlank() && category.isNotBlank() && requester.isNotBlank()) {
                Text("Guardar demo")
            }
        }
    }
}
