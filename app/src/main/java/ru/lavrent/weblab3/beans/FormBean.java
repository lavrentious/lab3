package ru.lavrent.weblab3.beans;

import java.io.Serializable;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.inject.Named;
import ru.lavrent.weblab3.dao.RecordDao;
import ru.lavrent.weblab3.models.Record;
import ru.lavrent.weblab3.util.Validator;

@Named("formBean")
@ApplicationScoped
public class FormBean implements Serializable {
  @Inject
  private HistoryBean historyBean;

  public HistoryBean getHistoryBean() {
    return historyBean;
  }

  public void setHistoryBean(HistoryBean historyBean) {
    this.historyBean = historyBean;
  }

  private Float x;
  private String y;
  private Float r;

  private String hiddenX;
  private String hiddenY;

  public String getHiddenX() {
    return hiddenX;
  }

  public String getHiddenY() {
    return hiddenY;
  }

  public void setHiddenX(String hiddenX) {
    System.out.println("HIDDEN X: " + hiddenX);
    this.hiddenX = hiddenX;
  }

  public void setHiddenY(String hiddenY) {
    System.out.println("HIDDEN Y: " + hiddenY);
    this.hiddenY = hiddenY;
  }

  public List<Float> getXValues() {
    return Arrays.asList(-4f, -3f, -2f, -1f, 0f, 1f, 2f, 3f, 4f);
  }

  public List<Float> getRValues() {
    return Arrays.asList(1f, 1.5f, 2f, 2.5f, 3f);
  }

  public String submit() {
    System.out.println("Adding record");
    System.out.println("x: " + this.getX() + ", y: " + this.getY() + ", r: " + this.getR());
    Validator.validate(this.getX(), this.getY(), this.getR());
    Record record = new Record(this.getX(), Float.parseFloat(this.getY()), this.getR(), new Date());
    RecordDao.save(record);
    this.setX(null);
    this.setY(null);
    historyBean.updateLocal();

    // UIViewRoot view = FacesContext.getCurrentInstance().getViewRoot();
    // return view.getViewId() + "?faces-redirect=true";
    return null;
  }

  public String submitHidden() {
    System.out.println("HIDDEN Adding record");
    System.out.println("x: " + this.getHiddenX() + ", y: " + this.getHiddenY() + ", r: " + this.getR());
    Record record = new Record(Float.parseFloat(this.getHiddenX()), Float.parseFloat(this.getHiddenY()),
        this.getR(), new Date());
    RecordDao.save(record);
    this.setX(null);
    this.setY(null);
    historyBean.updateLocal();

    // UIViewRoot view = FacesContext.getCurrentInstance().getViewRoot();
    // return view.getViewId() + "?faces-redirect=true";
    return null;
  }

  public Float getX() {
    return x;
  }

  public void setX(Float x) {
    this.x = x;
  }

  public String getY() {
    return y;
  }

  public void setY(String y) {
    this.y = y;
  }

  public Float getR() {
    return r;
  }

  public void setR(Float r) {
    this.r = r;
  }
}
