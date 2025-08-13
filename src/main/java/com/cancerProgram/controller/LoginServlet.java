package com.cancerProgram.controller;


import com.alibaba.fastjson.JSONObject;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.PrintWriter;
import com.cancerProgram.utils.OpenIdUtil;

@WebServlet("/api/user/login")
public class LoginServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String code = req.getParameter("code");
        String openId = OpenIdUtil.getUserOpenId(code);
        resp.setContentType("application/json;charset=UTF-8");
        resp.setStatus(HttpServletResponse.SC_OK);
        JSONObject responseJson = new JSONObject();
        responseJson.put("openId", openId);
        PrintWriter out = resp.getWriter();
        out.print(responseJson.toJSONString());
        out.flush();
    }
}
