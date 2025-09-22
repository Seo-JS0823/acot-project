package finance.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
	
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		return http.csrf(csrf -> csrf.disable())
				   .authorizeHttpRequests(auth -> 
				       auth.requestMatchers("/", "/login", "/error", "/view/**", "/join", "/css/**", "/img/**", "/js/**").permitAll()
				           .requestMatchers("/admin").hasRole("ADMIN")
				           .anyRequest().authenticated())
				   .formLogin(form ->
				       form.loginPage("/")
				           .loginProcessingUrl("/loginProcess")
				           .defaultSuccessUrl("/home")
				           .permitAll())
				   .build();
	}
}
