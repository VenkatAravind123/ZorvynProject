package com.zorvyn.ZorvynBackend.controller;

import com.zorvyn.ZorvynBackend.model.*;
import com.zorvyn.ZorvynBackend.service.FinancialRecordService;
import com.zorvyn.ZorvynBackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private FinancialRecordService financialRecordService;


    private List<String> st = new ArrayList<>(List.of(
            "aravind",
            "venkat"
    ));

    @GetMapping("/")
    public String hello(){
        return "Hello Working..";
    }

    @GetMapping("/viewstudents")
    public List<String> viewStudents(){
        return st;
    }

    @PostMapping("/login")
    public String login(@RequestBody User user){
        return userService.verify(user);
    }

    @PostMapping("/register")
    public User register(@RequestBody User user){
        return userService.register(user);
    }

    @PreAuthorize("hasAnyRole('VIEWER','ADMIN','ANALYST')")
    @GetMapping("/viewrecords")
    public ResponseEntity<?> getRecords(){
        return ResponseEntity.ok(financialRecordService.getAllFinancialRecords());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/createrecord")
    public FinancialRecord createRecord(@RequestBody FinancialRecord financialRecord){
        return financialRecordService.createFinancialRecord(financialRecord);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/updaterecord")
    public String updateRecord(@RequestBody FinancialRecord financialRecord){
        return financialRecordService.updateFinancialRecord(financialRecord);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/viewusers")
    public List<User> getAllUsers(){
        return userService.getAllUsers();
    }


    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/deleterecord/{id}")
    public String deleteRecord(@PathVariable Long id){
        return financialRecordService.deleteRecord(id);
    }

    @PreAuthorize("hasAnyRole('ADMIN','VIEWER','ANALYST')")
    @GetMapping("/viewrecords/filter")
    public ResponseEntity<?> getRecords(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) RecordType recordType) {
        List<FinancialRecord> records = financialRecordService.getAllFinancialRecords();

        if (recordType != null) {
            records = records.stream()
                    .filter(r -> r.getRecordType() == recordType)
                    .toList();
        }

        if (category != null && !category.isBlank()) {
            records = records.stream()
                    .filter(r -> r.getCategory() != null && r.getCategory().equalsIgnoreCase(category))
                    .toList();
        }

        return ResponseEntity.ok(records);
    }


    @PreAuthorize("hasAnyRole('VIEWER','ANALYST','ADMIN')")
    @GetMapping("/gettotalincome")
    public BigDecimal getTotalIncome(){
       // System.out.println(financialRecordService.getTotalIncome());
        return financialRecordService.getTotalIncome();
    }

    @PreAuthorize("hasAnyRole('VIEWER','ANALYST','ADMIN')")
    @GetMapping("/gettotalexpense")
    public BigDecimal getTotalExpense(){
        return financialRecordService.getTotalExpense();
    }


    @PreAuthorize("hasAnyRole('ADMIN','VIEWER','ANALYST')")
    @GetMapping("/recentrecords")
    public ResponseEntity<?> getTodayCreatedRecords(){
        LocalDate today = LocalDate.now();
        List<FinancialRecord> records = financialRecordService.getAllFinancialRecords().stream()
                .filter(r -> r.getCreatedAt() != null && r.getCreatedAt().toLocalDate().isEqual(today)).toList();

        return ResponseEntity.ok(records);
    }


    @PreAuthorize("hasAnyRole('ADMIN','VIEWER','ANALYST')")
    @GetMapping("/weeklytrends")
    public ResponseEntity<?> getWeeklyTrend(){
        LocalDate today = LocalDate.now();
        LocalDate start = today.minusDays(6);
        Map<LocalDate,BigDecimal> trend = new LinkedHashMap<>();
        for(int i=0;i<7;i++){
            trend.put(start.plusDays(i),BigDecimal.ZERO);
        }

        financialRecordService.getAllFinancialRecords().stream()
                .filter(r -> r.getCreatedAt() != null)
                .forEach(r -> {
                    LocalDate d = r.getCreatedAt().toLocalDate();
                    if(!d.isBefore(start) && !d.isAfter(today)){
                        trend.put(d,trend.get(d).add(r.getAmount()));
                    }
                });
        return ResponseEntity.ok(trend);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/users/{id}/role")
    public ResponseEntity<User> updateUserRole(@PathVariable Long id,@RequestParam String role){
        Role parsedRole = Role.valueOf(role.trim().toUpperCase());
        User updated = userService.updateUserRole(id,parsedRole);
        return ResponseEntity.ok(updated);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/users/{id}/status")
    public ResponseEntity<User> updateUserStatus(@PathVariable Long id,@RequestParam String status){
        UserStatus parsedStatus = UserStatus.valueOf(status.trim().toUpperCase());
        User updated = userService.updateUserStatus(id,parsedStatus);
        return ResponseEntity.ok(updated);
    }

}
