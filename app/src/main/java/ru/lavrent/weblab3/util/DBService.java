package ru.lavrent.weblab3.util;

import java.util.HashMap;
import java.util.Map;
import static org.eclipse.persistence.config.PersistenceUnitProperties.*;
import org.eclipse.persistence.config.TargetServer;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;
import jakarta.persistence.spi.PersistenceUnitTransactionType;

public class DBService {
  private static DBService instance;
  private EntityManager entityManager;

  private DBService() {
    try {
      Class.forName("org.postgresql.Driver");
    } catch (ClassNotFoundException e) {
      e.printStackTrace();
    }

    EntityManagerFactory emf = Persistence.createEntityManagerFactory("MainPU", this.getProperties());
    this.entityManager = emf.createEntityManager();
  }

  public EntityManager getEntityManager() {
    return entityManager;
  }

  public Map<String, String> getProperties() {
    EnvConfig envConfig = EnvConfig.getInstance();
    HashMap<String, String> properties = new HashMap<>();

    properties.put(DDL_GENERATION, "create-tables");
    // Ensure RESOURCE_LOCAL transactions is used.
    properties.put(TRANSACTION_TYPE,
        PersistenceUnitTransactionType.RESOURCE_LOCAL.name());

    // Configure the internal EclipseLink connection pool
    properties.put(JDBC_DRIVER, "org.postgresql.Driver");
    properties.put(JDBC_URL, envConfig.getDbUrl());
    properties.put(JDBC_USER, envConfig.getDbUser());
    properties.put(JDBC_PASSWORD, envConfig.getDbPassword());

    // Configure logging. FINE ensures all SQL is shown
    properties.put(LOGGING_LEVEL, "FINE");
    properties.put(LOGGING_TIMESTAMP, "false");
    properties.put(LOGGING_THREAD, "false");
    properties.put(LOGGING_SESSION, "false");

    // Ensure that no server-platform is configured
    properties.put(TARGET_SERVER, TargetServer.None);

    return properties;
  }

  public static DBService getInstance() {
    if (instance == null) {
      instance = new DBService();
    }
    return instance;
  }

  // public static void main(String[] args) {

  // try {
  // Class.forName("org.postgresql.Driver");

  // EntityManagerFactory emf = Persistence.createEntityManagerFactory("MainPU",
  // properties);
  // EntityManager em = emf.createEntityManager();

  // // register the entity classes

  // emf.getMetamodel().getEntities().forEach(e -> {
  // System.out.println("Entity: " + e.getName());
  // });

  // Record record = new Record();
  // record.setCreatedAt(LocalDateTime.now());
  // record.setX(1.0f);
  // record.setY(-2.0f);
  // record.setR(33.0f);
  // record.setHit(true);
  // record.setScriptTimeMs(1L);

  // em.getTransaction().begin();
  // em.persist(record);
  // em.getTransaction().commit();
  // } catch (Exception e) {
  // System.out.println(e.getMessage());
  // }
  // }
}
