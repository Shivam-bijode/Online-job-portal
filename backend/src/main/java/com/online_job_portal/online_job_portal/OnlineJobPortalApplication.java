package com.online_job_portal.online_job_portal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
@EnableAsync
@SpringBootApplication
public class OnlineJobPortalApplication {

	public static void main(String[] args) {
		SpringApplication.run(OnlineJobPortalApplication.class, args);
	}

}
