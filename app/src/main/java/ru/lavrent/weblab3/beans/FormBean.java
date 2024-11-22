package ru.lavrent.weblab3.beans;

import java.io.Serializable;
import java.util.Arrays;
import java.util.List;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Named;

@Named("formBean")
@ApplicationScoped
public class FormBean implements Serializable {
  private int x;
  private float y;
  private float r;

  public List<Integer> getXValues() {
    return Arrays.asList(-4, -3, -2, -1, 0, 1, 2, 3, 4);
  }

  public List<Float> getRValues() {
    return Arrays.asList(1f, 1.5f, 2f, 2.5f, 3f);
  }

  public int getX() {
    return x;
  }

  public void setX(int x) {
    this.x = x;
  }

  public float getY() {
    return y;
  }

  public void setY(float y) {
    this.y = y;
  }

  public float getR() {
    return r;
  }

  public void setR(float r) {
    this.r = r;
  }
}
