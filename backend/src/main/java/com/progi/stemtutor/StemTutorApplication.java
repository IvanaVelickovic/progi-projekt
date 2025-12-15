package com.progi.stemtutor;

import com.progi.stemtutor.service.DatabaseInitService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;

@SpringBootApplication
public class StemTutorApplication {

	public static void main(String[] args) {
		ApplicationContext context= SpringApplication.run(StemTutorApplication.class, args);
        DatabaseInitService initService = context.getBean(DatabaseInitService.class);

        // Run your insertions
        initService.insertSubjects();
	}

}
