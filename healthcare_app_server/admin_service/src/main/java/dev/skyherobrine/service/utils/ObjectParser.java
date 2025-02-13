package dev.skyherobrine.service.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

@Component
public class ObjectParser {

    private static ObjectMapper mapper;

    public ObjectParser(ObjectMapper mapper) {
        this.mapper = mapper;
    }

    public static String convertObjectToJson(Object object) throws Exception {
        return mapper.writeValueAsString(object);
    }

    public static <T> T convertJsonToObject(String json, Class<T> clazz) throws Exception {
        return mapper.readValue(json, clazz);
    }
}
