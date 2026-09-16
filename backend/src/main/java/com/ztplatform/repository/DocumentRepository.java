package com.ztplatform.repository;

import com.ztplatform.model.Document;
import com.ztplatform.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Long> {

    List<Document> findByStudent(Student student);
}