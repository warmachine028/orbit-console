package com.orbit.api.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "records")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RecordEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false) private String name;
    @Column(nullable = false) private String category;
    @Column(nullable = false) private String status;
    @Builder.Default private Instant updatedAt = Instant.now();
}
