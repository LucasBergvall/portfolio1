import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {
  Form, Input, InputNumber, Button, Upload, message,
  Card, Layout, Menu, Select                 /* ✅ */
} from 'antd';
import {
  UploadOutlined, UserOutlined, FileTextOutlined,
  ShoppingCartOutlined, CloudUploadOutlined,
  FileSearchOutlined, CloudServerOutlined
} from '@ant-design/icons';
import './css/BookRegisterPage.css';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { type } from '@testing-library/user-event/dist/type';

export default function BookRegisterPage({ setItemList }) {
  // 1. 변수
  const { token } = useSelector((state) => state.LoginReducer); 
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { Sider } = Layout;
  const { Option } = Select;    
  const [fileList, setFileList] = useState([]); 
  const dispatch = useDispatch();
  const [bookOptions, setBookOptions] = useState([]);
  console.log(bookOptions)
  /** 카테고리 옵션 목록 ✅ */
  // const bookOptions = [
  //   { value: 1, label: '장르1' },
  //   { value: 2, label: '장르2' },
  //   { value: 3, label: '장르3' },
  // ]
  // 2 . 이펙트
  useEffect(() => {
    selectgenre();
  }, []);

  // 3. 함수
  const selectgenre = async () => {
    const url = `/api2/genre/selectitemlist`
    const {data} = await axios.get(url);
    console.log(data);
    if(data.status === 1) {
      const mappedOptions = data.list.map((genre) => ({
      value: genre.no,
      label: genre.genreName,
    }));
    setBookOptions(mappedOptions);
    console.log('장르 옵션:', mappedOptions); 
    }
  }

  const onFinish = async (values) => {
    console.log(values)

    // book_name 이랑 title 같이 들어가게
    try {
      const itemData = {
        "title" : values.book_name,
        "stock" : values.stock,
        "explain" : values.book_detail,
        "discount" : values.discount,
        "saleStatus" : 1
      }
      const bookData = {
        "bookName" : values.book_name,
        "writer" : values.writer,
        "bookDetail" : values.book_detail,
        "publisher" : values.publisher,
        "bookprice" : values.bookprice,
        "genre" : {"no" : values.genre}
      }
      
      // ✅ item + tool 등록용 FormData 생성
      const formData = new FormData();
      formData.append('item', new Blob([JSON.stringify(itemData)], { type: 'application/json' }));
      formData.append('book', new Blob([JSON.stringify(bookData)], { type: 'application/json' }));

      // ✅ Item 등록
      const url = `/api2/item/book/insert`
      const headers = {"Authorization": `Bearer ${token}`}
      const {data} = await axios.post(url, formData, {headers});
      console.log(data);

      if (data.status !== 1) {
        message.error('등록 실패: ' + data.message);
        return;
      }

      const inoData = {
        "item" : {"no": data.ino},
      }
      
      
      const imgurl = `/api2/itemimage/insertbatch`
      const headers1 = {"Authorization": `Bearer ${token}` , "Content-Type":"multipart/form-data"}

      const formData1 = new FormData();
      formData1.append('ino', new Blob([JSON.stringify(inoData)], { type: 'application/json' }));
      //formData1.append('ino', itemNo );

       for (let file of fileList) {
         console.log(file);
         formData1.append('img', file.originFileObj);  // 여러 이미지일 경우 반복 추가
       }
      const {data:data1} = await axios.post(imgurl, formData1, {headers : headers1});
      console.log(data1)
      if(data1.status === 1) {
        message.success('상품이 성공적으로 등록되었습니다!');
        form.resetFields();
        dispatch({type: 'item_menu', idx : "1"});
        navigate('/item/select');
      }
      
      
    } catch (err) {
      console.error(err);
      message.error('서버 오류로 등록 실패');
    }
  };



  const onFinishFailed = (errorInfo) => {
    console.log('등록 실패:', errorInfo);
    message.error('상품 등록에 실패했습니다. 다시 시도해 주세요.');
  };

 


  return (
    <Layout className="book-register-container">
      <Layout className="Sidebar-layout">
        {/* ---------- 본문 ---------- */}
        <div className="book-register-form">
          <h2>서적 등록</h2>
          <Card>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
               initialValues={{
                genre: 1,
                book_name: '책 제목',
                writer: '홍길동',
                publisher: '예시출판사',
                bookprice: 15000,
                discount: 10,
                stock: 5,
              }}
            >
              {/* ✅ 카테고리 Select (검색 가능) */}
              <Form.Item
                label="장르"
                name="genre"
                rules={[{ required: true, message: '장르를 선택해 주세요.' }]}
              >
                <Select
                  showSearch
                  placeholder="장르를 선택하세요"
                  options={bookOptions} // [{value: 21, label: "잡지"}, ...]
                  filterOption={(input, option) =>
                    option.label.toLowerCase().includes(input.toLowerCase())
                  }
                />
              </Form.Item>

              <Form.Item
                label="상품명"
                name="book_name"
                rules={[{ required: true, message: '상품명을 입력해 주세요.' }]}
                
              >
                <Input placeholder="상품명을 입력하세요" />
              </Form.Item>

              <Form.Item
                label="작가명"
                name="writer"
                rules={[{ required: true, message: '작가명을 입력해 주세요.' }]}
                
              >
                <Input placeholder="작가명을 입력하세요" />
              </Form.Item>

              <Form.Item
                label="출판사"
                name="publisher"
                rules={[{ required: true, message: '출판사를 입력해 주세요.' }]}
                
              >
                <Input placeholder="출판사를 입력하세요" />
              </Form.Item>


              {/* ✅ 달러 단위 가격 입력 */}
              <Form.Item
                label="가격"
                name="bookprice"
                rules={[{ required: true, message: '가격을 입력해 주세요.' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  placeholder="가격"
                  formatter={value =>
                    `₩ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  parser={value => value.replace(/[₩,\s]/g, '')}
                />
              </Form.Item>

              <Form.Item
                label="할인율 (%)"
                name="discount"
                rules={[{ required: true, message: '할인율을 입력해 주세요.' }]}
              >
                <InputNumber min={0} max={100} placeholder="예: 10" style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                label="수량 (개)"
                name="stock"
                rules={[{ required: true, message: '수량을 입력해 주세요.' }]}
              >
                <InputNumber min={1} placeholder="예: 10" style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                label="상품 설명"
                name="book_detail"
                rules={[{ required: true, message: '상품 설명을 입력해 주세요.' }]}
              >
                <Input.TextArea rows={4} placeholder="상품 설명을 입력하세요" />
              </Form.Item>
              

              <Form.Item
                label="상품 이미지 업로드"
                name="images"
                valuePropName="fileList"
                getValueFromEvent={e => (Array.isArray(e) ? e : e && e.fileList)}
              >
                <Upload
                  name="images"
                  listType="picture"
                  multiple
                  fileList={fileList} // 상태와 연결
                  onChange={({ fileList: newFileList }) => setFileList(newFileList)} // 상태 업데이트
                  beforeUpload={(file) => {
                    const isImage = file.type.startsWith('image/');
                    const isSizeOk = file.size / 1024 / 1024 < 5;

                    if (!isImage) message.error('이미지 파일만 업로드 가능합니다.');
                    if (!isSizeOk) message.error('이미지 크기는 5MB 이하만 가능합니다.');
                    
                    return false; // 수동 업로드
                  }}
                >
                  <Button icon={<UploadOutlined />}>이미지 선택</Button>
                </Upload>
              </Form.Item>


              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="book-register-btn"
                >
                  상품 등록
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </Layout>
    </Layout>
  );
}




 