package hcsoft.db;

import java.math.BigInteger;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.persistence.EntityManager;
import javax.persistence.Query;

import org.apache.commons.beanutils.BeanUtils;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

public class DbProc {
	
	@Transactional(propagation = Propagation.NOT_SUPPORTED, readOnly = true)
	public static Map queryPage( EntityManager em, String sql, Map json) {
		// Map object = gs.fromJson(json, Map.class);
		DbPageVO vo = DbPageVO.defaultvo();
		System.out.println("==json==" + json);
		System.out.println("====" + json.getClass().getName());
		if(!json.containsKey("page")){
			Map ret = new HashMap();
			ret.put("success", false);
			ret.put("msg", "请与管理员联系!程序错误!未传入page参数!");
			return ret;
		}
		try{
			BeanUtils.populate(vo, (Map) json.get("page"));
		}catch(Exception ex){
			
		}
		return DbProc.queryPage(em, "from Users",
				(Map) json.get("params"), vo);
	}
	
	@Transactional(propagation = Propagation.NOT_SUPPORTED, readOnly = true)
	public static Map queryPage( EntityManager em, String sql, DbPageVO vo) {
		return queryPage(em,sql,null,vo);
	}
	
	@Transactional(propagation = Propagation.NOT_SUPPORTED, readOnly = true)
	public static Map queryPage( EntityManager em, String sql,Map params, Map pagemap) {
		DbPageVO vo = new DbPageVO();
		try{
			BeanUtils.populate(vo, pagemap);
		}catch(Exception e){
			
		}
		return queryPage(em,sql,params,vo);
	}
	
	@Transactional(propagation = Propagation.NOT_SUPPORTED, readOnly = true)
	public static Map queryPage( EntityManager em, String sql,Map params, Map pagemap,Class[] cls) {
		DbPageVO vo = new DbPageVO();
		try{
			BeanUtils.populate(vo, pagemap);
		}catch(Exception e){
			
		}
		return queryPage(em,sql,params,vo,cls);
	}
	
	@Transactional(propagation = Propagation.NOT_SUPPORTED, readOnly = true)
	public static Map queryPage(EntityManager em, String sql,Map params, DbPageVO vo) {
		if(vo==null) vo = DbPageVO.defaultvo();
		
		Map ret = new HashMap();
		int formindex = sql.toLowerCase().indexOf("from ");
		formindex = formindex<0?0:formindex;
		int orderindex = sql.toLowerCase().indexOf("order by");
		orderindex = orderindex<0?sql.length():orderindex;
		
		
		String orderby = sql.substring(orderindex);
		String querysql = sql.substring(formindex,orderindex);
		String resultsql = sql.substring(0,formindex);
		String countsql = "select count(*) "+ querysql;
		int rowcount = ((Long)em.createQuery(countsql).getSingleResult()).intValue();
		if(params!=null){
			for(Iterator iter = params.keySet().iterator();iter.hasNext();){
				String key = (String)iter.next();
				if(querysql.indexOf(" where ")<0){
					querysql+=" where 1=1 ";
				}
				if(params.get(key) instanceof Map){
					Map value = (Map)params.get(key);
					if(value.containsKey("opt")){
						querysql+= " and "+ key+value.get("opt")+" ?";
					}else{
						querysql+= " and "+key+" = ?";
					}
				}else{
					querysql+= " and "+key+" = ?";
				}
			}
		}
		Query query = em.createQuery(resultsql+querysql + orderby);
		int count = 0;
		if(params!=null){
			for(Iterator iter = params.keySet().iterator();iter.hasNext();){
				String key = (String)iter.next();
				if(params.get(key) instanceof Map){
					Map value = (Map)params.get(key);
					query.setParameter(count++, params.get(value.get("value")));
				}else{
					query.setParameter(count++, params.get(key));
				}
				
			}
		}
		query.setFirstResult((vo.getCurrentpage()-1)*vo.getPagesize());
		query.setMaxResults(vo.getPagesize());
		
		vo.setRowcount(rowcount);
		vo.setPagecount(rowcount/vo.getPagesize() + (rowcount%vo.getPagesize() >0 ?1:0));
		ret.put("page", vo);
		ret.put("list", query.getResultList());
		ret.put("success", true);
		return ret;
	}
	
	
	@Transactional(propagation = Propagation.NOT_SUPPORTED, readOnly = true)
	public static Map queryPage(EntityManager em, String sql,Map params, DbPageVO vo,Class[] cls) {
		if(vo==null) vo = DbPageVO.defaultvo();
		
		Map ret = new HashMap();
		int formindex = sql.toLowerCase().indexOf("from ");
		formindex = formindex<0?0:formindex;
		int orderindex = sql.toLowerCase().indexOf("order by");
		orderindex = orderindex<0?sql.length():orderindex;
		
		
		String orderby = sql.substring(orderindex);
		String querysql = sql.substring(formindex,orderindex);
		String selectsql = sql.substring(0,formindex);
		String countsql = "select count(*) "+ querysql;
		int rowcount = ((BigInteger)(em.createNativeQuery(countsql).getSingleResult())).intValue();
		if(params!=null){
			for(Iterator iter = params.keySet().iterator();iter.hasNext();){
				String key = (String)iter.next();
				if(querysql.indexOf(" where ")<0){
					querysql+=" where 1=1 ";
				}
				if(params.get(key) instanceof Map){
					Map value = (Map)params.get(key);
					if(value.containsKey("opt")){
						querysql+= " and "+ key+value.get("opt")+" ?";
					}else{
						querysql+= " and "+key+" = ?";
					}
				}else{
					querysql+= " and "+key+" = ?";
				}
			}
		}
		Query query = em.createNativeQuery(selectsql+querysql + orderby);
		int count = 0;
		if(params!=null){
			for(Iterator iter = params.keySet().iterator();iter.hasNext();){
				String key = (String)iter.next();
				if(params.get(key) instanceof Map){
					Map value = (Map)params.get(key);
					query.setParameter(count++, params.get(value.get("value")));
				}else{
					query.setParameter(count++, params.get(key));
				}
				
			}
		}
		query.setFirstResult((vo.getCurrentpage()-1)*vo.getPagesize());
		query.setMaxResults(vo.getPagesize());
		for(int i = 0; i <cls.length; i++){
//			query..addEntity(cls[i]);
		}
		vo.setRowcount(rowcount);
		vo.setPagecount(rowcount/vo.getPagesize() + (rowcount%vo.getPagesize() >0 ?1:0));
		ret.put("page", vo);
		ret.put("list", query.getResultList());
		ret.put("success", true);
		return ret;
	}
	

}
