package com.example.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;




@Controller // => html파일을 표시하기위한 용도
public class IndexController {
  
  // 127.0.0.1:8080
  // 127.0.0.1:8080/index.do
  // 127.0.0.1:8080/home.do
  @GetMapping(value = {"/index.do", "/home.do", "/"})
  public String IndexGET() {
      return "index"; // 파일명 index.html
  }
  
}
