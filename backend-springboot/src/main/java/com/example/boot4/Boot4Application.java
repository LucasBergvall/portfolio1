package com.example.boot4;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication

// 엔티티의 위치
@EntityScan(basePackages = { "com.example.entity" })

// 저장소의 위치
@EnableJpaRepositories(basePackages = { "com.example.repository" })

// 컨트롤러가 위치한 패키지(폴더) 등록하기
@ComponentScan(basePackages = {
	"com.example.controller",
	"com.example.restcontroller",
	"com.example.util",
	"com.example.config",
	"com.example.service",
	"com.example.dto",
	"com.example.component",
})

public class Boot4Application {
	
	public static void main(String[] args) {
		SpringApplication.run(Boot4Application.class, args);
	}
}
