package ru.lavrent.weblab3.beans;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Arrays;
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

  private Integer x;
  private String y;
  private Float r;

  public List<Integer> getXValues() {
    return Arrays.asList(-4, -3, -2, -1, 0, 1, 2, 3, 4);
  }

  public List<Float> getRValues() {
    return Arrays.asList(1f, 1.5f, 2f, 2.5f, 3f);
  }

  public String submit() {
    System.out.println("Adding record");
    Validator.validate(this.getX(), this.getY(), this.getR());
    Record record = new Record(this.getX(), Float.parseFloat(this.getY()), this.getR(), LocalDateTime.now());
    RecordDao.save(record);
    this.setX(null);
    this.setY(null);
    this.setR(null);
    historyBean.updateLocal();

    // UIViewRoot view = FacesContext.getCurrentInstance().getViewRoot();
    // return view.getViewId() + "?faces-redirect=true";
    return null;
  }

  public Integer getX() {
    return x;
  }

  public void setX(Integer x) {
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
