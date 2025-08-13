package com.cancerProgram.controller;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import com.cancerProgram.utils.DBConnectionUtil;
import com.alibaba.fastjson.JSONObject;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@WebServlet("/api/user/screening")
public class ScreenServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 设置响应内容类型为JSON
        response.setContentType("application/json;charset=UTF-8");
        PrintWriter out = response.getWriter();

        // 获取请求参数
        String openid = request.getParameter("openid");
        String riskLevel = request.getParameter("riskLevel");

        // 创建响应JSON对象
        JSONObject responseJson = new JSONObject();

        // 区分操作类型：只有openid参数是获取历史记录，有两个参数是更新记录
        if (openid != null && riskLevel == null) {
            // 调用获取历史记录的方法
            getHistoryRecord(openid, response, out, responseJson);
        } else if (openid != null && riskLevel != null) {
            // 调用更新历史记录的方法
            updateHistoryRecord(openid, riskLevel, response, out, responseJson);
        } else {
            // 参数不完整的情况
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            responseJson.put("success", false);
            responseJson.put("message", "参数不完整");
            out.print(responseJson.toJSONString());
        }

        out.flush();
        out.close();
    }

    private void getHistoryRecord(String openid, HttpServletResponse response, PrintWriter out, JSONObject responseJson) {
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        try {
            // 获取数据库连接
            conn = DBConnectionUtil.getConnection();

            // 查询记录
            String sql = "SELECT risklevel FROM riskrecord WHERE open_id = ?";
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, openid);
            rs = pstmt.executeQuery();

            if (rs.next()) {
                // 找到记录，返回风险等级
                String riskLevel = rs.getString("risklevel");
                response.setStatus(HttpServletResponse.SC_OK);
                responseJson.put("riskLevel", riskLevel);
            } else {
                // 未找到记录，返回null
                response.setStatus(HttpServletResponse.SC_OK);
                responseJson.put("riskLevel", null);
            }

            out.print(responseJson.toJSONString());

        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            responseJson.put("error", "数据库操作失败");
            out.print(responseJson.toJSONString());
        } finally {
            // 关闭资源
            try {
                if (rs != null) rs.close();
                if (pstmt != null) pstmt.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
            DBConnectionUtil.closeConnection(conn);
        }
    }

    /**
     * 更新用户的历史记录
     */
    private void updateHistoryRecord(String openid, String riskLevel, HttpServletResponse response, PrintWriter out, JSONObject responseJson) {
        Connection conn = null;
        PreparedStatement pstmt = null;

        try {
            // 获取数据库连接
            conn = DBConnectionUtil.getConnection();

            // 先查询是否存在该记录
            String checkSql = "SELECT COUNT(*) FROM riskrecord WHERE open_id = ?";
            pstmt = conn.prepareStatement(checkSql);
            pstmt.setString(1, openid);
            ResultSet rs = pstmt.executeQuery();
            rs.next();
            int count = rs.getInt(1);
            rs.close();
            pstmt.close();

            String sql;
            if (count > 0) {
                // 记录存在，执行更新操作
                sql = "UPDATE riskrecord SET risklevel = ? WHERE open_id = ?";
            } else {
                // 记录不存在，执行插入操作
                sql = "INSERT INTO riskrecord (risklevel, open_id) VALUES (?, ?)";
            }

            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, riskLevel);
            pstmt.setString(2, openid);
            pstmt.executeUpdate();

            // 返回成功信息
            response.setStatus(HttpServletResponse.SC_OK);
            responseJson.put("success", true);
            responseJson.put("message", "操作成功");
            out.print(responseJson.toJSONString());

        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            responseJson.put("success", false);
            responseJson.put("message", "数据库操作失败");
            out.print(responseJson.toJSONString());
        } finally {
            // 关闭资源
            try {
                if (pstmt != null) pstmt.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
            DBConnectionUtil.closeConnection(conn);
        }
    }
}
