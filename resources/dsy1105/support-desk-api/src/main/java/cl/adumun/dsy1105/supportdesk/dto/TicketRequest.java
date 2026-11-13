package cl.adumun.dsy1105.supportdesk.dto;

import cl.adumun.dsy1105.supportdesk.model.TicketPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record TicketRequest(
    @NotBlank @Size(max = 100) String title,
    @NotBlank @Size(max = 1000) String description,
    @NotBlank @Size(max = 60) String category,
    @NotNull TicketPriority priority,
    @NotBlank @Size(max = 100) String requester
) {}