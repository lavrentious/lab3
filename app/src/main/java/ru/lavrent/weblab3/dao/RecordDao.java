package ru.lavrent.weblab3.dao;

import java.util.List;

import jakarta.persistence.EntityManager;
import ru.lavrent.weblab3.models.Record;
import ru.lavrent.weblab3.util.DBService;

public abstract class RecordDao {
  public static void save(Record record) {
    EntityManager em = DBService.getInstance().getEntityManager();
    em.getTransaction().begin();
    em.persist(record);
    em.getTransaction().commit();
  }

  public static List<Record> getAll() {
    EntityManager em = DBService.getInstance().getEntityManager();
    return em.createQuery("SELECT r FROM Record r", Record.class).getResultList();
  }

  public static void deleteAll() {
    EntityManager em = DBService.getInstance().getEntityManager();
    em.getTransaction().begin();
    em.createQuery("DELETE FROM Record").executeUpdate();
    em.getTransaction().commit();
  }
}
