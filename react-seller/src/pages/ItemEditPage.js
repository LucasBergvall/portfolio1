// src/pages/ItemEditPage.js
import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Button, message, Spin, Upload, Select } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ItemEditPage.css';

export default function ItemEditPage() {
  const [form] = Form.useForm();
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [imageList, setImageList] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryOptions = [
    { value: 1, label: '해머' },
    { value: 2, label: '렌치' },
    { value: 3, label: '드라이버' },
    { value: 4, label: '플라이어' },
    { value: 5, label: '가솔린 캔' },
    { value: 6, label: '조약돌' },
    { value: 7, label: '로프' },
    { value: 8, label: '공구박스' },
  ];

  // 기존 상품 정보 불러오기
  useEffect(() => {
    axios.get(`/api2/item/select/${itemId}`)
      .then(res => {
        if (res.data.status === 1) {
          const item = res.data.item;
          form.setFieldsValue({
            title: item.title,
            price: item.price,
            explain: item.explain,
            discount: item.discount,
            category: item.category,
            stock: item.stock,
          });

          if (item.imgNoList?.length > 0) {
            const defaultFiles = item.imgNoList.map((no, idx) => ({
              uid: `-${idx + 1}`,
              name: `image-${no}`,
              url: `/api2/itemimage/image/${no}`,
            }));
            setImageList(defaultFiles);
          }
          setLoading(false);
        } else {
          message.error('상품 정보를 불러오지 못했습니다.');
        }
      })
      .catch(err => {
        console.error(err);
        message.error('서버 오류 발생');
      });
  }, [itemId]);

  // 제출 핸들러
 const onFinish = async (values) => {
  console.log('✅ 보내는 값:', values);
    const { title, explain, discount, price, category, stock } = values;
    console.log("보내는 데이터", { title, explain, discount, price, category, stock });

    try {
      const res = await axios.put(`/api2/item/modify/${itemId}`, {
        title, explain, discount, price, category, stock
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log(res.data, "받은 데이터")

      if (res.data.status === 1) {
        // ✅ 새 이미지가 있는 경우에만 업로드
        const hasNewImages = imageList.some(file => !file.url && file.originFileObj);
        if (hasNewImages) {
          await uploadImages();
        }

        message.success('상품이 수정되었습니다.');
        navigate('/item-register');
      } else {
        message.error('수정 실패: ' + res.data.message);
      }
    } catch (err) {
      console.error(err);
      message.error('서버 오류로 수정 실패');
    }
  };

  // 이미지 업로드
  const uploadImages = async () => {
    const formData = new FormData();
    formData.append('itemId', itemId);

    let hasFile = false;

    imageList.forEach(file => {
      if (!file.url && file.originFileObj) {
        formData.append('images', file.originFileObj);
        hasFile = true;
      }
    });

    if (!hasFile) {
      console.log('✅ 수정할 새 이미지 없음, 업로드 생략');
      return;
    }

    const res = await axios.post('/api2/itemimage/modify', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    if (res.data.status === 1) {
      console.log('이미지 수정 완료');
    } else {
      console.error('이미지 수정 실패:', res.data.message);
    }
  };

  return loading ? (
    <div className="item-edit-container">
      <Spin tip="불러오는 중..." />
    </div>
  ) : (
    <div className="item-edit-container">
      <h2>상품 수정</h2>
     <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onValuesChange={(changed, allValues) => {
          console.log("📌 변경된 값:", changed);
          console.log("📌 전체 값:", allValues);
        }}
      >
        <Form.Item label="카테고리" name="category" rules={[{ required: true, message: '카테고리를 선택하세요' }]}>
          <Select options={categoryOptions} placeholder="카테고리를 선택하세요" />
        </Form.Item>
        <Form.Item label="상품명" name="title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="가격" name="price" rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="할인율 (%)" name="discount">
          <InputNumber min={0} max={100} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="수량" name="stock" rules={[{ required: true, message: '수량을 입력하세요' }]}>
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="설명" name="explain">
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item label="상품 이미지" name="images">
          <Upload
            listType="picture"
            multiple
            fileList={imageList}
            onChange={({ fileList }) => setImageList(fileList)}
            beforeUpload={() => false}
            onRemove={(file) => {
              setImageList(prev => prev.filter(f => f.uid !== file.uid));
            }}
          >
            <Button>이미지 선택</Button>
          </Upload>
        </Form.Item>  
        <Form.Item>
          <Button type="primary" htmlType="submit">수정 완료</Button>
        </Form.Item>
      </Form>
    </div>
  );
}
