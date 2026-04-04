package com.zorvyn.ZorvynBackend.controller;

import com.zorvyn.ZorvynBackend.model.FinancialRecord;
import com.zorvyn.ZorvynBackend.model.RecordType;
import com.zorvyn.ZorvynBackend.model.User;
import com.zorvyn.ZorvynBackend.service.FinancialRecordService;
import com.zorvyn.ZorvynBackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

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
    public List<FinancialRecord> getRecords(){
        return financialRecordService.getAllFinancialRecords();
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
    public String deleteRecord(@RequestParam Long id){
        return financialRecordService.deleteRecord(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/viewrecords")
    public List<FinancialRecord> getRecords(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) RecordType recordType
    ) {
        if (category != null && !category.isEmpty()) {
            return financialRecordService.findByCategory(category);
        }
        // .. check other params
        return financialRecordService.getAllFinancialRecords(); // Fallback to all
    }



}

