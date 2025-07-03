import React from 'react';
import './css/CustomFooter.css';

export default function CustomFooter() {
  return (
    <div className="custom-footer">
      <div className="footer-container">
        <div className="footer-left">
          <div className="footer-logo">서적마켓</div>
          <div className="footer-info">
            <p>회사명 : (주)서적마켓</p>
            <p>대표이사 : 강대표</p>
            <p>주소 : 부산광역시 남구 대연동 430-1 부경대 창의관</p>
            <p>사업자등록번호 : 123-45-67890</p>
            <p>통신판매업 신고번호 : 제2025-부산대연-0001호</p>
          </div>
        </div>

        <div className="footer-right">
          <p>고객센터 : 1588-0000</p>
          <p>이메일 : bookmarket_cs@book.co.kr</p>
          <p>개인정보보호책임자 : 김보호</p>
          <p>Copyright © 2025 서적마켓. All Rights Reserved.</p>
        </div>
      </div>
    </div>
  );
}
