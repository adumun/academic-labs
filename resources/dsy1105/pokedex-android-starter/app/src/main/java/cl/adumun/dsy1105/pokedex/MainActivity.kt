package cl.adumun.dsy1105.pokedex

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.compose.BackHandler
import androidx.compose.foundation.background
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

data class PokemonUiModel(val id: Int, val name: String, val types: String, val number: String)

private val previewPokemon = listOf(
    PokemonUiModel(1, "Bulbasaur", "Planta · Veneno", "#001"),
    PokemonUiModel(4, "Charmander", "Fuego", "#004"),
    PokemonUiModel(7, "Squirtle", "Agua", "#007"),
    PokemonUiModel(25, "Pikachu", "Eléctrico", "#025"),
    PokemonUiModel(39, "Jigglypuff", "Normal · Hada", "#039"),
    PokemonUiModel(52, "Meowth", "Normal", "#052"),
    PokemonUiModel( EeveeId, "Eevee", "Normal", "#133")
)
private const val EeveeId = 133

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { MaterialTheme { PokedexApp() } }
    }
}

@Composable
fun PokedexApp() {
    var selected by remember { mutableStateOf<PokemonUiModel?>(null) }
    BackHandler(enabled = selected != null) { selected = null }
    Surface(Modifier.fillMaxSize(), color = Color(0xFFF4F6FA)) {
        if (selected == null) {
            PokemonListScreen(items = previewPokemon, onSelect = { selected = it })
        } else {
            PokemonDetailScreen(pokemon = selected!!, onBack = { selected = null })
        }
    }
}

@Composable
fun PokemonListScreen(items: List<PokemonUiModel>, onSelect: (PokemonUiModel) -> Unit) {
    Column(Modifier.fillMaxSize().padding(18.dp)) {
        Text("POKÉDEX", style = MaterialTheme.typography.labelLarge, color = Color(0xFF65718A))
        Text("Explora Pokémon", style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold)
        Text("Datos de muestra: reemplázalos al implementar PokéAPI.", color = Color(0xFF65718A))
        Spacer(Modifier.height(16.dp))
        LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
            items(items, key = { it.id }) { pokemon ->
                Card(Modifier.fillMaxWidth().clickable { onSelect(pokemon) }, shape = RoundedCornerShape(16.dp)) {
                    Row(Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                        Box(Modifier.size(54.dp).background(Color(0xFFE8EDFA), RoundedCornerShape(14.dp)), contentAlignment = Alignment.Center) {
                            Text("◉", style = MaterialTheme.typography.headlineMedium, color = Color(0xFF5146A5))
                        }
                        Spacer(Modifier.width(14.dp))
                        Column(Modifier.weight(1f)) {
                            Text(pokemon.name, fontWeight = FontWeight.Bold)
                            Text(pokemon.types, color = Color(0xFF65718A), style = MaterialTheme.typography.bodySmall)
                        }
                        Text(pokemon.number, color = Color(0xFF65718A))
                    }
                }
            }
        }
        Spacer(Modifier.height(8.dp))
        Text("TODO(REST): GET + paginación limit/offset + carga incremental", color = Color(0xFF5146A5), style = MaterialTheme.typography.labelMedium)
    }
}

@Composable
fun PokemonDetailScreen(pokemon: PokemonUiModel, onBack: () -> Unit) {
    Column(Modifier.fillMaxSize().padding(22.dp)) {
        TextButton(onClick = onBack) { Text("← Volver al listado") }
        Spacer(Modifier.height(24.dp))
        Box(Modifier.fillMaxWidth().height(190.dp).background(Color(0xFFE8EDFA), RoundedCornerShape(24.dp)), contentAlignment = Alignment.Center) {
            Text("◉", style = MaterialTheme.typography.displayLarge, color = Color(0xFF5146A5))
        }
        Spacer(Modifier.height(22.dp))
        Text(pokemon.number, color = Color(0xFF65718A))
        Text(pokemon.name, style = MaterialTheme.typography.headlineLarge, fontWeight = FontWeight.Bold)
        Text("Tipo: ${pokemon.types}", style = MaterialTheme.typography.bodyLarge)
        Spacer(Modifier.height(18.dp))
        Text("TODO(REST): consultar GET /pokemon/{id-o-nombre} y mapear sus datos.", color = Color(0xFF5146A5))
    }
}
