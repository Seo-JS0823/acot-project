package finance.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "users")
@Builder
@Getter
@Setter
public class User {
	
	@Id
	private String userid;
	
	@Column(name = "username")
	private String name;
	
	@Column(name = "password")
	private String password;
	
	public User() {}
	
	public User(String userid, String name, String password) {
		this.userid = userid;
		this.name = name;
		this.password = password;
	}
	
}
