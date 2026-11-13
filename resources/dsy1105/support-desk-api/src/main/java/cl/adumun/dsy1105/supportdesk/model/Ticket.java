package cl.adumun.dsy1105.supportdesk.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tickets")
public class Ticket {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 100)
    private String title;
    @Column(nullable = false, length = 1000)
    private String description;
    @Column(nullable = false, length = 60)
    private String category;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20)
    private TicketPriority priority;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20)
    private TicketStatus status;
    @Column(nullable = false, length = 100)
    private String requester;
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    void onCreate() { createdAt = LocalDateTime.now(); updatedAt = createdAt; }
    @PreUpdate
    void onUpdate() { updatedAt = LocalDateTime.now(); }

    protected Ticket() {}
    public Ticket(String title, String description, String category, TicketPriority priority, TicketStatus status, String requester) {
        this.title = title; this.description = description; this.category = category;
        this.priority = priority; this.status = status; this.requester = requester;
    }
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getCategory() { return category; }
    public TicketPriority getPriority() { return priority; }
    public TicketStatus getStatus() { return status; }
    public String getRequester() { return requester; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void update(String title, String description, String category, TicketPriority priority, String requester) {
        this.title = title; this.description = description; this.category = category;
        this.priority = priority; this.requester = requester;
    }
    public void changeStatus(TicketStatus status) { this.status = status; }
}