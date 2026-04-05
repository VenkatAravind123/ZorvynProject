package com.zorvyn.ZorvynBackend.service;

import com.zorvyn.ZorvynBackend.model.FinancialRecord;
import com.zorvyn.ZorvynBackend.model.Role;
import com.zorvyn.ZorvynBackend.model.User;
import com.zorvyn.ZorvynBackend.model.UserStatus;

import java.util.List;

public interface UserService {
    String verify(User user);
    User register(User user);
    List<User> getAllUsers();
    User updateUserRole(Long id, Role role);
    User updateUserStatus(Long id, UserStatus status);

}
