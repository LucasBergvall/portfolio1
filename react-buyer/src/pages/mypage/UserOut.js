import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, message, Layout } from 'antd';
import { useNavigate } from 'react-router-dom';
import './css/UserOut.css';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';

const UserOut = () => {
  // 1. 변수 설정
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.LoginReducer);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  


  // 2. 이펙트 (필요시 추가)
    useEffect(() => {
        // 페이지에 처음 진입할 때 한 번 dispatch 실행
        dispatch({ type: 'mypage_menu', idx: "4" });
      }, [dispatch]);
  useEffect(() => {
    // 초기화 작업 등
  }, []);

  // 3. 회원 탈퇴 함수
  const handleFinish = async (values) => {
    setLoading(true);

    // 요청 URL, 헤더, body 구성
    const url = `/api2/member/cancel`;
    const headers = { Authorization: `Bearer ${token}` };
    const body = { password: values.password };

    try {
      const { data } = await axios.put(url, body, { headers });
      console.log(data);

      if (data.status === 1) {
        // 회원 탈퇴 성공 처리
        setTimeout(() => {
          message.success(data.message || '회원 탈퇴 완료');
          form.resetFields();
          setLoading(false);
          navigate('/'); // 탈퇴 후 메인 페이지 등 원하는 페이지로 이동
          dispatch({ type: 'logout' }); // 예: 로그아웃 액션 처리 (필요에 따라 수정)
        }, 1000);
      } else {
        // 비밀번호 불일치 등 탈퇴 실패 처리
        setTimeout(() => {
          message.error(data.message || '회원 탈퇴 실패');
          form.resetFields();
          setLoading(false);
        }, 1000);
      }
    } catch (error) {
      console.error('서버 오류:', error);
      message.error('서버 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  // 4. 렌더링
  return (
      <div className="profile-container">
        <Card title="회원 탈퇴" className="profile-card">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
          >
            <Form.Item
              label="비밀번호"
              name="password"
              rules={[{ required: true, message: '비밀번호를 입력해주세요.' }]}
            >
              <Input.Password
                placeholder="비밀번호 입력"
                iconRender={() => null}  // 비밀번호 표시 아이콘 제거
              />
            </Form.Item>

            <Form.Item>
              <Button
                className="profile-btn"
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{ background: '#F7C600', color: '#000000' }}
              >
                회원 탈퇴
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
  );
};

export default UserOut;