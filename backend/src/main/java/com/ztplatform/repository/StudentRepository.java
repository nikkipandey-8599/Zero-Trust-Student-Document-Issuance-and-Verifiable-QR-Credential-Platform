package com.ztplatform.repository;

import com.ztplatform.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByStudentId(String studentId);

    Optional<Student> findByUserId(Long userId);

    Optional<Student> findByRollNo(String rollNo);

    boolean existsByStudentId(String studentId);

    boolean existsByRollNo(String rollNo);
}