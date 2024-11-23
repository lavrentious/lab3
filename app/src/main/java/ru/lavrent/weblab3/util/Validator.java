package ru.lavrent.weblab3.util;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

import ru.lavrent.weblab3.exceptions.ValidationException;

public class Validator {
  public static final Set<Integer> xValues = new HashSet<>(Arrays.asList(-4, -3, -2, -1, 0, 1, 2, 3, 4));
  public static final Set<Float> rValues = new HashSet<>(Arrays.asList(1f, 1.5f, 2f, 2.5f, 3f));

  public static void validate(Integer x, String y, Float r) {
    if (!xValues.contains(x)) {
      throw new ValidationException(
          "x must be in set " + xValues.stream()
              .map(String::valueOf)
              .collect(Collectors.joining(", ")));
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
