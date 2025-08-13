package com.cancerProgram.utils;


import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * 数据库工具类
 * 连接了云数据库
 */
public class DBConnectionUtil {

    private static final String URL = "jdbc:mysql://rm-bp1e4vn45u998v0rego.mysql.rds.aliyuncs.com:3306/cancerMiniProgram";
    private static final String USER = "root";
    private static final String PASSWORD = "Zx123456";

    /**
     * @eo.name getConnection
     * @return Connection
     */
    // 获取数据库连接
    public static Connection getConnection() throws SQLException {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            throw new SQLException("MySQL JDBC 驱动未找到", e);
        }

        // 创建连接
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }

    /**
     * @eo.name closeConnection
     * @param conn
     * @return void
     */
    public static void closeConnection(Connection conn) {
        if (conn != null) {
            try {
                conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
}

