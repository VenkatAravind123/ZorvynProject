package com.zorvyn.ZorvynBackend.repository;

import com.zorvyn.ZorvynBackend.model.FinancialRecord;
import com.zorvyn.ZorvynBackend.model.RecordType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RecordRepository extends JpaRepository<FinancialRecord,Long> {

    List<FinancialRecord> findByRecordDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    List<FinancialRecord> findByCategory(String category);
    List<FinancialRecord> findByRecordType(RecordType recordType);

    @Query("SELECT SUM(amount) FROM FinancialRecord WHERE recordType='INCOME'")
    BigDecimal getTotalIncome();

    @Query("SELECT SUM(amount) FROM FinancialRecord WHERE recordType='EXPENSE'")
    BigDecimal getTotalExpense();


}
