package com.example.repository;

import com.example.entity.Img;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImgRepository extends JpaRepository<Img, Long> {

    // 🔍 이름으로 조회
    List<Img> findByName(String name);

    // 🔍 이름 일부 포함 조회
    List<Img> findByNameContaining(String keyword);

    // 🔍 타입별 조회 (예: "image/png")
    List<Img> findByType(String type);

    // 🔍 특정 크기 이상
    List<Img> findBySizeGreaterThan(Long size);

    // ❌ 이미지 삭제
    void deleteByNo(Long no);

    // ✔ 이미지 저장 및 수정은 save(entity) 사용
}
