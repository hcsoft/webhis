package hcsoft.db.vo;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the "test" database table.
 * 
 */
@Entity
@Table(name="\"test\"")
@NamedQuery(name="Test.findAll", query="SELECT t FROM Test t")
public class Test implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="\"id\"", unique=true, nullable=false)
	private long id;

	@Column(name="\"name\"", length=255)
	private String name;

	public Test() {
	}

	public long getId() {
		return this.id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

}