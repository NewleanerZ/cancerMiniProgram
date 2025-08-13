package com.cancerProgram.utils;

import com.alibaba.fastjson.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class OpenIdUtil {
    public static String getUserOpenId(String code) {
        Map<String, String> buildParams = buildParams(code);
        String url = "https://api.weixin.qq.com/sns/jscode2session";
        String result = HttpClientUtil.sendPost(url, buildParams);
        if (result == null) {
            throw new RuntimeException("获取openId失败");
        }
        System.out.println("post请求获取结果:"+result);

        // 解析出openId
        JSONObject jsonObject = JSONObject.parseObject(result);
        String openid = jsonObject.getString("openid");
        return openid;
    }
    private static Map<String, String> buildParams(String code) {
        Map<String, String> paramsMap = new HashMap<>();
        paramsMap.put("appid", "wx0751a6fb21e26b37");
        paramsMap.put("secret", "f2654014abd5650f9349790ff7beb736");
        paramsMap.put("js_code", code);
        paramsMap.put("grant_type", "authorization_code");
        return paramsMap;
    }
}
