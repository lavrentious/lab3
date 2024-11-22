package ru.lavrent.weblab3.beans;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.inject.Named;
import ru.lavrent.weblab3.dao.RecordDao;
import ru.lavrent.weblab3.models.Record;
import ru.lavrent.weblab3.util.Validator;

@Named("historyBean")
@ApplicationScoped
public class HistoryBean implements Serializable {
  @Inject
  private FormBean formBean;

  private List<Record> records;

  @PostConstruct
  public void initialize() {
    updateLocal();
  }

  private void updateLocal() {
    System.out.println("Updating local");
    records = RecordDao.getAll();
    for (Record record : records) {
      System.out.println("x: " + record.getX() + ", y: " + record.getY() + ", r: " + record.getR() + ", result: "
          + record.getHitString());
    }
  }

  public void addRecord() {
    System.out.println("Adding record");
    Validator.validate(formBean.getX(), formBean.getY(), formBean.getR());
    Record record = new Record(formBean.getX(), formBean.getY(), formBean.getR(), LocalDateTime.now());
    RecordDao.save(record);
    updateLocal();
  }

  public List<Record> getRecords() {
    System.out.println("Getting records");
    return records;
  }

  public void clearHistory() {
    System.out.println("Clearing history");
    RecordDao.deleteAll();
    updateLocal();
  }

  public FormBean getFormBean() {
    return formBean;
  }

  // setter must be present or managed property won't work
  public void setFormBean(FormBean formBean) {
    this.formBean = formBean;
  }
}
