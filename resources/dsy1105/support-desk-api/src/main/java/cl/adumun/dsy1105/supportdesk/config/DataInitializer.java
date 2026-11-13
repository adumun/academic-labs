package cl.adumun.dsy1105.supportdesk.config;

import cl.adumun.dsy1105.supportdesk.model.*;
import cl.adumun.dsy1105.supportdesk.repository.TicketRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {
    @Bean
    CommandLineRunner seedTickets(TicketRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                repository.save(new Ticket("No puedo iniciar sesión", "El sistema rechaza mis credenciales aunque son correctas.", "Acceso", TicketPriority.ALTA, TicketStatus.ABIERTO, "Camila Soto"));
                repository.save(new Ticket("La aplicación se cierra", "La app se cierra al abrir la sección de perfil.", "Aplicación", TicketPriority.MEDIA, TicketStatus.EN_PROCESO, "Diego Rojas"));
                repository.save(new Ticket("Actualizar correo de contacto", "Necesito cambiar mi correo registrado.", "Cuenta", TicketPriority.BAJA, TicketStatus.RESUELTO, "Fernanda Díaz"));
            }
        };
    }
}