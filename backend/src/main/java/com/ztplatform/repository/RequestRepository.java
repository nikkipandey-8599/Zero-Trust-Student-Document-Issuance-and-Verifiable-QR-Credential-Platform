package com.ztplatform.repository;

import com.ztplatform.model.Request;
import com.ztplatform.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RequestRepository extends JpaRepository<Request, Long> {

    List<Request> findByStudent(Student student);
}