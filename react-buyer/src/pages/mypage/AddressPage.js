import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, message, Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import { ShoppingCartOutlined, UserOutlined, FileTextOutlined, FileSearchOutlined, CloudUploadOutlined, CloudServerOutlined, } from '@ant-design/icons';
import './css/AddressPage1.css';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import InsertAddress from './InsertAddress'; // ✅ 추가


export default function Address({ onClose, onSuccess }) {

  // 1. 변수
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.LoginReducer);
  const [row, setRow] = useState({});
  const [forms] = useState([Form.useForm(), Form.useForm(), Form.useForm(), Form.useForm()]); // 최대 4개
  const [showInsertModal, setShowInsertModal] = useState(false); // ✅ 모달 상태  
  const [check, setCheck] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    // 페이지에 처음 진입할 때 한 번 dispatch 실행
    dispatch({ type: 'mypage_menu', idx: "2" });
  }, [dispatch]);

  console.log(row)
  // 2. 이펙트
  // showInsertModal이 바뀔때마다 반응
  useEffect(() => {
    selectInfo();
  }, [check]);


  // 3. 함수
  const selectInfo = async () => {
    const url = `/api2/address/getinfo`;
    const headers = { Authorization: `Bearer ${token}` };
    const { data } = await axios.get(url, { headers });
    console.log("📦 주소 리스트 API 응답:", data);
    if (data.status === 1) {
      setRow(data.list); 
    } else {
      message.error(data.message);
    }
  };



  const handleFinish = async (values, no) => {
    setLoading(true);
    console.log(values, no)
    const updatedFields = {};
    Object.keys(values).forEach((key) => {
      if (values[key]) {
        updatedFields[key] = values[key];
      }
    });

    if (Object.keys(updatedFields).length === 0) {
      message.warning('변경할 내용을 입력해주세요.');
      setLoading(false);
      return;
    }

    console.log('변경된 정보:', updatedFields);
    
    const url = `/api2/addresss/delete`
    const headers = { Authorization: `Bearer ${token}` }
    const body = {"no": no};
    const {data} = await axios.delete(url, {headers, data:body});
    console.log(data);

    setTimeout(() => {
      message.success('회원정보가 성공적으로 수정되었습니다.');
      form.resetFields();
      setLoading(false);
      selectInfo(); // 삭제 후 주소 다시 불러오기
    }, 1000);
  };

 const handleChangeDefaultAddress = async (no) => {
    try {
      const url = `/api2/address/changedefault`;
      const headers = { Authorization: `Bearer ${token}` };
      const body = { no };
      const { data } = await axios.put(url, body, { headers });
      console.log("기본 설정 요청 주소번호:", no);
      if (data.status === 1) {
        message.success('기본 배송지가 변경되었습니다.');
        selectInfo(); // 📌 변경된 정보 반영
      } else {
        message.warning(data.message || '변경 실패');
      }
    } catch (error) {
      console.error(error);
      message.error('기본 배송지 변경 중 오류 발생');
    }
  };

  const handleDeleteAddress = async (no) => {
    try {
      const url = `/api2/address/delete`;
      const headers = { Authorization: `Bearer ${token}` };
      const body = { no };

      const { data } = await axios.delete(url, {
        headers,
        data: body, // axios.delete는 body를 별도로 data에 명시해야 함
      });

      if (data.status === 1) {
        message.success('주소가 삭제되었습니다.');
        setCheck(prev => !prev);
      } else {
        message.warning(data.message || '삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('주소 삭제 오류:', error);
      message.error('삭제 중 오류가 발생했습니다.');
    }
  };
  

  return (  
      <div className="profile-container">
        {Array.isArray(row) &&
          row
          .slice()
            .sort((a, b) => (b.defaultAddress ? 1 : -1))
              .map((addr, index) => (
              <Card
                key={addr.no}
                title={
                  <span>
                    배송지 주소
                    {addr.defaultAddress && (
                      <span style={{ color: 'crimson', marginLeft: '10px', fontWeight: 'bold' }}>
                        [기본 배송지]
                      </span>
                    )}
                  </span>
                }
                className={`profile-card ${addr.defaultAddress ? 'default-address-card' : ''}`}
              >
                <Form
                  form={forms[addr.no]}
                  layout="vertical"
                  onFinish={(values) => handleFinish(values, addr.no)}
                  initialValues={{
                    address: addr.address,
                    detailAddress: addr.address_detail,
                  }}
                >
                  <Form.Item label="주소" name="address">
                    <Input
                      readOnly
                    />
                  </Form.Item>

                  <Form.Item name="detailAddress">
                    <Input readOnly />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      className="profile-btn"
                      type="primary"
                      danger
                      onClick={() => handleDeleteAddress(addr.no)} // ✅ 삭제 함수 연결
                      style={{ background: '#ff4d4f', color: '#fff' }}
                    >
                      삭제하기
                    </Button>
                  </Form.Item>

                  {!addr.defaultAddress && (
                    <Form.Item>
                      <Button
                        type="link"
                        onClick={() => handleChangeDefaultAddress(addr.no)}
                        style={{ color: 'crimson', padding: 0 }}
                      >
                        📌 기본 배송지로 설정
                      </Button>
                    </Form.Item>
                  )}
                </Form>
              </Card>
            ))}

        {/* 배송지 추가 버튼은 루프 바깥에 */}
        {row?.length < 4 && (
          <div className="add-btn-wrapper">
            <Button
              type="dashed"
              onClick={() => setShowInsertModal(true)}
              style={{ width: '100%' }}
            >
              ➕ 배송지 추가
            </Button>
          </div>
        )}

        {/* InsertAddress 모달 */}
        {showInsertModal && (
          <InsertAddress
            onClose={() => setShowInsertModal(false)}
            onSuccess={() => {
              setShowInsertModal(false);
              setCheck(prev => !prev);
            }}
          />
        )}
      </div>
  );
}