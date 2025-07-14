//src / reducers /MenuReducer.js


//loged 로그인의 상태 0 or 1 token은 백엔드에서 주는 키
const initialstate = {
    item_menu: "1", // 사이드바 1
    mypage_menu: "1", // 사이드바 1
    buy_menu : "1",
    guest_menu : "1",
    css_menu : "1"
};

const MenuReducer = (state = initialstate, action) => {

    //로그인 구분
    // dispatch({type: 'item_menu', idx : "1"}) 으로 사용
    if (action.type === 'item_menu') {
        
        return{
            ...state,
            item_menu: action.idx
        }
    }// dispatch({type: 'buy_menu', idx : "1"}) 으로 사용
    else if (action.type === 'buy_menu') {
        
        return{
            ...state,
            sale_menu: action.idx
        }

    }
    else if (action.type === 'mypage_menu') {
        
        return{
            ...state,
            mypage_menu: action.idx
        }

    }
    else if (action.type === 'guest_menu') {
        
        return{
            ...state,
            guest_menu: action.idx
        }

    }
    else {
        return state;
    }
};

export default MenuReducer;