package com.example.repository;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.entity.ItemImg;
import com.example.projection.ItemImgProjection;

import jakarta.transaction.Transactional;

@Repository
public interface ItemImageRespository extends JpaRepository<ItemImg, Long> {
  
  @Transactional
  void deleteByItem_No(Long ino); // 해당 상품 번호(ino)에 해당하는 이미지 모두 삭제
  
  List<ItemImg> findByItem_No(Long ino); // 정보 조회용

  Long countByItem_NoAndImgDefault(Long ino, Boolean imgDefault); // 대표 이미지 유무 확인

  ItemImgProjection findByItem_NoAndImgDefault(Long ino, Boolean imgDefault); // 대표 이미지 번호 가져오기

  List<ItemImgProjection> findAllByItem_NoOrderByImgDefaultDescRegdateAsc(Long no); // 대표 이미지 우선, 등록일 기준 정렬로 이미지 리스트 반환

  List<ItemImgProjection> findAllByItem_NoAndImgDefault(Long ino, Boolean imgDefault); // 대표이미지가 아닌것들을 불러오기 imgDefault가 False일때

  @Transactional
  void deleteByNoAndItem_NoIn(Long no, List<Long> list);

  @Transactional
  void deleteByNoInAndItem_NoIn(List<Long> imglist, List<Long> itemlist);

  @Query("SELECT i FROM ItemImg i WHERE i.item.no IN :itemNos")
      List<ItemImg> findByItemNos(@Param("itemNos") List<Long> itemNos);
}
