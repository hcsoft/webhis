package hcsoft.cache;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import net.sf.ehcache.Element;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.ehcache.EhCacheCacheManager;
import org.springframework.context.ApplicationEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;

@Component
public class CacheInit {
	@PersistenceContext
	private EntityManager em;
	
	@Autowired
	private CacheManager  cacheManager;
	
//	public void setCacheManager(EhCacheCacheManager cacheManager) {
//		this.cacheManager = cacheManager;
//	}

	private void init(){
		System.out.println("==cache init==");
		hcsoft.db.vo.Test test = em.find(hcsoft.db.vo.Test.class, 1);
		System.out.println("==test.getName()=="+test.getName());
		Cache  cache = cacheManager.getCache("userCache");  
		System.out.println("==String.valueOf(test.getId())=="+String.valueOf(test.getId()));
		System.out.println(test.getId());
		System.out.println("===="+1l);
		cache.put((test.getId()), test.getName());  
	}

//	public void onApplicationEvent(ApplicationEvent event) {
//		if (event instanceof ContextRefreshedEvent) {
//			System.out.println("==1111111==");
//			hcsoft.db.vo.Test test = em.find(hcsoft.db.vo.Test.class, 1l);
//			System.out.println("===="+test.getName());
//			Cache  cache = cacheManager.getCache("userCache");  
//			cache.put(test.getId(), test.getName());  
//		}
//	}
}
