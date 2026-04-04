package com.zorvyn.ZorvynBackend.service;

import com.zorvyn.ZorvynBackend.model.FinancialRecord;
import com.zorvyn.ZorvynBackend.model.RecordType;
import com.zorvyn.ZorvynBackend.repository.RecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class FinancialRecordServiceImpl implements FinancialRecordService{

    @Autowired
    private RecordRepository recordRepository;

    @Override
    public FinancialRecord createFinancialRecord(FinancialRecord financialRecord) {
            return recordRepository.save(financialRecord);
    }

    @Override
    public List<FinancialRecord> getAllFinancialRecords() {
        return recordRepository.findAll();
    }

    @Override
    public String deleteRecord(Long id) {
        Optional<FinancialRecord> financialRecord = recordRepository.findById(id);

        if (financialRecord.isEmpty()) {
            return "Record Not Found";
        }

        recordRepository.delete(financialRecord.get());
        return "Record Deleted Successfully";
    }

    @Override
    public String updateFinancialRecord(FinancialRecord financialRecord) {
        Optional<FinancialRecord> existingRecordOpt = recordRepository.findById(financialRecord.getId());
        if(existingRecordOpt.isEmpty()){
            return "Record Not Found";
        }

        FinancialRecord existingRecord = existingRecordOpt.get();
        existingRecord.setRecordType(financialRecord.getRecordType());
        existingRecord.setTitle(financialRecord.getTitle());
        existingRecord.setRecordDate(financialRecord.getRecordDate());
        existingRecord.setAmount(financialRecord.getAmount());
        existingRecord.setDescription(financialRecord.getDescription());
        existingRecord.setCategory(financialRecord.getCategory());

        recordRepository.save(existingRecord);
        return "Record Updated Successfully";
    }

    @Override
    public List<FinancialRecord> findByRecordDateBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return recordRepository.findByRecordDateBetween(startDate,endDate);
    }

    @Override
    public List<FinancialRecord> findByCategory(String category) {
        return recordRepository.findByCategory(category);
    }

    @Override
    public List<FinancialRecord> findByRecordType(RecordType recordType) {
        return recordRepository.findByRecordType(recordType);
    }

    @Override
    public BigDecimal getTotalIncome() {
        return recordRepository.getTotalIncome();
    }

    @Override
    public BigDecimal getTotalExpense() {
        return recordRepository.getTotalExpense();
    }

}

