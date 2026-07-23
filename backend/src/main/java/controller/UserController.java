package com.online_job_portal.online_job_portal.controller;

import com.online_job_portal.online_job_portal.entity.User;
import com.online_job_portal.online_job_portal.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // REGISTER
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(
            @RequestBody User user
    ) {

        try {

            User savedUser =
                    userService.registerUser(user);

            return ResponseEntity.ok(savedUser);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(
            @RequestBody User user
    ) {

        try {

            User loggedInUser =
                    userService.loginUser(
                            user.getEmail(),
                            user.getPassword()
                    );

            return ResponseEntity.ok(loggedInUser);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // FORGOT PASSWORD
    @PutMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @RequestBody User user
    ) {

        try {

            userService.forgotPassword(
                    user.getEmail(),
                    user.getPassword()
            );

            return ResponseEntity.ok(
                    "Password updated successfully"
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // GET ALL USERS
    @GetMapping
    public ResponseEntity<?> getAllUsers() {

        return ResponseEntity.ok(
                userService.getAllUsers()
        );
    }


    // DELETE USER
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(
            @PathVariable Long id
    ) {

        try {

            userService.deleteUser(id);

            return ResponseEntity.ok(
                    "User deleted successfully"
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}