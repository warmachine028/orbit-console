package com.orbit.api.service;

import com.orbit.api.dto.RecordRequest;
import com.orbit.api.entity.RecordEntity;
import com.orbit.api.repository.RecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.List;

@Service @RequiredArgsConstructor
public class RecordService {
    private final RecordRepository repository;
    public List<RecordEntity> findAll() { return repository.findAll(); }
    public RecordEntity create(RecordRequest request) { return repository.save(RecordEntity.builder().name(request.getName()).category(request.getCategory()).status(request.getStatus()).build()); }
    public RecordEntity update(Long id, RecordRequest request) { RecordEntity record = repository.findById(id).orElseThrow(); record.setName(request.getName()); record.setCategory(request.getCategory()); record.setStatus(request.getStatus()); record.setUpdatedAt(Instant.now()); return repository.save(record); }
    public void delete(Long id) { repository.deleteById(id); }
}
