package com.ztplatform.service;

import com.ztplatform.model.Student;
import com.ztplatform.model.User;
import com.ztplatform.repository.StudentRepository;
import com.ztplatform.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;

    public StudentService(
            StudentRepository studentRepository,
            UserRepository userRepository) {
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
    }

    // Add Student
    public Student createStudent(Student student) {

        if (studentRepository.existsByStudentId(student.getStudentId())) {
            throw new RuntimeException("Student ID already exists");
        }

        if (studentRepository.existsByRollNo(student.getRollNo())) {
            throw new RuntimeException("Roll number already exists");
        }

        return studentRepository.save(student);
    }

    // Get all students
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // Get student by database ID
    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Student not found"));
    }

    // Get student by Student ID
    public Student getStudentByStudentId(String studentId) {
        return studentRepository.findByStudentId(studentId)
                .orElseThrow(() ->
                        new RuntimeException("Student not found"));
    }

    // Get logged-in student's profile
    public Student getMyProfile(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return studentRepository.findByUserId(user.getId())
                .orElseThrow(() ->
                        new RuntimeException("Student profile not found"));
    }

    // Update student
    public Student updateStudent(Long id, Student updatedStudent) {

        Student existingStudent = getStudentById(id);

        existingStudent.setStudentId(updatedStudent.getStudentId());
        existingStudent.setRollNo(updatedStudent.getRollNo());
        existingStudent.setCourse(updatedStudent.getCourse());
        existingStudent.setDepartment(updatedStudent.getDepartment());
        existingStudent.setYear(updatedStudent.getYear());
        existingStudent.setSemester(updatedStudent.getSemester());
        existingStudent.setDob(updatedStudent.getDob());
        existingStudent.setAddress(updatedStudent.getAddress());
        existingStudent.setPhone(updatedStudent.getPhone());
        existingStudent.setAdmissionYear(
                updatedStudent.getAdmissionYear()
        );

        return studentRepository.save(existingStudent);
    }

    // Delete student
    public void deleteStudent(Long id) {

        Student student = getStudentById(id);

        studentRepository.delete(student);
    }
}