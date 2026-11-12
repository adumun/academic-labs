package cl.adumun.dsy1105.supportdesk.dto;

import cl.adumun.dsy1105.supportdesk.model.TicketStatus;
import jakarta.validation.constraints.NotNull;

public record TicketStatusRequest(@NotNull TicketStatus status) {}