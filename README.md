# Бэкенд чать проекта для Веб-приложения списка задач (TODO list).

Ссылка на репозиторий фронтенд части проекта **[GitHub](https://github.com/Shoomec74/e_soft_front)**

## Обзор

Проект представляет собой API и хранение информаци о пользователях и их задачах в базе данных Postgres, предназначенное для помощи пользователям в планировании их активностей и управлении работой их подчинённых через систему управления задачами. Это позволяет создавать, обновлять и отслеживать задачи, обеспечивая эффективный способ организации рабочих нагрузок и сроков. Выполнено в рамках тестового задания от компании E-Soft.

Проект настроен с использованием следующих технологий:

- __NEST__ для API
- __JWT__ авторизация с контрлем чернотго списка токенов и обновления токена по Redresh токену
- __TYPE ORM__ для управления базой данных в данном проекте Postgres
- __CASL__ для управления правами доступа

---

## Запуск проекта

### Для начала работы с проектом выполните следующие шаги:

**Шаг 1. Склонируйте репозиторий**

Клонируйте репозиторий на ваш локальный компьютер.
```
git clone https://github.com/Shoomec74/e_soft_front.git
```

**Шаг 2. Создайте .env в корне проекта.**

Примеры значений переменных можно увидеть в .env.example.

```yaml
# === Для работы приложения ===
APP_PORT=                                  # Порт, на котором будет слушать ваше приложение.
GLOBAL_PREFIX=                             # Глобальный префикс для всех маршрутов приложения.
LOGIN_SUPERADMIN=                          # Логин суперадмина приложения.
PASSWORD_SUPERADMIN=                       # Пароль суперадмина.
JWT_EXPIRES=                               # Время жизни JWT.
REFRESHTOKEN_EXPIRESIN=                    # Время жизни токена обновления.
JWT_SECRET=                                # Секретный ключ для JWT (JSON Web Tokens).

# === Для базы данных ===
DB_TYPE=                                   # Тип базы данных.
DB_HOST=                                   # Хост базы данных.
DB_PORT=                                   # Порт для подключения к базе данных.
DB_USERNAME=                               # Имя пользователя для подключения к базе данных.
DB_PASSWORD=                               # Пароль для подключения к базе данных.
DB_NAME=                                   # Имя базы данных.
```
**Шаг 3. Установите зависимости проекта.**
Установите зависимости, используя
```
npm install
```
или
```
yarn install
```

**Шаг 4. Запустите проект.**
Запустите проект в режиме разработки, используя команды. Это автоматически откроет приложение в вашем браузере.
```
npm run start:dev
```
или
```
yarn start:dev
```

***

## Ручки для тестирования бэка в Postman
### Скопируйте JSON объект и импортируйте в Postman
````json
  {
    "info": {
      "_postman_id": "ad2e511d-58b3-40df-8f98-9610b6ee38ca",
      "name": "E_Soft_task",
      "description": "# 🚀 Get started here\n\nThis template guides you through CRUD operations (GET, POST, PUT, DELETE), variables, and tests.\n\n## 🔖 **How to use this template**\n\n#### **Step 1: Send requests**\n\nRESTful APIs allow you to perform CRUD operations using the POST, GET, PUT, and DELETE HTTP methods.\n\nThis collection contains each of these [request](https://learning.postman.com/docs/sending-requests/requests/) types. Open each request and click \"Send\" to see what happens.\n\n#### **Step 2: View responses**\n\nObserve the response tab for status code (200 OK), response time, and size.\n\n#### **Step 3: Send new Body data**\n\nUpdate or add new data in \"Body\" in the POST request. Typically, Body data is also used in PUT request.\n\n```\n{\n    \"name\": \"Add your name in the body\"\n}\n\n ```\n\n#### **Step 4: Update the variable**\n\nVariables enable you to store and reuse values in Postman. We have created a [variable](https://learning.postman.com/docs/sending-requests/variables/) called `base_url` with the sample request [https://postman-api-learner.glitch.me](https://postman-api-learner.glitch.me). Replace it with your API endpoint to customize this collection.\n\n#### **Step 5: Add tests in the \"Tests\" tab**\n\nTests help you confirm that your API is working as expected. You can write test scripts in JavaScript and view the output in the \"Test Results\" tab.\n\n<img src=\"https://content.pstmn.io/b5f280a7-4b09-48ec-857f-0a7ed99d7ef8/U2NyZWVuc2hvdCAyMDIzLTAzLTI3IGF0IDkuNDcuMjggUE0ucG5n\">\n\n## 💪 Pro tips\n\n- Use folders to group related requests and organize the collection.\n- Add more [scripts](https://learning.postman.com/docs/writing-scripts/intro-to-scripts/) in \"Tests\" to verify if the API works as expected and execute workflows.\n    \n\n## 💡Related templates\n\n[API testing basics](https://go.postman.co/redirect/workspace?type=personal&collectionTemplateId=e9a37a28-055b-49cd-8c7e-97494a21eb54&sourceTemplateId=ddb19591-3097-41cf-82af-c84273e56719)  \n[API documentation](https://go.postman.co/redirect/workspace?type=personal&collectionTemplateId=e9c28f47-1253-44af-a2f3-20dce4da1f18&sourceTemplateId=ddb19591-3097-41cf-82af-c84273e56719)  \n[Authorization methods](https://go.postman.co/redirect/workspace?type=personal&collectionTemplateId=31a9a6ed-4cdf-4ced-984c-d12c9aec1c27&sourceTemplateId=ddb19591-3097-41cf-82af-c84273e56719)",
      "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
      "_exporter_id": "27287651"
    },
    "item": [
      {
        "name": "auth",
        "item": [
          {
            "name": "Logout",
            "event": [
              {
                "listen": "test",
                "script": {
                  "exec": [
                    "pm.test(\"Status code is 200\", function () {",
                    "    pm.response.to.have.status(200);",
                    "});"
                  ],
                  "type": "text/javascript",
                  "packages": {}
                }
              }
            ],
            "request": {
              "method": "GET",
              "header": [],
              "url": {
                "raw": "http://localhost:3000/api/logout",
                "protocol": "http",
                "host": ["localhost"],
                "port": "3000",
                "path": ["api", "logout"]
              },
              "description": "This is a GET request and it is used to \"get\" data from an endpoint. There is no request body for a GET request, but you can use query parameters to help specify the resource you want data on (e.g., in this request, we have `id=1`).\n\nA successful GET response will have a `200 OK` status, and should include some kind of response body - for example, HTML web content or JSON data."
            },
            "response": []
          },
          {
            "name": "Signin",
            "event": [
              {
                "listen": "test",
                "script": {
                  "exec": [
                    "pm.test(\"Successful POST request\", function () {",
                    "    pm.expect(pm.response.code).to.be.oneOf([200, 201]);",
                    "});",
                    ""
                  ],
                  "type": "text/javascript",
                  "packages": {}
                }
              }
            ],
            "request": {
              "method": "POST",
              "header": [],
              "body": {
                "mode": "raw",
                "raw": "{\n\t\"login\": \"superAdmin\",\n    \"password\": \"superSecurePassword\"\n}",
                "options": {
                  "raw": {
                    "language": "json"
                  }
                }
              },
              "url": {
                "raw": "http://localhost:3000/api/auth/signin",
                "protocol": "http",
                "host": ["localhost"],
                "port": "3000",
                "path": ["api", "auth", "signin"]
              },
              "description": "This is a POST request, submitting data to an API via the request body. This request submits JSON data, and the data is reflected in the response.\n\nA successful POST request typically returns a `200 OK` or `201 Created` response code."
            },
            "response": []
          },
          {
            "name": "Refresh token",
            "request": {
              "method": "GET",
              "header": []
            },
            "response": []
          }
        ]
      },
      {
        "name": "users",
        "item": [
          {
            "name": "Get all users",
            "event": [
              {
                "listen": "test",
                "script": {
                  "exec": [
                    "pm.test(\"Status code is 200\", function () {",
                    "    pm.response.to.have.status(200);",
                    "});"
                  ],
                  "type": "text/javascript",
                  "packages": {}
                }
              }
            ],
            "request": {
              "method": "GET",
              "header": [],
              "url": {
                "raw": "http://localhost:3000/api/users",
                "protocol": "http",
                "host": ["localhost"],
                "port": "3000",
                "path": ["api", "users"]
              },
              "description": "This is a GET request and it is used to \"get\" data from an endpoint. There is no request body for a GET request, but you can use query parameters to help specify the resource you want data on (e.g., in this request, we have `id=1`).\n\nA successful GET response will have a `200 OK` status, and should include some kind of response body - for example, HTML web content or JSON data."
            },
            "response": []
          },
          {
            "name": "Register user",
            "event": [
              {
                "listen": "test",
                "script": {
                  "exec": [
                    "pm.test(\"Successful POST request\", function () {",
                    "    pm.expect(pm.response.code).to.be.oneOf([200, 201]);",
                    "});",
                    ""
                  ],
                  "type": "text/javascript",
                  "packages": {}
                }
              }
            ],
            "request": {
              "method": "POST",
              "header": [],
              "body": {
                "mode": "raw",
                "raw": "{\n\t\"login\": \"shoomec@yandex.ru\",\n    \"password\": \"qwerty1234\",\n    \"firstName\": \"Женя\",\n    \"lastName\": \"Русаков\",\n    \"middleName\": \"Владимирович\"\n}",
                "options": {
                  "raw": {
                    "language": "json"
                  }
                }
              },
              "url": {
                "raw": "http://localhost:3000/api/users",
                "protocol": "http",
                "host": ["localhost"],
                "port": "3000",
                "path": ["api", "users"]
              },
              "description": "This is a POST request, submitting data to an API via the request body. This request submits JSON data, and the data is reflected in the response.\n\nA successful POST request typically returns a `200 OK` or `201 Created` response code."
            },
            "response": []
          },
          {
            "name": "Delete data",
            "event": [
              {
                "listen": "test",
                "script": {
                  "exec": [
                    "pm.test(\"Successful DELETE request\", function () {",
                    "    pm.expect(pm.response.code).to.be.oneOf([200, 202, 204]);",
                    "});",
                    ""
                  ],
                  "type": "text/javascript",
                  "packages": {}
                }
              }
            ],
            "request": {
              "method": "DELETE",
              "header": [],
              "body": {
                "mode": "raw",
                "raw": "",
                "options": {
                  "raw": {
                    "language": "json"
                  }
                }
              },
              "url": {
                "raw": "http://localhost:3000/api/users/5",
                "protocol": "http",
                "host": ["localhost"],
                "port": "3000",
                "path": ["api", "users", "5"]
              },
              "description": "This is a DELETE request, and it is used to delete data that was previously created via a POST request. You typically identify the entity being updated by including an identifier in the URL (eg. `id=1`).\n\nA successful DELETE request typically returns a `200 OK`, `202 Accepted`, or `204 No Content` response code."
            },
            "response": []
          },
          {
            "name": "Update user",
            "request": {
              "method": "PATCH",
              "header": [],
              "body": {
                "mode": "raw",
                "raw": "{\r\n\t\"login\": \"shoomec1212@yandex.ru\",\r\n    \"password\": \"superSecurePassword\",\r\n    \"firstName\": \"Женя\",\r\n    \"lastName\": \"Русаков\",\r\n    \"middleName\": \"Владимирович\"\r\n}",
                "options": {
                  "raw": {
                    "language": "json"
                  }
                }
              },
              "url": {
                "raw": "http://localhost:3000/api/users/8",
                "protocol": "http",
                "host": ["localhost"],
                "port": "3000",
                "path": ["api", "users", "8"]
              }
            },
            "response": []
          },
          {
            "name": "UserInfo",
            "request": {
              "method": "GET",
              "header": []
            },
            "response": []
          }
        ]
      },
      {
        "name": "tasks",
        "item": [
          {
            "name": "Add task",
            "event": [
              {
                "listen": "prerequest",
                "script": {
                  "exec": [
                    "// Получаем текущую дату и время\r",
                    "const now = new Date();\r",
                    "\r",
                    "// Форматируем дату и время в формат ISO с часовым поясом UTC\r",
                    "const formattedTime = now.toISOString();\r",
                    "\r",
                    "// Устанавливаем переменные окружения\r",
                    "pm.environment.set(\"currentDate\", formattedTime);"
                  ],
                  "type": "text/javascript",
                  "packages": {}
                }
              }
            ],
            "request": {
              "method": "POST",
              "header": [],
              "body": {
                "mode": "raw",
                "raw": "{\r\n    \"title\": \"Новая таска\",\r\n    \"description\": \"Это тестовая таска для себя\",\r\n    \"deadline\": \"{{currentDate}}\",\r\n    \"priority\": \"low\"\r\n}",
                "options": {
                  "raw": {
                    "language": "json"
                  }
                }
              },
              "url": {
                "raw": "http://localhost:3000/api/tasks",
                "protocol": "http",
                "host": ["localhost"],
                "port": "3000",
                "path": ["api", "tasks"]
              }
            },
            "response": []
          },
          {
            "name": "Get all tasks",
            "request": {
              "method": "GET",
              "header": []
            },
            "response": []
          },
          {
            "name": "Update task",
            "event": [
              {
                "listen": "prerequest",
                "script": {
                  "exec": [
                    "// Получаем текущую дату и время\r",
                    "const now = new Date();\r",
                    "\r",
                    "// Форматируем дату и время в формат ISO с часовым поясом UTC\r",
                    "const formattedTime = now.toISOString();\r",
                    "\r",
                    "// Устанавливаем переменные окружения\r",
                    "pm.environment.set(\"currentDate\", formattedTime);"
                  ],
                  "type": "text/javascript",
                  "packages": {}
                }
              }
            ],
            "request": {
              "method": "PATCH",
              "header": [],
              "body": {
                "mode": "raw",
                "raw": "{\r\n    \"title\": \"Поменяли таску\",\r\n    \"description\": \"Это тестовая таска для себя\",\r\n    \"deadline\": \"{{currentDate}}\",\r\n    \"priority\": \"low\",\r\n    \"status\": \"in_progress\"\r\n}",
                "options": {
                  "raw": {
                    "language": "json"
                  }
                }
              },
              "url": {
                "raw": "http://localhost:3000/api/tasks/1",
                "protocol": "http",
                "host": ["localhost"],
                "port": "3000",
                "path": ["api", "tasks", "1"]
              }
            },
            "response": []
          }
        ]
      }
    ],
    "auth": {
      "type": "bearer",
      "bearer": [
        {
          "key": "token",
          "value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImp0aSI6ImZiMWZkNDE5MjgzYjU4NDQ1ZmMwMzU2N2YzN2Q2NTQ5IiwidHlwZSI6ImFjY2VzcyIsImlhdCI6MTcxMTMwOTk3NSwiZXhwIjoxNzExMzExNzc1fQ.okpsc9pyVhPdFg1GJq38HMh0EuGlCmdPkKA1BZnMiwo",
          "type": "string"
        }
      ]
    },
    "event": [
      {
        "listen": "prerequest",
        "script": {
          "type": "text/javascript",
          "exec": [""]
        }
      },
      {
        "listen": "test",
        "script": {
          "type": "text/javascript",
          "exec": [""]
        }
      }
    ],
    "variable": [
      {
        "key": "id",
        "value": "1"
      },
      {
        "key": "base_url",
        "value": "https://postman-rest-api-learner.glitch.me/"
      }
    ]
  }
````
