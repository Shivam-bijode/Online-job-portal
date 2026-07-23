package com.online_job_portal.online_job_portal.service;

import com.online_job_portal.online_job_portal.entity.User;
import com.online_job_portal.online_job_portal.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();


    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    // REGISTER USER
    public User registerUser(User user) {

        if (userRepository
                .findByEmail(user.getEmail())
                .isPresent()) {

            throw new RuntimeException(
                    "Email already registered"
            );
        }

        // Password ko BCrypt hash karo
        user.setPassword(
                passwordEncoder.encode(
                        user.getPassword()
                )
        );

        return userRepository.save(user);
    }


    // LOGIN USER
    public User loginUser(
            String email,
            String password
    ) {

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invalid email or password"
                                )
                        );


        boolean passwordMatches;


        // Agar password BCrypt hash hai
        if (
                user.getPassword().startsWith("$2a$")
                        ||
                        user.getPassword().startsWith("$2b$")
                        ||
                        user.getPassword().startsWith("$2y$")
        ) {

            passwordMatches =
                    passwordEncoder.matches(
                            password,
                            user.getPassword()
                    );

        }


        // Agar old plain-text password hai
        else {

            passwordMatches =
                    user.getPassword()
                            .equals(password);


            // Login successful hone ke baad
            // old password ko BCrypt hash mein convert karo
            if (passwordMatches) {

                user.setPassword(
                        passwordEncoder.encode(
                                password
                        )
                );

                userRepository.save(user);
            }
        }


        if (!passwordMatches) {

            throw new RuntimeException(
                    "Invalid email or password"
            );
        }


        return user;
    }


    // FORGOT PASSWORD
    public User forgotPassword(
            String email,
            String newPassword
    ) {

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );


        // New password ko bhi BCrypt hash karo
        user.setPassword(
                passwordEncoder.encode(
                        newPassword
                )
        );


        return userRepository.save(user);
    }


    // GET ALL USERS
    public List<User> getAllUsers() {

        return userRepository.findAll();
    }


    // DELETE USER
    public void deleteUser(Long id) {

        if (
                !userRepository.existsById(id)
        ) {

            throw new RuntimeException(
                    "User not found"
            );
        }


        userRepository.deleteById(id);
    }
}