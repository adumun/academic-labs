package cl.adumun.dsy1105.supportdesk.service;

import cl.adumun.dsy1105.supportdesk.dto.*;
import cl.adumun.dsy1105.supportdesk.model.*;
import cl.adumun.dsy1105.supportdesk.repository.TicketRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TicketService {
    private final TicketRepository repository;
    public TicketService(TicketRepository repository) { this.repository = repository; }

    public List<TicketResponse> findAll() {
        return repository.findAll(Sort.by(Sort.Direction.DESC, "createdAt")).stream().map(TicketResponse::from).toList();
    }
    public TicketResponse findById(Long id) { return TicketResponse.from(getTicket(id)); }
    public TicketResponse create(TicketRequest request) {
        Ticket ticket = new Ticket(request.title().trim(), request.description().trim(), request.category().trim(),
            request.priority(), TicketStatus.ABIERTO, request.requester().trim());
        return TicketResponse.from(repository.save(ticket));
    }
    public TicketResponse update(Long id, TicketRequest request) {
        Ticket ticket = getTicket(id);
        ticket.update(request.title().trim(), request.description().trim(), request.category().trim(), request.priority(), request.requester().trim());
        return TicketResponse.from(repository.save(ticket));
    }
    public TicketResponse changeStatus(Long id, TicketStatusRequest request) {
        Ticket ticket = getTicket(id);
        ticket.changeStatus(request.status());
        return TicketResponse.from(repository.save(ticket));
    }
    public void delete(Long id) {
        Ticket ticket = getTicket(id);
        repository.delete(ticket);
    }
    private Ticket getTicket(Long id) {
        return repository.findById(id).orElseThrow(() -> new TicketNotFoundException(id));
    }
}