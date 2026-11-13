package cl.adumun.dsy1105.supportdesk.repository;

import cl.adumun.dsy1105.supportdesk.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketRepository extends JpaRepository<Ticket, Long> {}