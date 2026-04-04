package com.zorvyn.ZorvynBackend.service;

import com.zorvyn.ZorvynBackend.model.FinancialRecord;
import com.zorvyn.ZorvynBackend.model.User;

import java.util.List;

public interface UserService {
    String verify(User user);
    User register(User user);
    List<User> getAllUsers();

}
