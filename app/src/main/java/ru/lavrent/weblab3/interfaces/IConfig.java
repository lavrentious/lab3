package ru.lavrent.weblab3.interfaces;

import ru.lavrent.weblab3.exceptions.InvalidConfigException;

public interface IConfig {
  public void onLoad();

  public void validate() throws InvalidConfigException;
}
