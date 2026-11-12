package cl.adumun.dsy1105.supportdesk.dto;

import cl.adumun.dsy1105.supportdesk.model.*;
import java.time.LocalDateTime;

public record TicketResponse(Long id, String title, String description, String category,
    TicketPriority priority, TicketStatus status, String requester,
    LocalDateTime createdAt, LocalDateTime updatedAt) {
    public static TicketResponse from(Ticket ticket) {
        return new TicketResponse(ticket.getId(), ticket.getTitle(), ticket.getDescription(),
            ticket.getCategory(), ticket.getPriority(), ticket.getStatus(), ticket.getRequester(),
            ticket.getCreatedAt(), ticket.getUpdatedAt());
    }
}