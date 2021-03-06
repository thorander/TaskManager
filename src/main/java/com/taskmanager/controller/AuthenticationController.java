package com.taskmanager.controller;

import com.taskmanager.exception.DuplicateUserException;
import com.taskmanager.model.UserModel;
import com.taskmanager.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthenticationController {

    private final UserService userService;

    @Autowired
    public AuthenticationController(UserService userService) {
        this.userService = userService;
    }

    @RequestMapping(value = "/register", method = RequestMethod.POST)
    public ResponseEntity<UserModel> register(@RequestBody UserModel userModel) throws DuplicateUserException {
        UserModel createdUser = userService.registerUser(userModel);
        return new ResponseEntity<>(createdUser, HttpStatus.OK);
    }

}
