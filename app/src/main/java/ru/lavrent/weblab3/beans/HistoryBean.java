package ru.lavrent.weblab3.beans;

import java.io.Serializable;
import java.util.List;

import com.google.gson.Gson;

import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Named;
import ru.lavrent.weblab3.dao.RecordDao;
import ru.lavrent.weblab3.models.Record;

@Named("historyBean")
@ApplicationScoped
public class HistoryBean implements Serializable {

  private List<Record> records;

  @PostConstruct
  public void initialize() {
    updateLocal();
  }

  public void updateLocal() {
    System.out.println("Updating local");
    records = RecordDao.getAll();
    for (Record record : records) {
      System.out.println("x: " + record.getX() + ", y: " + record.getY() + ", r: " + record.getR() + ", result: "
          + record.getHitString());
    }
  }

  public List<Record> getRecords() {
    return records;
  }

  public String getRecordsJson() {
    Gson gson = new Gson();
    return gson.toJson(records);
  }

  public String clearHistory() {
    System.out.println("Clearing history");
    RecordDao.deleteAll();
    updateLocal();
    return null;
  }

  public String getTimeZone() {
    return java.time.ZoneId.systemDefault().toString();
  }
}
