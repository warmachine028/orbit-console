package com.orbit.api.repository;

import com.orbit.api.entity.RecordEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecordRepository extends JpaRepository<RecordEntity, Long> { }
