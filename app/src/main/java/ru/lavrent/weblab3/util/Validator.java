package ru.lavrent.weblab3.util;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

import ru.lavrent.weblab3.exceptions.ValidationException;

public class Validator {
  public static final Set<Float> rValues = new HashSet<>(Arrays.asList(1f, 1.5f, 2f, 2.5f, 3f));

  public static void validate(Float x, String y, Float r) {
    if (!(-4 <= x && x <= 4)) {
      throw new ValidationException("x must be between -4 and 4: %f".formatted(x));
    }
    try {
      Float.parseFloat(y);
    } catch (NumberFormatException e) {
      throw new ValidationException("y must be a float");
    }
    if (!(-5 <= Float.parseFloat(y) && Float.parseFloat(y) <= 5)) {
      throw new ValidationException("y must be between -5 and 5: %f".formatted(y));
    }
    if (!rValues.contains(r)) {
      throw new ValidationException(
          "r must be in set " + rValues.stream()
              .map(String::valueOf)
              .collect(Collectors.joining(", ")));
    }
  }
}
