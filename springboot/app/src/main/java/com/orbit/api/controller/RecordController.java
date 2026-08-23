package com.orbit.api.controller;

import com.orbit.api.dto.RecordRequest;
import com.orbit.api.entity.RecordEntity;
import com.orbit.api.service.RecordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/records") @CrossOrigin
@RequiredArgsConstructor
public class RecordController {
    private final RecordService service;
    @GetMapping public List<RecordEntity> all() { return service.findAll(); }
    @PostMapping public RecordEntity create(@Valid @RequestBody RecordRequest request) { return service.create(request); }
    @PutMapping("/{id}") public RecordEntity update(@PathVariable Long id, @Valid @RequestBody RecordRequest request) { return service.update(id, request); }
    @DeleteMapping("/{id}") public void delete(@PathVariable Long id) { service.delete(id); }
}
