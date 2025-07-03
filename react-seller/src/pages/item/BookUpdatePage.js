import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {
  Form, Input, InputNumber, Button, Upload, message,
  Card, Layout, Menu, Select,                 /* ✅ */
  Empty
} from 'antd';
import {
  UploadOutlined, UserOutlined, FileTextOutlined,
  ShoppingCartOutlined, CloudUploadOutlined,
  FileSearchOutlined, CloudServerOutlined, PlusOutlined
} from '@ant-design/icons';
import './css/BookRegisterPage.css';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { type } from '@testing-library/user-event/dist/type';


export default function BookUpdatePage({ setItemList }) {

  // 1. 변수
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const no = queryParams.get('no');
  const { token } = useSelector((state) => state.LoginReducer);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { Sider } = Layout;
  const { Option } = Select;    
  const [fileList, setFileList] = useState([]);
  const dispatch = useDispatch();
  const [bookOptions, setBookOptions] = useState([]);
  const [item, setItem] = useState({});

  const [alist,setAlist] = useState([]); //살아있는거 리스트(남길꺼)
  const [dlist,setDlist] = useState([]); //죽은거 리스트 (삭제할꺼)
  const [ulist,setUlist] = useState([]); //신규 업로드 리스트(추가할꺼(위에 두 리스트가 있어야 작동함))

  console.log(fileList);

  // 2. 이펙트
  useEffect(() => {
    selectgenre();
    readItem();
  }, []);

  useEffect(() => {
    console.log(dlist)
  }, [dlist]);

  useEffect(() => {
    console.log(alist)
  }, [alist]);

    useEffect(() => {
    console.log(ulist)
  }, [ulist]);

  useEffect(() => {
    if (item) {
      form.setFieldsValue({
        book_detail: item.bookDetail,
        discount: item.discount,
        book_name: item.bookName,
        writer: item.writer,
        publisher: item.publisher,
        bookprice: item.price,
        stock: item.stock,
        genre: item.genre, // 장르 번호가 있는 경우
      });

      console.log(item.imgUrlList);
      let initialImageUrls = [];
      for(let idx in item.imgUrlList){
        initialImageUrls.push(
        {
            uid: item.imgNoList[idx], // 고유 ID
            name: idx+"name.jpg", // 파일 이름
            status: 'done', // 업로드 완료 상태
            url:item.imgUrlList[idx], // 실제 이미지 URL
          })
      }
      setFileList(initialImageUrls)
     }
    
  }, [item]); // item이 바뀔 때마다 다시 실행


  // 3. 함수
  const readItem = async () => {
    const url = `/api2/item/select?no=${no}`
    const {data} = await axios.get(url);
    console.log(data);
    if(data.status === 1) {
      setItem(data.item);
    }
  }

  const handleChange = ({ fileList : newFileList }) => {
    setFileList(newFileList);
    if (item.imgNoList && item.imgNoList.length > 0) {
      const usedUids = newFileList.map(file => Number(file.uid));
      setDlist(item.imgNoList.filter(uid => !usedUids.includes(uid))); // 삭제 할 것
      setAlist(item.imgNoList.filter(uid => usedUids.includes(uid))); // ➕ Alist로 저장
      // 기존 이미지가 없을때 작동X
      setUlist(newFileList.filter(file => !item.imgNoList.includes(Number(file.uid))))
    }
    
  };

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
        "saleStatus" : 1,
        "no" : no
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

      // ✅ Item 수정
      const url = `/api2/item/book/update`
      const headers = {"Authorization": `Bearer ${token}`}
      const {data} = await axios.put(url, formData, {headers});
      console.log(data);
      
      if (data.status == -1) {
        message.error('등록 실패1: ' + data.message);
        return;
      }
      
      
      // ✅ Item이미지 삭제
      const imgurl1 = `/api2/itemimage/deletebatch`
      const body = dlist
      const {data : data1} = await axios.delete(imgurl1, {headers : headers, data : body});
      console.log(data1);

      if (data1.status == -1) {
        message.error('등록 실패2: ' + data1.message);
        return;
      } 

      
      
      // ✅ Item이미지 등록
        const imgurl = `/api2/itemimage/insertbatch`
        const headers1 = {"Authorization": `Bearer ${token}` , "Content-Type":"multipart/form-data"}
        const inoData = {"item" : {"no" : no}}

        const formData1 = new FormData();
        formData1.append('ino', new Blob([JSON.stringify(inoData)], { type: 'application/json' }));
        //formData1.append('ino', itemNo );
        console.log("Ulist",ulist);
        if (ulist && ulist.length > 0) {
          for (let file of ulist) {
            console.log(file);
            formData1.append('img', file.originFileObj);  // 여러 이미지일 경우 반복 추가
          }
        } else if(fileList && fileList.length > 0) {
          console.log("flielist",fileList);
          for (let file of fileList) {
            console.log(file);
            formData1.append('img', file.originFileObj);  // 여러 이미지일 경우 반복 추가
          }
        } else {
          
        }
        

        const {data:data2} = await axios.post(imgurl, formData1, {headers : headers1});
        console.log(data2)

        if (data2.status == -1) {
          message.error('등록 실패3: ' + data2.message);
          return;
        }
      
        
      message.success('상품 수정이 완료되었습니다!');
      dispatch({type: 'item_menu', idx : "1"});
      navigate('/item/select');
      
      
      
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
                  optionFilterProp="items"
                  options={bookOptions}
                  filterOption={(input, option) =>
                    option?.label.toLowerCase().includes(input.toLowerCase())
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
                  parser={value => value.replace(/\$\s?|,/g, '')}
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
              <h3>이미지 업로드</h3>
              <Upload
                  multiple
                  name="images"
                  listType="picture"
                  fileList={fileList} // 상태와 연결
                  onChange = {handleChange}  // 상태 업데이트
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
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="book-register-btn"
                >
                  수정하기
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </Layout>
    </Layout>
  );
}




 