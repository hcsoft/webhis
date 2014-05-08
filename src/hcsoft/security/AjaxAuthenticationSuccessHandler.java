package hcsoft.security;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.converter.HttpMessageNotWritableException;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import com.alibaba.fastjson.JSONObject;

public class AjaxAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

	public AjaxAuthenticationSuccessHandler() {
	}

	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
		Map ret = new HashMap();
		ret.put("success", true);
		
		response.setHeader("Content-Type", "application/json;charset=UTF-8");
		response.getWriter().print(JSONObject.toJSON(ret));
	}
}
