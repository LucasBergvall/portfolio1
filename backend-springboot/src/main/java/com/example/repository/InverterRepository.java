package com.example.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.entity.Inverter;


@Repository
public interface InverterRepository extends JpaRepository<Inverter, Long>{
 
    
    Optional<Inverter> findByItemTool_Ino(Long ino);
}
