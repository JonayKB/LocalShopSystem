# LocalShopSystem
<div align="center">

![LocalShopSystem Logo](/web/images/icon.ico)

</div>

**LocalShopSystem** is a shopping management application for markets, designed to function as a cash register system. This project has been developed in **Java** using a set of modern technologies such as **Hibernate**, **Spring Boot**, **Spring Data**, and **Tomcat** for deployment. The web interface has been created using **JavaScript**, and the database is managed with **MySQL**.

## 🛠 Technologies Used

- **Java**: Main programming language.
- **Spring Boot**: Framework to simplify Java application development.
- **Spring Data**: Facilitates data access through the Repository pattern.
- **Hibernate**: Object-relational mapping (ORM) framework to interact with the database.
- **Tomcat**: Web server for application deployment.
- **JavaScript (JS)**: Used to create the webpage and user interactions.
- **MySQL**: Relational database management system.

## 🚀 Deployment

To deploy the project, make sure to have a suitable environment with **Java**, **Maven**, **MySQL**, and **Tomcat** configured.

## 📊 Features

- **Product Management**: Add, edit, and delete products.
- **Sales Registration**: Sales registration with automatic total calculations.
- **Reports**: Generate sales reports.

## 🌐 Web Interface

The web interface has been developed using **JavaScript**, providing a fast and user-friendly experience. Transactions are recorded in real-time, offering instant feedback to users.

## 📄 Data Model

The MySQL database is composed of the following main tables:

- **Products**: Information about the products available in the market.
- **Sales**: Records of sales transactions.

## 📁 Project Structure

The project follows a **Model-Service-Controller (MVC)** architecture:

```shell
/src
 └── main
  └── java
   └── es
    └── jonay
     └── kb
      └── shopsystem
       ├── api
        │ ├── config # API configuration
        │ ├── dto # Data Transfer Objects
        │ └── mappers # Data Mappers
        ├── controller # Application Controllers
        ├── model 
        │ ├── entities # Data Model Entities
        │ └── repository # Data Access Repositories
        └── services 
          ├── CategoryService.java # Service for categories 
          ├── ItemService.java # Service for items 
          ├── TradeService.java # Service for transactions 
          ├── ServletInitializer.java # Servlet Initializer 
          └── ShopsystemApplication.java # Main application class
```

## 📧 Contact

For any inquiries or suggestions, feel free to reach out to the developers at:

- **Email**: jonaykb@gmail.com
- **GitHub**: [JonayKB](https://github.com/jonaykb)

---
