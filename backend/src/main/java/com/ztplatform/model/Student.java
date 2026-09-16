package com.ztplatform.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "students")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @NotBlank(message = "Student ID is required")
    @Size(max = 50, message = "Student ID must not exceed 50 characters")
    @Column(nullable = false, unique = true)
    private String studentId;

    @NotBlank(message = "Roll number is required")
    @Size(max = 50, message = "Roll number must not exceed 50 characters")
    @Column(nullable = false, unique = true)
    private String rollNo;

    @NotBlank(message = "Course is required")
    @Size(max = 100, message = "Course must not exceed 100 characters")
    @Column(nullable = false)
    private String course;

    @NotBlank(message = "Department is required")
    @Size(max = 100, message = "Department must not exceed 100 characters")
    @Column(nullable = false)
    private String department;

    @NotNull(message = "Year is required")
    @Column(nullable = false)
    private Integer year;

    @NotNull(message = "Semester is required")
    @Column(nullable = false)
    private Integer semester;

    @Past(message = "Date of birth must be in the past")
    @Column(nullable = false)
    private LocalDate dob;

    @Size(max = 500, message = "Address must not exceed 500 characters")
    @Column(nullable = false)
    private String address;

    @Size(max = 20, message = "Phone number must not exceed 20 characters")
    private String phone;

    @NotNull(message = "Admission year is required")
    @Column(nullable = false)
    private Integer admissionYear;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StudentStatus status = StudentStatus.ACTIVE;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum StudentStatus {
        ACTIVE,
        INACTIVE,
        GRADUATED,
        SUSPENDED
    }
}