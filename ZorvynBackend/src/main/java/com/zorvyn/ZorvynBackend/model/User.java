package com.zorvyn.ZorvynBackend.model;

import jakarta.persistence.*;

@Entity
@Table(name="user_table")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false,unique = true,length = 50)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role = Role.VIEWER;


    @Enumerated(EnumType.STRING)
    @Column(nullable = false,length=20)
    private UserStatus status = UserStatus.ACTIVE;

    public User(){

    }
    @PrePersist public void prePersistDefaults() {
        if (role == null) {
            role = Role.VIEWER;
        }
        if (status == null) {
            status = UserStatus.ACTIVE;
        }
    }

    public User(Long id, String email, String password, Role role, UserStatus status) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.role = role;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public UserStatus getStatus() {
        return status;
    }

    public void setStatus(UserStatus status) {
        this.status = status;
    }
}
