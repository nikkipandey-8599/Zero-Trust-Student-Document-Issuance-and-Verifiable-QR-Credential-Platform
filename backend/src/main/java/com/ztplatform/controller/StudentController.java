package com.ztplatform.controller;

import com.ztplatform.model.Student;
import com.ztplatform.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    // Add student
    @PostMapping
    public ResponseEntity<Student> createStudent(
            @RequestBody Student student) {

        return ResponseEntity.ok(
                studentService.createStudent(student)
        );
    }

    // Get all students
    @GetMapping
    public ResponseEntity<List<Student>> getAllStudents() {

        return ResponseEntity.ok(
                studentService.getAllStudents()
        );
    }

    // Get logged-in student's own profile
    @GetMapping("/me")
    public ResponseEntity<Student> getMyProfile(
            org.springframework.security.core.Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                studentService.getMyProfile(email)
        );
    }

    // Get student by database ID
    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                studentService.getStudentById(id)
        );
    }

    // Search student by Student ID
    @GetMapping("/student-id/{studentId}")
    public ResponseEntity<Student> getStudentByStudentId(
            @PathVariable String studentId) {

        return ResponseEntity.ok(
                studentService.getStudentByStudentId(studentId)
        );
    }

    // Update student
    @PutMapping("/{id}")
    public ResponseEntity<Student> updateStudent(
            @PathVariable Long id,
            @RequestBody Student student) {

        return ResponseEntity.ok(
                studentService.updateStudent(id, student)
        );
    }

    // Delete student
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteStudent(
            @PathVariable Long id) {

        studentService.deleteStudent(id);

        return ResponseEntity.ok(
                "Student deleted successfully"
        );
    }
}