# LocalShopSystem
<div align="center">

![LocalShopSystem Logo](/web/images/icon.ico)

</div>

**LocalShopSystem** es una aplicación de gestión de compras para mercados, diseñada para funcionar como un sistema de cajas registradoras. Este proyecto ha sido desarrollado en **Java** utilizando un conjunto de tecnologías modernas como **Hibernate**, **Spring Boot**, **Spring Data** y **Tomcat** para el despliegue. La interfaz web ha sido creada con **JavaScript**, y la base de datos se gestiona con **MySQL**.

## 🛠 Tecnologías Utilizadas

- **Java**: Lenguaje de programación principal.
- **Spring Boot**: Framework para simplificar el desarrollo de aplicaciones Java.
- **Spring Data**: Facilita el acceso a los datos mediante la implementación del patrón Repository.
- **Hibernate**: Framework de mapeo objeto-relacional (ORM) para interactuar con la base de datos.
- **Tomcat**: Servidor web para el despliegue de la aplicación.
- **JavaScript (JS)**: Utilizado para la creación de la página web y la interacción del usuario.
- **MySQL**: Sistema de gestión de bases de datos relacional.


## 🚀 Despliegue

Para desplegar el proyecto, asegúrate de contar con un entorno adecuado con **Java**, **Maven**, **MySQL** y **Tomcat** configurados.

## 📊 Funcionalidades

- **Gestión de Productos**: Añadir, editar y eliminar productos.
- **Registro de Ventas**: Registro de ventas con cálculo automático de totales.
- **Reportes**: Generación de reportes de ventas.

## 🌐 Interfaz Web


La interfaz web ha sido desarrollada con **JavaScript** y permite una experiencia de usuario amigable y rápida. Las transacciones se registran en tiempo real, proporcionando feedback instantáneo a los usuarios.

## 📄 Modelo de Datos

La base de datos MySQL se compone de las siguientes tablas principales:

- **Productos**: Información sobre los productos disponibles en el mercado.
- **Ventas**: Registros de las transacciones de ventas.


## 📁 Estructura del Proyecto

El proyecto sigue una arquitectura de **Modelo-Servicio-Controlador (MVC)**:

```shell
/src
 └── main
  └── java
   └── es
    └── jonay
     └── kb
      └── shopsystem
       ├── api
        │ ├── config
         # Configuración de la API
        │ ├── dto # Objetos de transferencia de datos
        │ └── mappers # Mapeadores de datos
        ├── controller # Controladores de la aplicación
        ├── model 
        │ ├── entities # Entidades del modelo de datos
        │ └── repository # Repositorios para el acceso a datos
        └── services 
          ├── CategoryService.java # Servicio para categorías 
          ├── ItemService.java # Servicio para ítems 
          ├── TradeService.java # Servicio para transacciones 
          ├── ServletInitializer.java # Inicializador del Servlet 
          └── ShopsystemApplication.java # Clase principal de la aplicación
```

## 📧 Contacto

Para cualquier consulta o sugerencia, puedes contactar a los desarrolladores en:

- **Correo**: jonaykb@gmail.com.com
- **GitHub**: [JonayKB](https://github.com/jonaykb)

---
