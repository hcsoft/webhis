package hcsoft.jsonsvr.common;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

import javax.sql.DataSource;

import org.apache.commons.dbutils.QueryRunner;
import org.apache.commons.dbutils.ResultSetHandler;
import org.apache.commons.dbutils.handlers.KeyedHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/common")
public class CommonSvr {
	@Autowired
	private DataSource datasource;

	@RequestMapping(value="/{ID}",method = RequestMethod.GET)
	@Transactional(value = "jdbc", propagation = Propagation.NOT_SUPPORTED, readOnly = true)
	public @ResponseBody
	Map list(@PathVariable(value="ID") String id,@RequestBody Map json) throws Exception {
		Map ret = new HashMap();
		ResultSetHandler<Map> h = new KeyedHandler();
		QueryRunner run = new QueryRunner(datasource);
		try {
			Map crud = run.query("select * from cod_crud where name = ? ",h,id);
			System.out.println("===="+crud);
			int count = (Integer)(run.query("SELECT count(*) as count FROM " + crud.get("tablename"),h)).get("count");
			System.out.println("===="+count);
			String sql = "SELECT * FROM " + crud.get("tablename");
			if(crud.get("tablename") !=null && crud.get("tablename") != ""){
				sql+=" order by "+crud.get("tablename");
			}
			Map result = run.query(sql, h,
					"John Doe");
			// do something with the result
			ret.put("success", true);
			ret.put("list", result);
			return result;
		} finally {
			// Use this helper method so we don't have to check for null
		}

	}

	@RequestMapping(value="/{ID}",method = RequestMethod.PUT)
	@Transactional(value = "jdbc")
	public @ResponseBody
	Map add(@RequestBody Map json) throws Exception {
		System.out.println("===add=");
		Map ret = new HashMap();
		QueryRunner run = new QueryRunner( datasource );
		try
		{
		    // Execute the SQL update statement and return the number of
		    // inserts that were made
		    int inserts = run.update( "INSERT INTO Person (name,height) VALUES (?,?)",
		                              "John Doe", 1.82 );
		    // The line before uses varargs and autoboxing to simplify the code

		    // Now it's time to rise to the occation...
		    int updates = run.update( "UPDATE Person SET height=? WHERE name=?",
		                              2.05, "John Doe" );
		    // So does the line above
		}
		catch(SQLException sqle) {
		    // Handle it
		}
		ret.put("success", true);
		return ret;
	}

	@RequestMapping(value="/{ID}",method = RequestMethod.DELETE)
	@Transactional(value = "jdbc")
	public @ResponseBody
	Map del(@RequestBody Map json) throws Exception {
		System.out.println("===add=");
		Map ret = new HashMap();
		QueryRunner run = new QueryRunner( datasource );
		try
		{
		    int inserts = run.update( "INSERT INTO Person (name,height) VALUES (?,?)",
		                              "John Doe", 1.82 );
		    // So does the line above
		}
		catch(SQLException sqle) {
		    // Handle it
		}
		ret.put("success", true);
		return ret;
	}
}
