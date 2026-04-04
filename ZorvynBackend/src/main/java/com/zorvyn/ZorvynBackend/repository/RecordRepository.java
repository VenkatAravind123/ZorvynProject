package com.zorvyn.ZorvynBackend.repository;

import com.zorvyn.ZorvynBackend.model.FinancialRecord;
import com.zorvyn.ZorvynBackend.model.RecordType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RecordRepository extends JpaRepository<FinancialRecord,Long> {

    List<FinancialRecord> findByRecordDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    List<FinancialRecord> findByCategory(String category);
    List<FinancialRecord> findByRecordType(RecordType recordType);
}
