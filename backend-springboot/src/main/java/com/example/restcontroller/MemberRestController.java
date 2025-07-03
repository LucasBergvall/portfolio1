package com.example.restcontroller;

import com.example.dto.MemberUpdateDTO;
import com.example.dto.PasswordChangeDTO;
import com.example.entity.Member;
import com.example.entity.Session;
import com.example.repository.MemberRepository;
import com.example.repository.SessionRepository;
import com.example.service.MemberService;
import com.example.util.TokenComponent;
import java.net.URLEncoder;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;




@RestController
@RequestMapping("/api2/member")
@RequiredArgsConstructor
public class MemberRestController {

    private final MemberService memberService;
    private final TokenComponent tComponent;
    private final MemberRepository memberRepository;
    private final SessionRepository sessionRepository;


    // const url = `/api2/member/getnickname`
    // const headers = { Authorization: `Bearer ${token}` }
    // const { data } = await axios.get(url, {headers});

    @GetMapping("/getnickname")
    public Map<String, Object> getNickname(
    @RequestHeader("Authorization") String token) {
      Map<String, Object> map = new HashMap<>();

       try {
            // 1. 토큰에서 Bearer 제거
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            // 2. 토큰에서 사용자 정보 추출
            Map<String, Object> userInfo = tComponent.validate(token);
            String nickname = userInfo.get("nickname").toString();
            String userid = userInfo.get("userid").toString();
            map.put("status", 1);
            map.put("nickname", nickname);
            map.put("userid", userid);
        } catch (Exception e) {
            map.put("status", -1);
            map.put("message", e.getMessage());
        }
        return map;
  }
    

    // ✅ 회원가입
    // http://127.0.0.1:8080/api2/member/join
    // {
    //     "nickname": "부엉이",
    //     "userid": "book4",
    //     "password": "1234",
    //     "email": "a@a.com",
    //     "phone": "01012345678",
    //     "buyer": 1,
    //     "seller": 0,
    //     "admin": 0
    // }

    // {
    //     "message": "회원가입 성공",
    //     "status": 1
    // }
    @PostMapping("/join")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Member member) {
        Map<String, Object> result = memberService.register(member);
        return ResponseEntity.ok(result);
    }

    // ✅ 판매자 로그인 
    // http://127.0.0.1:8080/api2/member/login
    // {
    //     "userid": "book4",
    //     "password":"1234"
    // }

    // {
    //     "message": "로그인 성공",
    //     "status": 1,
    //     "token": "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyaWQiOiJib29rNCIsIm5pY2tuYW1lIjoi67aA7JeJ7J20IiwiYnV5ZXIiOjEsInNlbGxlciI6MCwiYWRtaW4iOjAsImV4cCI6MTc0ODUxNjIyMX0.6eNc43DRFyd69OweAqpyVu79W6OKUFCOBu4gInpsQ80"
    // }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Member loginRequest) {
        Map<String, Object> result = memberService.login(loginRequest);
        System.out.println("🔐 로그인 결과: " + result);

        return result;
    }

    // ✅ 구매자 로그인
    // http://127.0.0.1:8080/api2/member/loginbuyer
    // {
    //     "userid": "book4",
    //     "password":"1234"
    // }

    // {
    //     "message": "로그인 성공",
    //     "status": 1,
    //     "token": "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyaWQiOiJib29rNCIsIm5pY2tuYW1lIjoi67aA7JeJ7J20IiwiYnV5ZXIiOjEsInNlbGxlciI6MCwiYWRtaW4iOjAsImV4cCI6MTc0ODUxNjIyMX0.6eNc43DRFyd69OweAqpyVu79W6OKUFCOBu4gInpsQ80"
    // }

    @PostMapping("/loginbuyer")
    public Map<String, Object> loginbuyer(@RequestBody Member loginRequest) {
        Map<String, Object> result = new HashMap<>();

        // 1. 우선 회원 정보 조회 (아이디로 DB에서 회원 검색)
        Member rmember = memberRepository.findByUserid(loginRequest.getUserid());
        if (rmember == null) {
            result.put("status", 0);
            result.put("message", "회원을 찾을 수 없습니다.");
            return result;
        }

        // 2. 탈퇴 처리된 회원인지 확인 (cancel_enable == 0인 경우)
        if (rmember.getCancel_enable() == 0) {
            result.put("status", -2);
            result.put("message", "탈퇴한 회원은 로그인할 수 없습니다.");
            return result;
        }

        // 3. 탈퇴가 아닌 경우, 로그인 처리
        result = memberService.loginbuyer(loginRequest);
        System.out.println("🔐 로그인 결과: " + result);
        return result;
    }

    @PostMapping("/loginadmin")
    public Map<String, Object> loginadmin(@RequestBody Member loginRequest) {
        Map<String, Object> result = new HashMap<>();

        // 1. 우선 회원 정보 조회 (아이디로 DB에서 회원 검색)
        Member rmember = memberRepository.findByUserid(loginRequest.getUserid());
        if (rmember == null) {
            result.put("status", 0);
            result.put("message", "회원을 찾을 수 없습니다.");
            return result;
        }

        // 2. 탈퇴 처리된 회원인지 확인 (cancel_enable == 0인 경우)
        if (rmember.getCancel_enable() == 0) {
            result.put("status", -2);
            result.put("message", "탈퇴한 회원은 로그인할 수 없습니다.");
            return result;
        }

        // 3. 탈퇴가 아닌 경우, 로그인 처리
        result = memberService.loginadmin(loginRequest);
        System.out.println("🔐 로그인 결과: " + result);
        return result;
    }


    // ✅ 정보조회
    // 필터를 통과한 후 토큰에서 정보를 추출하여 반환
    // 127.0.0.1:8080/api2/member/getinfo
    // const headers = {"Authorization" : "Bearer TOKEN..."}
    @GetMapping("/getinfo")
    public ResponseEntity<Map<String, Object>> getMemberGetInfo(
        @RequestHeader("Authorization") String token) {
        try {
            if (token.startsWith("Bearer ")) {
                token = token.substring(7); //문자열(앞의 7글자)을 제거해서 실제 토큰 값만 추출 Bearer+공백 7자
                 Map<String, Object> userInfo = tComponent.validate(token);
                return ResponseEntity.ok(userInfo);
            }
           return ResponseEntity.ok(null);
        } 
        catch (RuntimeException e) {
            System.out.println("❌ 인증 오류: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }


    // ✅ 사용자 정보 조회
    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> getMemberInfo(@RequestHeader("Authorization") String token) {
        try {
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            Map<String, Object> userInfo = memberService.getMemberInfo(token);
            return ResponseEntity.ok(userInfo);
        } catch (RuntimeException e) {
            System.out.println("❌ 인증 오류: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    // ✅ 회원 정보 수정
    // http://127.0.0.1:8080/api2/member/update
    /*  const body = 
    {
        "nickname" : "", 
        "phone" : "",
    } */
    @PutMapping("/update")
    public ResponseEntity<Map<String, Object>> updateMember(
            @RequestHeader("Authorization") String token,
            @RequestBody MemberUpdateDTO dto) {

        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        Map<String, Object> result = memberService.updateMember(token, dto);
        return ResponseEntity.ok(result);
    }

    // ✅ 로그아웃
    // consy headers = {"Authorization":"Bearer 실제 토큰값"}
    // const {data} = await axios.post{url, body, {headers}};
    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(@RequestHeader(name = "Authorization") String token) {
        System.out.println(token);
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        Map<String, Object> result = memberService.logout(token);
        return ResponseEntity.ok(result);
    }

    // ✅ 비밀번호 변경
    // http://127.0.0.1:8080/api2/member/changepassword
    // const headers = {"Authorization":"Bearer 실제 토큰값"}
    /*  
    const body = 
    {
        "currentpassword" : "", 
        "newpassword" : "",
    } 
    */
    @PutMapping("/changepassword")
    public ResponseEntity<Map<String, Object>> changePassword(
        @RequestHeader("Authorization") String token,
        @RequestBody PasswordChangeDTO dto) {

        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        Map<String, Object> result = memberService.changePassword(token, dto);
        return ResponseEntity.ok(result);
    }

    // ✅ 회원 탈퇴
    // http:127.0.0.1:8080/api2/member/cancel
    // const headers = {"Authorization":"Bearer 실제 토큰값"} 
    // const body = {"password" : "비밀번호값"}
    @PutMapping("/cancel")
    public ResponseEntity<Map<String, Object>> cancelUser(
        @RequestHeader("Authorization") String token,
        @RequestBody Member member) {

        Map<String, Object> result = new HashMap<>();

        try {
            // 1. 토큰에서 Bearer 제거
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            // 2. 토큰에서 사용자 정보 추출
            Map<String, Object> userInfo = tComponent.validate(token);
            String userid = userInfo.get("userid").toString();

            // 3. DB에서 회원 조회
            Member rmember = memberRepository.findByUserid(userid);
            if (rmember == null) {
                result.put("status", 0);
                result.put("message", "회원을 찾을 수 없습니다.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(result);
            }

            // 4. 비밀번호 일치 확인
            if (!rmember.getPassword().equals(member.getPassword())) {
                result.put("status", -1);
                result.put("message", "비밀번호가 일치하지 않습니다.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
            }

            // 5. 탈퇴 처리 (cancel_enable = 0)
            rmember.setCancel_enable(0);
            memberRepository.save(rmember);

            result.put("status", 1);
            result.put("message", "회원 탈퇴 처리 완료");
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            e.printStackTrace();
            result.put("status", -9);
            result.put("message", "서버 오류: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
        }
    }


    // 127.0.0.1:8080/api2/member/naverlogin
    // const body = {"code" : , "state" : }
    @PostMapping("/naverlogin")
    public Map<String, Object> naverLogin(@RequestBody Map<String, String> param) {
        Map<String, Object> response = new HashMap<>();
        try {
            // 1. 프론트에서 받은 code, state
            String code = param.get("code");
            String state = param.get("state");

            // 2. 네이버 OAuth 토큰 요청
            String clientId = "Ri6LrxX3UeLRnaYhg4w4"; // 본인 Client ID
            String clientSecret = "SNZYT224R3"; // 본인 Client Secret
            String redirectURI = URLEncoder.encode("http://localhost:3000/naver_login", StandardCharsets.UTF_8);

            String tokenUrl = "https://nid.naver.com/oauth2.0/token?grant_type=authorization_code"
                    + "&client_id=" + clientId
                    + "&client_secret=" + clientSecret
                    + "&redirect_uri=" + redirectURI
                    + "&code=" + code
                    + "&state=" + state;

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<Map> tokenResponse = restTemplate.getForEntity(tokenUrl, Map.class);

            Map<String, Object> tokenMap = tokenResponse.getBody();
            String accessToken = (String) tokenMap.get("access_token");

            if (accessToken == null) {
                response.put("status", 0);
                response.put("message", "네이버 토큰 요청 실패");
                return response;
            }

            // 3. 네이버 사용자 정보 요청
            String profileUrl = "https://openapi.naver.com/v1/nid/me";

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + accessToken);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<Map> profileResponse = restTemplate.exchange(profileUrl, HttpMethod.GET, entity, Map.class);
            Map<String, Object> profileMap = profileResponse.getBody();

            Map<String, Object> responseData = (Map<String, Object>) profileMap.get("response");
            String naverId = (String) responseData.get("id");
            String nickname = (String) responseData.get("nickname");
            String email = (String) responseData.get("email");
            
            if(!memberRepository.existsByUserid(email)) {
                Member member = new Member();
                member.setEmail(email);
                member.setPassword("1234");
                member.setPhone("00000000");
                member.setNickname(email);
                member.setUserid(email);
                member.setBuyer(1);
                memberRepository.save(member);
            }

            Session existing = sessionRepository.findBySessionId(email);
            if (existing != null) sessionRepository.delete(existing);

            Session session = new Session();
            session.setSessionId(email);
            session.setToken(accessToken);
            sessionRepository.save(session);

            System.out.println("네이버 아이디: " + naverId);
            System.out.println("닉네임: " + nickname);
            System.out.println("이메일: " + email);
            // 4. 이 정보를 이용해서 DB에서 회원 확인 or 신규 회원가입 진행 가능
            // 여기서 본인의 DB 조회, 가입 로직 작성하면 됩니다.
            Member member1 = memberRepository.findByUserid(email);
            String token = tComponent.create(member1.getNo(), email, email, 1, 0, 0);
            // 임시 성공 응답
            response.put("status", 1);
            // response.put("naverId", naverId);
            response.put("nickname", member1.getNickname());
            response.put("email", member1.getEmail());
            response.put("token", token);
            return response;

        } catch (Exception e) {
            e.printStackTrace();
            response.put("status", 0);
            response.put("message", "서버 오류 발생");
            return response;
        }
    }

    // 127.0.0.1:8080/api2/member/kakakologin
    // const body = {"code" : , "status" : }
    @PostMapping("/kakaologin")
    public Map<String, Object> kakaoLogin(@RequestBody Map<String, String> param) {
        Map<String, Object> response = new HashMap<>();
        try {
            String code = param.get("code");
            String state = param.get("state");

            String clientId = "73c11920811e12f3af365d05835c4349";
            String clientSecret = "0AiXw7PzRpludrRpJfF8xjg0jwKsohX9";  // 이거 꼭 넣어야 안전합니다
            String redirectURI = "http://localhost:3000/kakaologin";

            String tokenUrl = "https://kauth.kakao.com/oauth/token";

            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("grant_type", "authorization_code");
            params.add("client_id", clientId);
            params.add("client_secret", clientSecret);
            params.add("redirect_uri", redirectURI);
            params.add("code", code);

            HttpEntity<MultiValueMap<String, String>> tokenRequest = new HttpEntity<>(params, headers);
            ResponseEntity<Map> tokenResponse = restTemplate.exchange(
                    tokenUrl, HttpMethod.POST, tokenRequest, Map.class);

            Map<String, Object> tokenMap = tokenResponse.getBody();
            String accessToken = (String) tokenMap.get("access_token");

            if (accessToken == null) {
                response.put("status", 0);
                response.put("message", "카카오 토큰 발급 실패");
                return response;
            }

            // 사용자 정보 요청
            String profileUrl = "https://kapi.kakao.com/v2/user/me";
            HttpHeaders profileHeaders = new HttpHeaders();
            profileHeaders.set("Authorization", "Bearer " + accessToken);
            HttpEntity<String> profileRequest = new HttpEntity<>(profileHeaders);

            ResponseEntity<Map> profileResponse = restTemplate.exchange(
                    profileUrl, HttpMethod.GET, profileRequest, Map.class);
            Map<String, Object> profileMap = profileResponse.getBody();

            Long kakaoId = Long.parseLong(profileMap.get("id").toString());
            Map<String, Object> kakaoAccount = (Map<String, Object>) profileMap.get("kakao_account");
            Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");
            String nickname = (String) profile.get("nickname");
            String email = (String) kakaoAccount.get("email");

            if(!memberRepository.existsByUserid(email)) {
                Member member = new Member();
                member.setEmail(email);
                member.setPassword("1234");
                member.setPhone("00000000");
                member.setNickname(email);
                member.setUserid(email);
                member.setBuyer(1);
                memberRepository.save(member);
            }

            Session existing = sessionRepository.findBySessionId(email);
            if (existing != null) sessionRepository.delete(existing);

            Session session = new Session();
            session.setSessionId(email);
            session.setToken(accessToken);
            sessionRepository.save(session);

            System.out.println("카카오 ID: " + kakaoId);
            System.out.println("닉네임: " + nickname);
            System.out.println("이메일: " + email);
            
            Member member1 = memberRepository.findByUserid(email);
            String token = tComponent.create(member1.getNo(), email, email, 1, 0, 0);

            // ✅ DB 저장 없이 단순 응답만 내려줌 (네이버 형식 동일)
            response.put("status", 1);
            response.put("kakaoId", kakaoId);
            response.put("nickname", member1.getNickname());
            response.put("email", member1.getEmail());
            response.put("token", token);
            return response;

        } catch (Exception e) {
            e.printStackTrace();
            response.put("status", 0);
            response.put("message", "서버 오류 발생: " + e.getMessage());
            return response;
        }
    }

    // 127.0.0.1:8080/api2/member/googlelogin
    @PostMapping("/googlelogin")
    public Map<String, Object> googleLogin(@RequestBody Map<String, String> param) {
        Map<String, Object> response = new HashMap<>();
        try {
            String code = param.get("code");
            String state = param.get("state"); // state는 필수는 아님

            String clientId = "139320082222-jgodi1iosp6q5sla4mbmu287j5tujjsa.apps.googleusercontent.com";
            String clientSecret = "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";
            String redirectURI = "http://localhost:3000/googlelogin";

            // 1️⃣ 토큰 요청
            String tokenUrl = "https://oauth2.googleapis.com/token";

            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("grant_type", "authorization_code");
            params.add("client_id", clientId);
            params.add("client_secret", clientSecret);
            params.add("redirect_uri", redirectURI);
            params.add("code", code);

            HttpEntity<MultiValueMap<String, String>> tokenRequest = new HttpEntity<>(params, headers);
            ResponseEntity<Map> tokenResponse = restTemplate.exchange(
                    tokenUrl, HttpMethod.POST, tokenRequest, Map.class);

            Map<String, Object> tokenMap = tokenResponse.getBody();
            String accessToken = (String) tokenMap.get("access_token");

            if (accessToken == null) {
                response.put("status", 0);
                response.put("message", "구글 토큰 발급 실패");
                return response;
            }

            // 2️⃣ 사용자 정보 요청
            String profileUrl = "https://www.googleapis.com/oauth2/v2/userinfo";

            HttpHeaders profileHeaders = new HttpHeaders();
            profileHeaders.set("Authorization", "Bearer " + accessToken);
            HttpEntity<String> profileRequest = new HttpEntity<>(profileHeaders);

            ResponseEntity<Map> profileResponse = restTemplate.exchange(
                    profileUrl, HttpMethod.GET, profileRequest, Map.class);

            Map<String, Object> profileMap = profileResponse.getBody();
            String googleId = (String) profileMap.get("id");
            String email = (String) profileMap.get("email");
            String name = (String) profileMap.get("name");
            
            if(!memberRepository.existsByUserid(email)) {
                Member member = new Member();
                member.setEmail(email);
                member.setPassword("1234");
                member.setPhone("00000000");
                member.setNickname(email);
                member.setUserid(email);
                member.setBuyer(1);
                memberRepository.save(member);
            }

            Session existing = sessionRepository.findBySessionId(email);
            if (existing != null) sessionRepository.delete(existing);

            Session session = new Session();
            session.setSessionId(email);
            session.setToken(accessToken);
            sessionRepository.save(session);


            System.out.println("구글 ID: " + googleId);
            System.out.println("이름: " + name);
            System.out.println("이메일: " + email);


            Member member1 = memberRepository.findByUserid(email);
            String token = tComponent.create(member1.getNo(), email, email, 1, 0, 0);

            // ✅ DB 저장 없이 응답만 내려줌 (카카오, 네이버와 동일)
            response.put("status", 1);
            response.put("googleId", googleId);
            response.put("nickname", member1.getNickname());
            response.put("email", member1.getEmail());
            response.put("token", token);
            return response;

        } catch (Exception e) {
            e.printStackTrace();
            response.put("status", 0);
            response.put("message", "서버 오류 발생: " + e.getMessage());
            return response;
        }
    }


    @PostMapping("/find-id")
    public ResponseEntity<Map<String, Object>> findId(@RequestBody Map<String, String> body) {
        Map<String, Object> result = new HashMap<>();
        String email = body.get("email");

        Member member = memberRepository.findByEmail(email);
        if (member != null) {
            result.put("status", 1);
            result.put("userid", member.getUserid());
        } else {
            result.put("status", 0);
            result.put("message", "등록된 이메일이 없습니다.");
        }
        return ResponseEntity.ok(result);
    }


    @PutMapping("/reset-password")
    public ResponseEntity<Map<String, Object>> resetPassword(@RequestBody Map<String, String> body) {
        Map<String, Object> result = new HashMap<>();
        String userid = body.get("userid");
        String email = body.get("email");

        Member member = memberRepository.findByUserid(userid);
        if (member != null && member.getEmail().equals(email)) {
            String tempPassword = "temp1234"; // 랜덤 생성 추천
            member.setPassword(tempPassword); // 실제로는 암호화해서 저장 필요
            memberRepository.save(member);
            result.put("status", 1);
            result.put("message", "임시 비밀번호가 발급되었습니다.");
            result.put("tempPassword", tempPassword); // 실제 서비스에서는 이메일 발송 권장
        } else {
            result.put("status", 0);
            result.put("message", "아이디 또는 이메일 정보가 일치하지 않습니다.");
        }

        return ResponseEntity.ok(result);
    }

}

