package ru.lavrent.weblab3.util;

import io.github.cdimascio.dotenv.Dotenv;
import ru.lavrent.weblab3.interfaces.IConfig;

public class EnvConfig implements IConfig {
  private static EnvConfig instance;
  private String dbUrl;
  private String dbUser;
  private String dbPassword;

  private EnvConfig() {
    onLoad();
    validate();
  }

  public static EnvConfig getInstance() {
    if (instance == null) {
      instance = new EnvConfig();
    }
    return instance;
  }

  @Override
  public void onLoad() {
    System.out.println("Loading config from .env");
    System.out.println(System.getProperty("user.dir"));
    String envPath = System.getenv("ENV_PATH");
    Dotenv dotenv = Dotenv.configure().filename(envPath != null ? envPath : ".env")
        .load();
    this.dbUrl = dotenv.get("DB_URL");
    this.dbUser = dotenv.get("DB_USER");
    this.dbPassword = dotenv.get("DB_PASSWORD");
  }

  // System.exit if config is invalid
  @Override
  public void validate() {
    // placeholder
  }

  public String getDbUrl() {
    return dbUrl;
  }

  public String getDbPassword() {
    return dbPassword;
  }

  public String getDbUser() {
    return dbUser;
  }
}
