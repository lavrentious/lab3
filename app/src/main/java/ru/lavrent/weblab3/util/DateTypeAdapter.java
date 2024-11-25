package ru.lavrent.weblab3.util;

import java.lang.reflect.Type;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;

import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonParseException;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;

public class DateTypeAdapter implements JsonSerializer<Date>, JsonDeserializer<Date> {

  private final DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;

  @Override
  public JsonElement serialize(final Date date, final Type typeOfSrc,
      final JsonSerializationContext context) {
    return new JsonPrimitive(formatter.format(date.toInstant()));
  }

  @Override
  public Date deserialize(final JsonElement json, final Type typeOfT,
      final JsonDeserializationContext context) throws JsonParseException {
    OffsetDateTime dateTime = OffsetDateTime.parse(json.getAsString(), formatter);
    Instant asInstant = dateTime.toInstant();
    return Date.from(asInstant);
  }
}