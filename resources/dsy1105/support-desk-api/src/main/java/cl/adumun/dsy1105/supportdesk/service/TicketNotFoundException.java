package cl.adumun.dsy1105.supportdesk.service;

public class TicketNotFoundException extends RuntimeException {
    public TicketNotFoundException(Long id) { super("No existe un ticket con id " + id); }
}