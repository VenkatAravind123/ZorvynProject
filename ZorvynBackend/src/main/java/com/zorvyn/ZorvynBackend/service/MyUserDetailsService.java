package com.zorvyn.ZorvynBackend.service;

import com.zorvyn.ZorvynBackend.model.User;
import com.zorvyn.ZorvynBackend.model.UserPrincipal;
import com.zorvyn.ZorvynBackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class MyUserDetailsService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;


    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email);
        if(user == null){
            System.out.println("User Not Found");
            throw new UsernameNotFoundException(email + "User not Found");
        }
        return new UserPrincipal(user);
    }
}
