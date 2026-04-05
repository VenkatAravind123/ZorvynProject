package com.zorvyn.ZorvynBackend.service;

import com.zorvyn.ZorvynBackend.model.FinancialRecord;
import com.zorvyn.ZorvynBackend.model.Role;
import com.zorvyn.ZorvynBackend.model.User;
import com.zorvyn.ZorvynBackend.model.UserStatus;
import com.zorvyn.ZorvynBackend.repository.RecordRepository;
import com.zorvyn.ZorvynBackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService{
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RecordRepository recordRepository;

    @Autowired
    private JWTService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public String verify(User user) {
        try{
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getEmail(),user.getPassword()));
            if(authentication.isAuthenticated()){
                User dbUser = userRepository.findByEmail(user.getEmail());
                String role = String.valueOf(dbUser.getRole());
                return jwtService.generateToken(dbUser.getEmail(), role, dbUser.getId());
            }
            return "FAiled";
        }
        catch (Exception e){
            e.printStackTrace();
            return "Failed"+e.getMessage();
        }
    }

    @Override
    public User register(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User updateUserRole(Long id, Role role) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User Not Found"));
        user.setRole(role);
        return userRepository.save(user);
    }

    @Override
    public User updateUserStatus(Long id, UserStatus status) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User Not Found"));
        user.setStatus(status);
        return userRepository.save(user);
    }


}
