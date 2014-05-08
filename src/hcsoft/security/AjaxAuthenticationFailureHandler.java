package hcsoft.security;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

import com.alibaba.fastjson.JSONObject;

public class AjaxAuthenticationFailureHandler implements AuthenticationFailureHandler {
	public AjaxAuthenticationFailureHandler() {
	}

	public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
		Map ret = new HashMap();
		ret.put("success", false);
		response.setHeader("Content-Type", "application/json;charset=UTF-8");
		response.getWriter().print(JSONObject.toJSON(ret));
	}
}
