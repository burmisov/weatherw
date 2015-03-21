Погодный виджет
===============

Демо: [http://weatherw.herokuapp.com](http://weatherw.herokuapp.com)

Установка и запуск:
```sh
git clone https://github.com/burmisov/weatherw.git
npm install
node index
```

Далее открыть [localhost:4000](http://localhost:4000)

Настройки - через переменные окружения. По умолчанию:
* `WEATHERW_REDIS_HOST` - 127.0.0.1
* `WEATHERW_REDIS_PORT` - 6379
* `WEATHERW_REDIS_PASS` - ""
* `WEATHERW_WIDGET_BASE_URL` - http://localhost:4000/widget

#TODO:
* Нормальный стилизованный интерфейс для настройки виджета
* Отображение виджета на 3 и 7 дней (почти готово)
* Сделать для любого города
* Сделать статистику по попаданиям в кэш
* Можно разделить на разные сервисы: 1. API данных, 2. Веб-сервер, 3. Сервис обновления данных
