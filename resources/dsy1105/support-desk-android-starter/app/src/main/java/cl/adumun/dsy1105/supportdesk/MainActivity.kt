package cl.adumun.dsy1105.supportdesk

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
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

data class TicketUiModel(val id: Long, val title: String, val category: String, val priority: String, val status: String)

private val previewTickets = listOf(
    TicketUiModel(101, "No puedo iniciar sesión", "Acceso", "ALTA", "ABIERTO"),
    TicketUiModel(102, "La aplicación se cierra", "Aplicación", "MEDIA", "EN_PROCESO"),
    TicketUiModel(103, "Solicito cambio de correo", "Cuenta", "BAJA", "RESUELTO")
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
    var showForm by remember { mutableStateOf(false) }

    when {
        showForm -> TicketFormScreen(onCancel = { showForm = false }, onSavePreview = { title ->
            // Solo demostración local de UI. Sustituye este comportamiento por POST.
            tickets = tickets + TicketUiModel((tickets.maxOfOrNull { it.id } ?: 100) + 1, title, "General", "MEDIA", "ABIERTO")
            showForm = false
        })
        selected != null -> TicketDetailScreen(selected!!, onBack = { selected = null }, onChangeStatus = {
            // TODO(REST): implementar PATCH /api/tickets/{id}/status.
            tickets = tickets.map { if (it.id == selected!!.id) it.copy(status = "EN_PROCESO") else it }
            selected = selected!!.copy(status = "EN_PROCESO")
        }, onDeletePreview = {
            // Solo demostración local de UI. Sustituye este comportamiento por DELETE.
            tickets = tickets.filterNot { it.id == selected!!.id }
            selected = null
        })
        else -> TicketListScreen(tickets, onCreate = { showForm = true }, onSelect = { selected = it })
    }
}

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
fun TicketDetailScreen(ticket: TicketUiModel, onBack: () -> Unit, onChangeStatus: () -> Unit, onDeletePreview: () -> Unit) {
    Scaffold(topBar = { TopAppBar(title = { Text("Detalle del ticket") }, navigationIcon = {
        TextButton(onClick = onBack) { Text("←") }
    }) }) { padding ->
        Column(Modifier.fillMaxSize().padding(padding).padding(20.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Text("#${ticket.id}", color = Color(0xFF65718A))
            Text(ticket.title, style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold)
            Text("Categoría: ${ticket.category}")
            Text("Prioridad: ${ticket.priority}")
            Text("Estado: ${ticket.status}")
            Button(onClick = onChangeStatus) { Text("Marcar en proceso (demo)") }
            OutlinedButton(onClick = onDeletePreview) { Text("Eliminar (demo local)") }
            Text("TODO(REST): GET detalle · PATCH estado · DELETE", color = Color(0xFF187D79))
        }
    }
}

@Composable
fun TicketFormScreen(onCancel: () -> Unit, onSavePreview: (String) -> Unit) {
    var title by remember { mutableStateOf("") }
    Column(Modifier.fillMaxSize().padding(20.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Text("Nuevo ticket", style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold)
        OutlinedTextField(value = title, onValueChange = { title = it }, label = { Text("Título") }, modifier = Modifier.fillMaxWidth())
        Text("TODO(REST): completar formulario y enviar POST /api/tickets.")
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            OutlinedButton(onClick = onCancel) { Text("Cancelar") }
            Button(onClick = { if (title.isNotBlank()) onSavePreview(title.trim()) }, enabled = title.isNotBlank()) { Text("Guardar demo") }
        }
    }
}
