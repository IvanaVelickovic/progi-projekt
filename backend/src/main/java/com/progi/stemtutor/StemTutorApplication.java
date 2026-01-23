package com.progi.stemtutor;

import com.progi.stemtutor.service.DatabaseInitService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@EnableAsync
@SpringBootApplication
public class StemTutorApplication {

	public static void main(String[] args) {
		ApplicationContext context= SpringApplication.run(StemTutorApplication.class, args);
        DatabaseInitService initService = context.getBean(DatabaseInitService.class);
	}

}
