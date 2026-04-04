package com.zorvyn.ZorvynBackend.service;

import com.zorvyn.ZorvynBackend.model.FinancialRecord;
import com.zorvyn.ZorvynBackend.model.RecordType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface FinancialRecordService {
    FinancialRecord createFinancialRecord(FinancialRecord financialRecord);
    List<FinancialRecord> getAllFinancialRecords();
    String deleteRecord(Long id);
    String updateFinancialRecord(FinancialRecord financialRecord);

    List<FinancialRecord> findByRecordDateBetween(LocalDateTime startDate,LocalDateTime endDate);
    List<FinancialRecord> findByCategory(String category);
    List<FinancialRecord> findByRecordType(RecordType recordType);
    BigDecimal getTotalIncome();
    BigDecimal getTotalExpense();
}
