// MegaDropDown.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import './css/MegaDropDown.css';

export default function MegaDropdown() {
  const { token } = useSelector(state => state.LoginReducer);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('cart');
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (token) {
      loadCartItems();
      loadWishlistItems();
    }
  }, [token]);

  const loadCartItems = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get('/api2/cart/selectlist?page=1&cnt=1000', { headers });
      if (res.data.status === 1) {
        const flatItems = Object.values(res.data.list).flat();
        setCartItems(flatItems);
      }
    } catch (err) { console.error(err); }
  };

  const loadWishlistItems = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get('/api2/like/selectlist?page=1&cnt=1000', { headers });
      if (res.data.status === 1) {
        setWishlistItems(res.data.list);
      }
    } catch (err) { console.error(err); }
  };

  const handleCheckbox = (item, type) => {
    const key = `${type}-${item.itemNo}`;
    setSelected(prev =>
      prev.includes(key)
        ? prev.filter(k => k !== key)
        : [...prev, key]
    );
  };

  const getSelectedItems = () => {
    let sel = [];
    selected.forEach(key => {
      if (key.startsWith('cart-')) {
        const id = parseInt(key.split('-')[1]);
        const item = cartItems.find(it => it.itemNo === id);
        if (item) sel.push({
          title: item.title,
          price: item.bookprice,
          discount: item.discount ?? 0,
          quantity: item.quantity ?? 1
        });
      }
      if (key.startsWith('wish-')) {
        const id = parseInt(key.split('-')[1]);
        const item = wishlistItems.find(it => it.itemNo === id);
        if (item) sel.push({
          title: item.title,
          price: item.bookprice,
          discount: item.discount ?? 0,
          quantity: 1
        });
      }
    });
    return sel;
  };

  const calcSummary = () => {
    const items = getSelectedItems();
    let totalQty = items.reduce((sum, it) => sum + it.quantity, 0);
    let totalPrice = items.reduce((sum, it) => sum + (it.price * it.quantity), 0);
    let totalDiscount = items.reduce((sum, it) => sum + (it.price * (it.discount / 100) * it.quantity), 0);
    let finalPay = totalPrice - totalDiscount;
    return { totalQty, totalPrice, totalDiscount, finalPay, items };
  };

  const summary = calcSummary();

  return (
    <div className={`mega-wrapper ${open ? 'open' : ''}`}>
      <div className="menu-bar">
        <div className="tabs">
          <button className={tab === 'cart' ? 'active' : ''} onClick={() => { setTab('cart'); setOpen(true); }}>
            쇼핑카트 ({cartItems.length})
          </button>
          <button className={tab === 'wish' ? 'active' : ''} onClick={() => { setTab('wish'); setOpen(true); }}>
            위시리스트 ({wishlistItems.length})
          </button>
        </div>
        <div className="arrow-btn" onClick={() => setOpen(!open)}>
          {open ? '▼' : '▲'}
        </div>
      </div>

      {open && (
        <div className="drawer-content">
          <div className="items-area">
            {(tab === 'cart' ? cartItems : wishlistItems).map(item => (
              <div className="item-box" key={item.itemNo}>
                <input 
                  type="checkbox" 
                  onChange={() => handleCheckbox(item, tab)} 
                  checked={selected.includes(`${tab}-${item.itemNo}`)} 
                />
                <img 
                  src={tab === 'cart' 
                        ? (item.imgDefault || '/default-image.png') 
                        : (item.imageNo ? `/api2/itemimage/image?no=${item.imageNo}` : '/default-image.png')}
                  alt={item.title} 
                />
                <div className="item-title">{item.title}</div>
              </div>
            ))}
          </div>

          <div className="summary-box">
            <div>주문상품수량: {summary.totalQty}개</div>
            <div>상품원가 합계: {summary.totalPrice.toLocaleString()}원</div>
            <div>총 할인율:</div>
            {summary.items.map((item, idx) => (<div key={idx}>{item.discount}%</div>))}
            <div>총 할인금액: {summary.totalDiscount.toLocaleString()}원</div>
            <div>최종 결제금액: {summary.finalPay.toLocaleString()}원</div>
          </div>
        </div>
      )}
    </div>
  );
}
