package ru.lavrent.weblab3.util;

import java.lang.reflect.Type;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonParseException;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;

public class LocalDateTimeTypeAdapter implements JsonSerializer<LocalDateTime>, JsonDeserializer<LocalDateTime> {

  private final DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;

  @Override
  public JsonElement serialize(final LocalDateTime dateTime, final Type typeOfSrc,
      final JsonSerializationContext context) {
    return new JsonPrimitive(dateTime.format(formatter));
  }

  @Override
  public LocalDateTime deserialize(final JsonElement json, final Type typeOfT,
      final JsonDeserializationContext context) throws JsonParseException {
    return LocalDateTime.parse(json.getAsString(), formatter);
  }
}