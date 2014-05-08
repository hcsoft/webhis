package healthplatform;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;


@RunWith(SpringJUnit4ClassRunner.class)
//@ContextConfiguration(locations = "file:F:/360cloud/workspace/healthplatform/src/main/cfg/spring-servlet.xml")
@ContextConfiguration(locations = "file:cfg/spring-servlet.xml")
public class TestJpa{
	@PersistenceContext
	private EntityManager em;
	
	@Autowired
	private CacheManager  cacheManager;
	
	
	@Test
	public void jpaTest(){
		System.out.println("==testjpa==");
		hcsoft.db.vo.Test test = em.find(hcsoft.db.vo.Test.class, 1l);
		System.out.println("===="+test.getName());
	}
	
	@Test
	public void jpaCache(){
		Cache  cache = cacheManager.getCache("userCache"); 
		int key = 1;
		System.out.println("testcache===="+cache.get(0).get());
	}
}
