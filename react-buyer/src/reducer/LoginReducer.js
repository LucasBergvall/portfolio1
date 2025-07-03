//src / reducers /LoginReducer.js

//loged 로그인의 상태 0 or 1 token은 백엔드에서 주는 키
const initialstate = {
    logged: 0, // 로그인 상태
    token: '', // 실제 토큰
    nickname:"", // 닉네임
    userid:""// 유저아이디
};

const LoginReducer = (state = initialstate, action) => {

    //로그인 구분
    // dispatch({type: 'login', token : 토큰, "nickname": }) 으로 사용
    
    if (action.type === 'login') {
        console.log(action)
        sessionStorage.setItem("token", action.token);
        return{
            ...state,
            logged:1,
            nickname : action.nickname,
            token:action.token,
            userid: action.userid
        }
    }// dispatch({type: 'logout'}) 으로 사용
    else if (action.type === 'logout') {
        sessionStorage.removeItem("token");
        return{
            ...state,
            logged:0,
            nickname : "",
            token:'',
            userid: ''

        }

    } 
    else if(action.type === 'nickname') {
        return {
            ...state,
            nickname : action.nickname, userid : action.userid
        }
    }
    else {
        const token = sessionStorage.getItem("token")
        if(token !== null && state.logged === 0){
          return {
            ...state,
            logged: 1,
            token: token,
            nickname: ""
          };
        }
        return state;
    }
};

export default LoginReducer;