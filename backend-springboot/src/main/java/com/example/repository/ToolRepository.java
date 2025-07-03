package com.example.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.entity.Tool;

@Repository
public interface ToolRepository extends JpaRepository<Tool, Long> {

Optional<Tool> findByItemTool_Ino(Long ino);

}
