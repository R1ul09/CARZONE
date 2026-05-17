-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: carzone
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
INSERT INTO `cache` VALUES ('laravel-cache-raul@example.com|127.0.0.1','i:2;',1778431449),('laravel-cache-raul@example.com|127.0.0.1:timer','i:1778431449;',1778431449),('laravel-cache-zalduaraul05@gmail.com|127.0.0.1','i:1;',1778438053),('laravel-cache-zalduaraul05@gmail.com|127.0.0.1:timer','i:1778438053;',1778438053);
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `citas`
--

DROP TABLE IF EXISTS `citas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `citas` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `servicio_id` bigint unsigned NOT NULL,
  `coche_id` bigint unsigned DEFAULT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `estado` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pendiente',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `citas_user_id_foreign` (`user_id`),
  KEY `citas_servicio_id_foreign` (`servicio_id`),
  KEY `citas_coche_id_foreign` (`coche_id`),
  CONSTRAINT `citas_coche_id_foreign` FOREIGN KEY (`coche_id`) REFERENCES `coches` (`id`) ON DELETE CASCADE,
  CONSTRAINT `citas_servicio_id_foreign` FOREIGN KEY (`servicio_id`) REFERENCES `servicios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `citas_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `citas`
--

LOCK TABLES `citas` WRITE;
/*!40000 ALTER TABLE `citas` DISABLE KEYS */;
INSERT INTO `citas` VALUES (5,2,1,37,'2026-05-15','16:30:00','pendiente','2026-05-11 11:21:42','2026-05-11 11:21:42');
/*!40000 ALTER TABLE `citas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coches`
--

DROP TABLE IF EXISTS `coches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coches` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `modelo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `anio` int NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `marca_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `potencia` int DEFAULT NULL,
  `par_motor` int DEFAULT NULL,
  `velocidad_max` int DEFAULT NULL,
  `aceleracion` decimal(3,1) DEFAULT NULL,
  `combustible` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transmision` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `traccion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `num_plazas` int DEFAULT NULL,
  `num_puertas` int DEFAULT NULL,
  `tipo_carroceria` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `color` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `disponible` tinyint(1) NOT NULL DEFAULT '1',
  `destacado` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `coches_marca_id_foreign` (`marca_id`),
  CONSTRAINT `coches_marca_id_foreign` FOREIGN KEY (`marca_id`) REFERENCES `marcas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=93 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coches`
--

LOCK TABLES `coches` WRITE;
/*!40000 ALTER TABLE `coches` DISABLE KEYS */;
INSERT INTO `coches` VALUES (25,'Lamborghini Veneno Roadster',2013,8527000.00,'El Lamborghini Veneno Roadster es un superdeportivo descapotable ultraexclusivo (9 unidades) de 2014, diseñado para un rendimiento extremo en pista pero legal en calle. Logrando 0-100 km/h en 2.9 s y 355 km/h.',4,'2026-04-11 08:54:30','2026-05-04 09:20:37',750,690,355,2.9,'Gasolina','Automática','AWD',2,2,'Cabrio','Rosso Veneno',1,1),(26,'Lamborghini Huracán Performante',2017,280000.00,'El Lamborghini Huracán Performante es una versión aligerada y potenciada del superdeportivo V10, diseñada para la máxima eficiencia en circuito. Incorpora un motor 5.2L V10 con 640 CV, alcanzando 0-100 km/h en 2,9 segundos. Destaca por su sistema de aerodinámica activa (ALA) y el uso de Forged Composites para reducir peso.',4,'2026-04-11 08:58:23','2026-05-04 09:21:39',640,600,325,2.9,'Gasolina','Automática','AWD',2,2,'Coupé','Arancio Anthaeus',1,0),(27,'Lamborghini Aventador SVJ Roadster',2019,1300000.00,'El Lamborghini Aventador SVJ Roadster es un superdeportivo descapotable de producción limitada (800 unidades) que combina un motor V12 atmosférico de 6.5 litros con 770 CV y 720 Nm de par. Acelera de 0 a 100 km/h en 2,9 segundos y supera los 350 km/h, destacando por su aerodinámica activa ALA 2.0 y techo de fibra de carbono desmontable.',4,'2026-04-11 09:00:03','2026-05-04 09:22:19',770,720,350,2.9,'Gasolina','Automática','AWD',2,2,'Cabrio','Bronzo Zenas',1,0),(28,'Lamborghini Revuelto',2023,573327.00,'El Lamborghini Revuelto es un superdeportivo híbrido enchufable (HPEV) de alto rendimiento, sucesor del Aventador, con 1.015 CV y velocidad punta superior a 350 km/h. Combina un motor V12 atmosférico de 6.5L con tres motores eléctricos, logrando una aceleración de 0 a 100 km/h en 2,5 segundos. Destaca por su diseño aerodinámico, chasis de carbono y avanzada tecnología.',4,'2026-04-11 09:02:04','2026-05-04 09:22:58',1015,725,350,2.5,'Híbrido','Automática','AWD',2,2,'Coupé','Arancio Apodis',1,0),(29,'Lamborghini Urus Performante',2022,300000.00,'El Lamborghini Urus Performante es un Super SUV enfocado en las máximas prestaciones, elevando al Urus estándar con más potencia (666 CV), menor peso gracias a la fibra de carbono y un diseño más aerodinámico. Bate récords gracias a su motor V8 biturbo, acelerando de 0 a 100 km/h en 3,3 segundos, suspensión rebajada y modos de conducción como el Rally para tierra.',4,'2026-04-11 09:03:54','2026-05-04 09:23:36',666,850,306,3.3,'Gasolina','Automática','AWD',5,4,'SUV','Giallo Auge',1,0),(30,'Lamborghini Murciélago',2001,300000.00,'El Lamborghini Murciélago es un superdeportivo V12 de alto rendimiento, fabricado entre 2001 y 2010 como el buque insignia de la marca. Destaca por su diseño agresivo con puertas de tijera, motor central, tracción total y carrocería de fibra de carbono. Ofrece potencias desde 580 CV hasta 670 CV (LP 670-4 SV), superando los 340 km/h.',4,'2026-04-11 09:05:35','2026-05-04 09:24:15',640,660,340,3.4,'Gasolina','Manual / Automática','AWD',2,2,'Coupé','Grigio Telesto',1,0),(31,'BMW M4 GT3',2021,415000.00,'El BMW M4 GT3 es un vehículo de competición de alto rendimiento diseñado para equipos cliente, basado en el BMW M4 Competition Coupé (G82). Cuenta con un motor S58 de 3.0 litros y 6 cilindros en línea TwinPower Turbo que produce hasta 590 CV. Equipado con una transmisión secuencial X-Trac de 6 velocidades, destaca por su manejo, fiabilidad y aerodinámica optimizada.',8,'2026-04-11 09:08:40','2026-05-04 09:53:47',590,700,290,3.0,'Gasolina','Secuencial','RWD',1,2,'Coupé (Competición)','BMW Motorsport Livery',1,1),(32,'BMW M4 Coupé Competition',2014,135000.00,'El BMW M4 Coupé Competition es un deportivo de alto rendimiento (G82) destacado por su motor 3.0L biturbo de 6 cilindros en línea, que genera 510 CV (375 kW) y 650 Nm de par, alcanzando los 100 km/h en 3.9 segundos. Disponible con tracción trasera o sistema M xDrive, utiliza un cambio automático Steptronic de 8 velocidades.',8,'2026-04-11 09:10:14','2026-05-04 09:54:38',510,650,250,3.9,'Gasolina','Automática','RWD / AWD',4,2,'Coupé','Sao Paulo Yellow',1,0),(33,'BMW M3 Sport Evolution',1990,300000.00,'El BMW M3 Sport Evolution (Evo III), lanzado en 1990, es la versión definitiva y más potente del M3 E30, limitada a 600 unidades para homologación de competición. Cuenta con un motor 2.5 L atmosférico de cuatro cilindros que produce 238 CV, mejoras aerodinámicas ajustables y reducción de peso.',8,'2026-04-11 09:11:56','2026-05-04 09:55:37',238,240,248,6.7,'Gasolina','Manual','RWD',4,2,'Coupé','Jet Black',1,0),(34,'BMW M3 CS',2024,177000.00,'El BMW M3 CS (2024) es una edición limitada de alto rendimiento que combina la practicidad de una berlina con un rendimiento de circuito. Incorpora un motor 3.0L biturbo de 6 cilindros en línea que entrega 550 CV y 650 Nm, tracción total M xDrive y una caja de cambios automática de 8 velocidades, logrando acelerar de 0 a 100 km/h en solo 3,4 segundos.',8,'2026-04-11 09:14:24','2026-05-04 09:56:08',550,650,302,3.4,'Gasolina','Automática','AWD',5,4,'Berlina','Signal Green',1,0),(35,'BMW M5 CS',2022,207300.00,'El BMW M5 CS (Competition Sport) es el sedán de producción más potente y rápido en la historia de BMW, lanzado como una edición limitada con un motor 4.4L V8 TwinPower Turbo que produce 635 CV y 750 Nm de par. Diseñado para el circuito y la carretera, presenta una reducción de peso de 70 kg respecto al M5 Competition, alcanzando los 100 km/h en solo 3,0 segundos.',8,'2026-04-11 09:15:43','2026-05-04 09:56:42',635,750,305,3.0,'Gasolina','Automática','AWD',4,4,'Berlina','Frozen Deep Green',1,0),(36,'BMW M2',2025,97000.00,'El BMW M2 es un deportivo compacto de altas prestaciones (G87), enfocado en la conducción pura con tracción trasera, motor L biturbo de 6 cilindros en línea que genera hasta (en versiones LCI). Disponible con caja manual o automática de 8 velocidades, ofrece una estética agresiva con techo de carbono opcional y gran agilidad.',8,'2026-04-11 09:17:23','2026-05-04 09:57:24',460,550,250,4.1,'Gasolina','Automática / Manual','RWD',4,2,'Coupé','Zandvoort Blue',1,0),(37,'McLaren Senna',2017,1700000.00,'El McLaren Senna es un hiperdeportivo enfocado en circuitos y homologado para calle, caracterizado por su enfoque radical en el bajo peso y la aerodinámica. Equipado con un motor V8 biturbo de 4.0L que genera 800 CV y 800 Nm de par, logra una relación peso-potencia excepcional gracias a su peso seco de solo 1.198 kg. Acelera de 0 a 100 km/h en 2,8 segundos y cuenta con una carga aerodinámica masiva.',9,'2026-04-11 09:20:09','2026-05-04 10:35:11',800,800,335,2.8,'Gasolina','Automática','RWD',2,2,'Coupé','Victory Grey',1,1),(38,'McLaren 765LT',2020,545000.00,'El McLaren 765LT es un superdeportivo de edición limitada enfocado en la pista, sucesor de la línea Longtail. Equipado con un motor V8 biturbo de 4.0 litros, genera y de par, logrando una aceleración de 0 a en solo 2,8 segundos. Destaca por su ligereza y aerodinámica extrema, con un peso en seco reducido de gracias al uso extensivo de fibra de carbono.',9,'2026-04-11 09:23:06','2026-05-04 10:35:37',765,800,330,2.8,'Gasolina','Automática','RWD',2,2,'Coupé','Nardo Orange',1,0),(39,'McLaren F1',1992,25000000.00,'El McLaren F1 (1992) es un superdeportivo histórico diseñado por Gordon Murray como el deportivo definitivo, destacando por su chasis de fibra de carbono, posición central del conductor para tres plazas y un motor V12 atmosférico de 6.1L que produce 627 CV. Fue el coche de producción más rápido del mundo, superando los 386 km/h, sin ayudas a la conducción.',9,'2026-04-11 09:26:10','2026-05-04 10:36:04',916,900,350,2.8,'Híbrido','Automática','RWD',2,2,'Coupé','Volcano Yellow',1,0),(40,'McLaren 720S',2018,300000.00,'El McLaren 720S es un superdeportivo biplaza de alto rendimiento, presentado en 2017, equipado con un motor 4.0L V8 biturbo que genera 720 CV y 770 Nm de par. Alcanza los 100 km/h en solo 2,8-2,9 segundos y una velocidad punta de 341 km/h.',9,'2026-04-11 09:27:20','2026-05-04 10:36:44',720,770,341,2.9,'Gasolina','Automática','RWD',2,2,'Coupé','Azores Orange',1,0),(41,'McLaren 675LT',2016,420000.00,'El McLaren 675LT es un superdeportivo de edición limitada (500 coupés/500 spiders) presentado en 2015, diseñado para la máxima ligereza, aerodinámica y rendimiento en pista. Monta un motor 3.8L V8 Biturbo de 675 CV y 700 Nm, logrando el 0-100 km/h en 2,9s y 330 km/h de punta, siendo 100 kg más ligero que el 650S.',9,'2026-04-11 09:28:22','2026-05-04 10:37:19',675,700,330,2.9,'Gasolina','Automática','RWD',2,2,'Coupé','Napier Green',1,0),(42,'McLaren P1 GTR',2015,3000000.00,'El McLaren P1 GTR es una versión de circuito extrema del hiperdeportivo híbrido P1, diseñada sin restricciones legales. Cuenta con 1.000 CV, un peso reducido y aerodinámica optimizada, incluyendo un alerón trasero fijo con sistema DRS. Su motor 3.8L V8 híbrido se enfoca en el rendimiento máximo en pista.',9,'2026-04-11 09:30:10','2026-05-04 10:37:55',1000,1000,362,2.4,'Híbrido','Automática','RWD',1,2,'Coupé (Circuito)','Lark Livery',1,0),(43,'McLaren P1',2014,2152450.00,'El McLaren P1 es un hiperdeportivo híbrido enchufable de edición limitada (375 unidades), producido entre 2013 y 2015, diseñado como sucesor del McLaren F1. Combina un motor V8 biturbo de 3.8L con un motor eléctrico para lograr 916 CV, logrando acelerar de 0-100 km/h en 2.8 segundos y alcanzar una velocidad máxima de 350 km/h.',9,'2026-04-11 09:31:21','2026-05-04 10:38:16',916,900,350,2.8,'Híbrido','Automática','RWD',2,2,'Coupé','Volcano Yellow',1,0),(44,'McLaren 600LT',2019,290000.00,'El McLaren 600LT (Longtail) es un superdeportivo homologado para carretera enfocado en la pista, caracterizado por su ligereza, aerodinámica avanzada y un motor V8 biturbo de 3.8L que rinde 600 CV y 620 Nm de par. Acelera de 0 a 100 km/h en 2.9 segundos y alcanza 328 km/h.',9,'2026-04-11 09:32:46','2026-05-04 10:38:47',600,620,328,2.9,'Gasolina','Automática','RWD',2,2,'Coupé','Chicane Effect',1,0),(45,'Porsche 911 GT3 RS',2019,286000.00,'El Porsche 911 GT3 es un automóvil deportivo cupé de dos puertas, con motor plano de seis cilindros en disposición trasera montado longitudinalmente y de tracción trasera, producido por el fabricante alemán Porsche AG desde 1999. Se trata de una versión más radical del 911 estándar con motor naturalmente aspirado.',10,'2026-04-11 09:34:22','2026-05-04 10:40:41',525,465,296,3.2,'Gasolina','Automática (PDK)','RWD',2,2,'Coupé','Pyro Red',1,1),(46,'Porsche 911 964 Turbo',1994,240000.00,'El Porsche 911 (964) Turbo, producido entre 1990 y 1994, es un icónico deportivo de motor trasero y tracción trasera, conocido por su carrocería ancha, alerón fijo distintivo y un motor bóxer de 6 cilindros sobrealimentado. Inicialmente montó un 3.3L (320 CV) y posteriormente un 3.6L (360 CV), destacando por combinar un alto rendimiento con una conducción más refinada que su predecesor, el 930.',10,'2026-04-11 09:36:31','2026-05-04 10:41:13',360,520,280,4.8,'Gasolina','Manual','RWD',4,2,'Coupé','Midnight Blue Metallic',1,0),(47,'Porsche 718 Cayman GT4 RS',2021,200000.00,'El Porsche 718 Cayman GT4 RS es la versión de alto rendimiento definitiva de la gama 718, diseñada para la máxima ligereza y agilidad. Monta un motor atmosférico bóxer de 4.0 litros y 6 cilindros central con 500 CV (368 kW), permitiéndole acelerar de 0 a 100 km/h en 3,4 segundos y alcanzar 315 km/h.',10,'2026-04-11 09:38:12','2026-05-04 10:41:37',500,450,315,3.4,'Gasolina','Automática (PDK)','RWD',2,2,'Coupé','Arctic Grey',1,0),(48,'Porsche 935',2019,1450000.00,'El Porsche 935 es un icónico automóvil de carreras derivado del 911 Turbo (930), diseñado para el Grupo 5 de la FIA entre 1976 y 1984. Dominó la resistencia mundial con más de 150 victorias, incluyendo las 24 Horas de Le Mans de 1979. Famoso por sus versiones slantnose (morro plano) y la variante Moby Dick, producía potencias superiores a los 600-800 CV.',10,'2026-04-11 09:39:28','2026-05-04 10:42:19',500,750,340,2.7,'Gasolina','Automática (PDK)','RWD',1,2,'Coupé (Circuito)','Martini Livery',1,0),(49,'Porsche 918 Spyder',2015,1800000.00,'El Porsche 918 Spyder es un superdeportivo híbrido enchufable de producción limitada (918 unidades, 2013-2015), que combina un motor 4.6L V8 gasolina con dos motores eléctricos, alcanzando 887 CV y tracción total. Ofrece un rendimiento de competición, alcanzando 100 km/h en 2.2 a 2.6 segundos y una velocidad máxima de 345 km/h.',10,'2026-04-11 09:40:29','2026-05-04 10:42:39',887,1280,345,2.6,'Híbrido','Automática (PDK)','AWD',2,2,'Cabrio','Liquid Metal Silver',1,0),(50,'Porsche Carrera GT',2004,1500000.00,'El Porsche Carrera GT es un superdeportivo analógico icónico con motor central V10 de 5.7 litros y 612 CV, diseñado para competición y adaptado a la calle. Destaca por su chasis monocasco de fibra de carbono, transmisión manual de 6 velocidades y ausencia de ayudas electrónicas, logrando una velocidad máxima superior a 330 km/h y aceleración 0-100 km/h en 3,9 s.',10,'2026-04-11 09:41:51','2026-05-04 10:43:02',612,590,330,3.9,'Gasolina','Manual','RWD',2,2,'Cabrio / Targa','GT Silver Metallic',1,0),(51,'Audi R8 Coupé V10 GT AWD',2023,250000.00,'El Audi R8 Coupé V10 GT es una edición limitada (333 unidades) que representa el cierre del icónico motor V10 atmosférico de 5.2 litros, ofreciendo 620 CV. La versión GT 2023 se enfoca en tracción trasera (RWD) y alto rendimiento, alcanzando los 100 km/h en 3,4 segundos.',11,'2026-04-11 10:32:51','2026-05-04 10:45:04',620,565,320,3.4,'Gasolina','Automática (S tronic)','RWD',2,2,'Coupé','Suzuka Gray',1,1),(52,'Audi TT Coupé',2015,72800.00,'El Audi TT Coupé es un deportivo compacto icónico, conocido por su diseño de líneas puras y fluidas, que equilibra deportividad y uso diario. Destaca por su tecnología avanzada, incluyendo el Audi virtual cockpit, y motores TFSI de 2.0 litros (197-320 CV) con tracción delantera o quattro, ofreciendo una experiencia de conducción ágil y precisa.',11,'2026-04-11 10:34:30','2026-05-04 10:45:31',245,370,250,5.8,'Gasolina','Automática (S tronic)','AWD (quattro)',4,2,'Coupé','Turbo Blue',1,0),(53,'Audi RS6 Avant',2020,151770.00,'El Audi RS 6 Avant es un familiar de altísimo rendimiento, que combina la practicidad de un coche familiar con prestaciones de superdeportivo. Equipado con un motor 4.0 TFSI V8 biturbo, entrega hasta 630 CV (en versión Performance) y 850 Nm de par, logrando el 0-100 km/h en solo 3,4 segundos. Destaca por su tracción quattro, suspensión deportiva y un diseño agresivo.',11,'2026-04-11 10:35:45','2026-05-04 10:46:29',600,800,250,3.6,'Gasolina (MHEV)','Automática (Tiptronic)','AWD (quattro)',5,5,'Familiar (Avant)','Sebring Black',1,0),(54,'Audi RS5 Berlina',2026,125900.00,'El nuevo Audi RS 5 (2026) es una berlina deportiva híbrida enchufable (PHEV) de alto rendimiento, que combina un motor 2.9 V6 biturbo con un motor eléctrico para lograr una potencia total de 639 CV y tracción quattro. Destaca por su diseño agresivo, aceleración de 0 a 100 km/h en 3,6 segundos y autonomía eléctrica de más de 80 km.',11,'2026-04-11 10:37:46','2026-05-04 10:47:32',450,600,250,3.9,'Gasolina','Automática (Tiptronic)','AWD (quattro)',5,4,'Berlina / Sportback','Nardo Gray',1,0),(55,'Audi RS7 Sportback Berlina',2013,161950.00,'El Audi RS7 Sportback (berlina coupé de 4 puertas) es un vehículo de altísimo rendimiento con un motor 4.0 V8 biturbo que entrega entre 600 CV (630 CV en versión Performance) y 800 Nm de par. Destaca por su diseño agresivo, aceleración de 0 a 100 km/h en 3,4-3,6 segundos, tracción quattro, dirección dinámica y tecnologías de hibridación ligera (etiqueta ECO).',11,'2026-04-11 10:40:40','2026-05-04 10:48:03',600,800,250,3.6,'Gasolina (MHEV)','Automática (Tiptronic)','AWD (quattro)',5,4,'Berlina / Sportback','Tango Red',1,0),(56,'Audi S8 US Version',2022,113704.00,'El Audi S8 (versión estadounidense) es la máxima expresión del sedán de lujo de alto rendimiento de la marca alemana, combinando un diseño discreto pero imponente con tecnología punta y una mecánica de alto rendimiento. Se caracteriza por ser un sedán grande de cuatro puertas que combina la comodidad de una limusina con el rendimiento de un deportivo.',11,'2026-04-11 10:43:18','2026-05-04 10:48:26',571,800,250,3.8,'Gasolina (MHEV)','Automática (Tiptronic)','AWD (quattro)',5,4,'Berlina','Daytona Gray',1,0),(57,'Pagani Zonda R',2007,8657000.00,'El Pagani Zonda R es un hiperdeportivo de circuito, extremo y exclusivo, presentado en 2007, del cual solo se fabricaron 15 unidades. Destaca por su motor Mercedes-AMG 6.0L V12 de 750 CV, un peso ligero de 1.100 kg, aceleración de 0 a 100 km/h en 3,2 segundos y fibra de carbono en su carrocería.',12,'2026-04-11 10:44:54','2026-05-04 10:49:44',750,710,351,2.7,'Gasolina','Secuencial (6 vel.)','RWD',2,2,'Coupé (Circuito)','Carbono Visto',1,1),(58,'Pagani Huayra R',2021,2600000.00,'El Pagani Huayra R es un hiperdeportivo exclusivo para circuito, concebido como la máxima expresión de rendimiento y arte automotriz de la marca. Equipado con un motor V12 atmosférico de 6.0 litros (desarrollado por HWA) que produce 850 CV a 9000 rpm, destaca por su ligereza (en seco), aerodinámica activa de alto nivel y un sonido de Fórmula 1.',12,'2026-04-11 10:46:40','2026-05-04 10:50:08',850,750,380,2.7,'Gasolina','Secuencial (6 vel.)','RWD',2,2,'Coupé (Circuito)','Carbon Fiber / Silver',1,0),(59,'Pagani Utopia',2023,3000000.00,'El Pagani Utopia es un hiperdeportivo artesanal, sucesor del Huayra, enfocado en la ligereza, la pureza analógica y el diseño artístico. Monta un motor V12 biturbo de 6.0 litros desarrollado por Mercedes-AMG que produce 864 CV.',12,'2026-04-11 10:47:48','2026-05-04 10:50:30',864,1100,354,3.1,'Gasolina','Manual / Automática','RWD',2,2,'Coupé','Rinascimento',1,0),(60,'Pagani Imola',2021,5000000.00,'El Pagani Imola es un hiperdeportivo extremo y ultra exclusivo, limitado a solo 5 unidades coupé, diseñado para un rendimiento máximo en pista pero homologado para calle. Desarrollado en el circuito de Imola, cuenta con un motor Mercedes-AMG 6.0L V12 biturbo que genera más de 827 CV, destacando por una aerodinámica avanzada y un chasis de carbotitanio extremadamente ligero.',12,'2026-04-11 10:48:56','2026-05-04 10:50:57',827,1100,350,2.8,'Gasolina','Automática (Xtrac 7 vel.)','RWD',2,2,'Coupé','Imola Grey',1,0),(61,'Pagani Zonda Revolucion',2013,2200000.00,'El Pagani Zonda Revolución es la cúspide final del legendario superdeportivo, limitado a solo 5 unidades. Diseñado para la pista, este hypercar combina un chasis de fibra de carbono y titanio con un motor Mercedes-AMG V12 de 6.0L que produce 800 CV y un peso de solo 1070 kg, alcanzando 380 km/h y 0-100 km/h en 2.6s.',12,'2026-04-11 10:50:29','2026-05-04 10:51:25',800,730,350,2.6,'Gasolina','Secuencial (6 vel.)','RWD',2,2,'Coupé (Circuito)','Blue Carbon Fiber',1,0),(62,'Pagani Huayra BC',2016,4000000.00,'El Pagani Huayra BC es una versión extrema y ultraligera del hiperdeportivo italiano, limitada a 20 unidades coupé (y 40 roadster), enfocada en el rendimiento en pista. Utiliza un motor V12 de 6.0 litros biturbo desarrollado por AMG, potenciado a más de 790-800 caballos y una caja de cambios secuencial de siete velocidades que logra acelerar de 0-100 km/h en menos de 3 segundos, todo con un peso inferior a 1250 kg.',12,'2026-04-11 10:51:43','2026-05-04 10:52:03',800,1100,370,3.0,'Gasolina','Automática (Xtrac 7 vel.)','RWD',2,2,'Coupé','Grigio Benny',1,0),(63,'Ferrari F40',1987,3500000.00,'El Ferrari F40 (1987-1992) es un superdeportivo icónico, famoso por ser el último aprobado por Enzo Ferrari. Combina un motor V8 biturbo de 2.9L (478 CV) con una carrocería ligera de Kevlar/fibra de carbono, alcanzando 324 km/h. Destaca su diseño radical de Pininfarina, faros retráctiles y alerón trasero fijo, ofreciendo una experiencia de conducción pura sin ayudas electrónicas.',13,'2026-04-11 10:54:02','2026-05-04 10:53:45',478,577,324,4.1,'Gasolina','Manual','RWD',2,2,'Coupé','Rosso Corsa',1,0),(64,'Ferrari LaFerrari Aperta',2017,6000000.00,'La Ferrari LaFerrari Aperta (2016) es la versión descapotable del icónico hiperdeportivo híbrido, lanzada para el 70 aniversario de la marca. Mantiene el motor V12 y el sistema eléctrico HY-KERS, rindiendo un total de (V12 + eléctrico). Con solo 210 unidades producidas.',13,'2026-04-11 10:56:45','2026-05-04 10:54:08',963,900,350,2.8,'Híbrido','Automática (Doble embrague 7 vel.)','RWD',2,2,'Cabrio','Nero Daytona',1,0),(65,'Ferrari 488 Pista Spider',2019,650000.00,'El Ferrari 488 Pista Spider es un descapotable de alto rendimiento, edición especial, que combina el motor V8 de 3.9 litros biturbo más potente de la historia de la marca (720 CV) con una experiencia a cielo abierto. Acelera de 0 a 100 km/h en 2,85 segundos y alcanza 340 km/h.',13,'2026-04-11 10:58:06','2026-05-04 10:54:31',720,770,340,2.9,'Gasolina','Automática (Doble embrague 7 vel.)','RWD',2,2,'Cabrio','Blu Nart',1,0),(66,'Ferrari 812 Competizione',2021,1400000.00,'El Ferrari 812 Competizione es una edición limitada y radical del 812 Superfast, enfocada en la máxima pista, con un motor V12 de 6.5 litros atmosférico que genera 830 CV a 9.250 rpm y alcanza las 9.500 rpm. Destaca por su ligereza (1487 kg en seco), aerodinámica avanzada, dirección a las cuatro ruedas y producción limitada a 999 coupés y 599 versiones Targa (A).',13,'2026-04-11 10:59:24','2026-05-04 10:54:51',830,692,340,2.9,'Gasolina','Automática (Doble embrague 7 vel.)','RWD',2,2,'Coupé','Grigio Silverstone',1,1),(67,'Ferrari 812 GTS',2020,450000.00,'El Ferrari 812 GTS es un descapotable de producción con motor V12 delantero de 6.5 litros, que entrega 800 cv y alcanza 340 km/h. Es la variante Spider del 812 Superfast, acelerando de 0 a 100 km/h en menos de 3 segundos. Presenta un techo rígido retráctil que se abre en 14 segundos.',13,'2026-04-11 11:00:17','2026-05-04 10:55:16',800,718,340,3.0,'Gasolina','Automática (Doble embrague 7 vel.)','RWD',2,2,'Cabrio','Giallo Modena',1,0),(68,'Ferrari 599XX',2010,1732760.00,'El Ferrari 599XX es un vehículo de pista ultra radical, no homologado para calle, basado en el 599 GTB y parte del programa exclusivo XX. Equipado con un motor V12 de 6.0 litros, produce entre 700 y 750 CV (en la versión Evo) a más de 9,000 rpm, destacando por una aerodinámica activa avanzada y un peso ligero de 1.345 kg.',13,'2026-04-11 11:01:26','2026-05-04 10:55:46',730,700,315,2.9,'Gasolina','Secuencial (F1 de 6 vel.)','RWD',2,2,'Coupé (Circuito)','Rosso Corsa',1,0),(69,'Toyota Supra MK5',2019,78000.00,'El Toyota Supra MK5 (A90), lanzado en 2019, es un deportivo biplaza de tracción trasera y motor delantero, fruto de la colaboración con BMW. Ofrece motores 2.0L (4 cil.) y 3.0L (6 cil.) turboalimentados, destacando por su agilidad, distribución de peso 50:50 y un diseño aerodinámico agresivo.',14,'2026-04-11 11:03:09','2026-05-04 10:57:24',340,500,250,4.3,'Gasolina','Automática / Manual','RWD',2,2,'Coupé','Horizon Blue',1,0),(70,'Toyota Supra MK4 Hycade Stage 1',1996,150000.00,'El Toyota Supra MK4 con kit de carrocería Hycade Stage 1 es una reinterpretación digital/física de alto rendimiento que moderniza el clásico A80. Destaca por un estilo de carrocería ancha (widebody) más agresivo, pasos de rueda ensanchados, tomas de aire prominentes y detalles en fibra de carbono, manteniendo el alma del icónico motor 2JZ.',14,'2026-04-11 11:05:03','2026-05-04 10:57:53',330,441,250,5.1,'Gasolina','Manual','RWD',4,2,'Coupé','Renaissance Red',1,1),(71,'Toyota RAV4 TRD Off Road',2020,33250.00,'La Toyota RAV4 TRD Off-Road fue introducida oficialmente para el año modelo 2020. Esta versión, basada en la quinta generación del modelo, se destaca por su enfoque en la aventura con mejoras específicas en suspensión, neumáticos todoterreno y tracción, siendo el primer modelo RAV4 en recibir el tratamiento TRD.',14,'2026-04-11 11:06:20','2026-05-04 10:58:18',206,249,200,8.4,'Gasolina','Automática','4x4 (AWD)',5,5,'SUV','Magnetic Gray Metallic',1,0),(72,'Toyota GT86',2017,23000.00,'El Toyota GT86 se lanzó al mercado en 2012 y se mantuvo en producción con su primera generación hasta aproximadamente 2020-2021, recibiendo una actualización importante (rediseño) a finales de 2017. Fue desarrollado en colaboración con Subaru, compartiendo plataforma con el Subaru BRZ.',14,'2026-04-11 11:07:13','2026-05-04 10:58:43',200,205,226,7.6,'Gasolina','Manual','RWD',4,2,'Coupé','Pure Red',1,0),(73,'Toyota Camry',2021,52000.00,'El Toyota Camry es una berlina sedán de tamaño mediano reconocida por su fiabilidad, confort de marcha y eficiencia, comercializándose actualmente con motorización híbrida autorrecargable (HEV). Destaca por su amplio espacio interior, diseño elegante, motor 2.5L de ciclo Atkinson con potencias superiores a 218 CV, bajo consumo y etiqueta ECO.',14,'2026-04-11 11:09:23','2026-05-04 10:59:04',218,221,180,8.3,'Híbrido','Automática (e-CVT)','FWD',5,4,'Berlina','Platinum White Pearl',1,0),(74,'Toyota Century',2018,22527.00,'El Toyota Century es el sedán de superlujo definitivo de Japón, conocido como el Rolls-Royce japonés. Desde 1967, representa la máxima sofisticación y discreción para la élite y la Casa Imperial. Destaca por su artesanía meticulosa, confort inigualable y, actualmente, ofrece una versión sedán V8 híbrida y una nueva variante SUV híbrida enchufable.',14,'2026-04-11 11:10:38','2026-05-04 10:59:27',280,481,210,7.5,'Gasolina','Automática','RWD',5,4,'Berlina','Kamui Black',1,0),(75,'Nissan GT-R R35',2017,111000.00,'El Nissan GT-R R35, conocido como Godzilla, es un superdeportivo japonés (cupé 2+2) lanzado en 2007 que revolucionó el mercado por su rendimiento y tecnología. Equipado con un motor V6 biturbo de 3.8L montado a mano (565-600+ HP), tracción integral (ATTESA E-TS) y una rápida transmisión de doble embrague, acelera de 0 a 100 km/h en ~2.8s.',15,'2026-04-11 11:15:56','2026-05-04 11:00:57',570,637,315,2.8,'Gasolina','Automática (Doble embrague 6 vel.)','AWD',4,2,'Coupé','Bayside Blue / Katsura Orange',1,1),(76,'Nissan Skyline GT-R R34',1999,162500.00,'El Nissan Skyline GT-R R34 (1999-2002) es un deportivo japonés legendario. Destaca por su motor RB26DETT 2.6L biturbo de 6 cilindros en línea, tracción total ATTESA E-TS y avanzada tecnología, incluyendo una pantalla multifunción. Producía oficialmente 280 CV, aunque con una capacidad de modificación casi ilimitada.',15,'2026-04-11 11:17:49','2026-05-04 11:01:28',280,353,250,5.5,'Gasolina','Manual','AWD',4,2,'Coupé','Gun Grey Metallic',1,0),(77,'Nissan 370Z',2013,42500.00,'EEl Nissan 370Z es un deportivo biplaza icónico conocido por su diseño compacto, motor atmosférico V6 de 3.7 litros y tracción trasera. Ofrece alrededor de 328-344 CV, con opciones de cambio manual o automático, destacando por su agilidad, equilibrio y conducción pura',15,'2026-04-11 11:18:59','2026-05-04 11:01:58',328,363,250,5.3,'Gasolina','Manual / Automática','RWD',2,2,'Coupé','Monterey Blue',1,0),(78,'Nissan Silvia S15',1999,50000.00,'El Nissan Silvia S15 (1999-2002) es la última y más icónica generación de la serie Silvia, un cupé deportivo compacto de tracción trasera conocido por su chasis rígido, diseño agresivo y potencial para el drift. Equipaba un motor 2.0L SR20DET turboalimentado (hasta 250 CV) o atmosférico, valorado por su manejo analógico y alta capacidad de modificación.',15,'2026-04-11 11:20:38','2026-05-04 11:02:21',250,275,235,5.6,'Gasolina','Manual','RWD',4,2,'Coupé','Lightning Yellow',1,0),(79,'Nissan Skyline GT-R R32',1989,70000.00,'El Nissan Skyline GT-R R32 (1989-1994) es un icónico deportivo japonés. Equipado con un motor RB26DETT de 2.6L biturbo y tracción integral ATTESA E-TS, entregaba 280 CV de serie. Destaca por su agilidad, tracción avanzada y éxito en el Grupo A.',15,'2026-04-11 11:22:23','2026-05-04 11:02:42',280,353,250,5.5,'Gasolina','Manual','AWD',4,2,'Coupé','Gun Grey Metallic',1,0),(80,'Nissan 350Z Z30 Wide Body',2002,134000.00,'El Nissan 350Z con kit Wide Body (carrocería ancha) es una de las modificaciones más populares y estéticamente agresivas para el deportivo Z33/Z30 de Nissan, a menudo asociado a estilos de tuning estilo JDM (Japanese Domestic Market), Drift o Rocket Bunny.',15,'2026-04-11 11:24:22','2026-05-04 11:03:06',313,358,250,5.7,'Gasolina','Manual / Automática','RWD',2,2,'Coupé','Sunset Orange',1,0),(81,'Mercedes-Benz AMG GT Black Series',2020,600000.00,'El Mercedes-Benz AMG GT Black Series (2021) es una edición limitada de alto rendimiento, diseñada para circuito pero homologada para calle, con un motor 4.0L V8 biturbo que desarrolla 730 CV y 800 Nm de par. Se caracteriza por una aerodinámica extrema derivada de la competición, incluyendo un gran alerón trasero ajustable, fibra de carbono extensiva y una aceleración de 0 a 100 km/h en 3,2 segundos.',16,'2026-04-11 11:27:09','2026-05-04 11:07:34',730,800,325,3.2,'Gasolina','Automática (AMG SPEEDSHIFT DCT 7G)','RWD',2,2,'Coupé','AMG Magmabeam',1,1),(82,'Mercedes-Benz AMG G63',2019,223000.00,'El Mercedes-Benz AMG G63 es un todoterreno de lujo de alto rendimiento, reconocido por su icónico diseño cuadrado, motor V8 biturbo de 4.0 litros (585 CV y 850 Nm) y tracción 4MATIC. Combina lujo extremo con capacidad off-road, acelerando de 0 a 100 km/h en 4,4-4,5 segundos. Cuenta con caja automática AMG SPEEDSHIFT TCT 9G y un interior con tecnología avanzada (MBUX), cuero napa y diseño sólido.',16,'2026-04-11 11:28:07','2026-05-04 11:10:54',585,850,220,4.5,'Gasolina','Automática (AMG SPEEDSHIFT TCT 9G)','4x4',5,5,'SUV','Obsidian Black',1,0),(83,'Mercedes-Benz AMG ONE',2022,3387950.00,'El Mercedes-AMG ONE es un hiperdeportivo híbrido enchufable de producción limitada (275 unidades) que traslada tecnología real de Fórmula 1 a la carretera. Con un motor V6 de 1.6 litros y cuatro motores eléctricos, ofrece una potencia combinada de 1.063 CV, alcanzando 352 km/h y acelerando de 0 a 200 km/h en solo 7 segundos.',16,'2026-04-11 11:29:57','2026-05-04 11:11:17',1063,1000,352,2.9,'Híbrido','Manual Automatizada (7 vel.)','AWD (4MATIC+)',2,2,'Coupé','Silver Arrows Livery',1,0),(84,'Mercedes-Benz AMG SL 63',2008,230000.00,'El Mercedes-AMG SL 63 es un descapotable de lujo y alto rendimiento, reinterpretado como un Roadster deportivo de 2+2 plazas con capota de lona. Destaca por su motor V8 biturbo de 4.0 litros, ofreciendo 585 CV (o hasta 816 CV en la versión híbrida enchufable E PERFORMANCE) y tracción total 4MATIC+. Combina la agilidad de un superdeportivo con la comodidad de un gran turismo.',16,'2026-04-11 11:31:15','2026-05-04 11:11:46',585,800,315,3.6,'Gasolina','Automática (AMG SPEEDSHIFT MCT 9G)','AWD (4MATIC+)',4,2,'Cabrio','Hyper Blue Metallic',1,0),(85,'Mercedes-Benz AMG E63',2017,70000.00,'El Mercedes-AMG E 63 S 4MATIC+ es una berlina de lujo de alto rendimiento, destacada por su motor 4.0L V8 biturbo que genera hasta 612 CV y 850 Nm de torque. Acelera de 0 a 100 km/h en aproximadamente 3.4 segundos, combinando tracción integral inteligente con un modo Drift para un manejo deportivo extremo',16,'2026-04-11 11:32:34','2026-05-04 11:12:20',612,850,300,3.4,'Gasolina','Automática (AMG SPEEDSHIFT MCT 9G)','AWD (4MATIC+)',5,4,'Berlina','Graphite Grey Magno',1,0),(86,'Mercedes-Benz AMG GT63 S E Performance',2025,200000.00,'El Mercedes-AMG GT 63 S E Performance (4 puertas) es un híbrido enchufable de alto rendimiento que combina un motor V8 biturbo de 4.0L con un motor eléctrico trasero, entregando una potencia combinada de hasta 843 CV y un par máximo superior a 1400 Nm. Acelera de 0 a 100 km/h en solo 2,9 segundos, alcanzando los 316 km/h.',16,'2026-04-11 11:33:52','2026-05-04 11:12:45',843,1470,316,2.9,'Híbrido','Automática (AMG SPEEDSHIFT MCT 9G)','AWD (4MATIC+)',4,4,'Berlina / Coupé 4 puertas','Green Hell Magno',1,0),(87,'Bugatti Bolide',2020,4000000.00,'El Bugatti Bolide es un hiperdeportivo de circuito extremo, limitado a 40 unidades, diseñado para maximizar el rendimiento con un motor W16 de 8.0 litros y 1850 CV. Con un peso ligero de 1240-1450 kg y una carrocería de fibra de carbono, logra una velocidad superior a 500 km/h y una aceleración de 0-100 km/h en 2,17 segundos.',17,'2026-04-11 11:36:08','2026-05-04 11:15:14',1850,1850,500,2.2,'Gasolina','Automática (Doble embrague 7 vel.)','AWD',2,2,'Coupé (Circuito)','French Racing Blue / Carbon',1,1),(88,'Bugatti Chiron Super Sport 300+',2019,5400000.00,'El Bugatti Chiron Super Sport 300+ es un hiperdeportivo de producción limitada (30 unidades) diseñado para la velocidad extrema, famoso por romper la barrera de las 300 mph (490.48 km/h en 2019).',17,'2026-04-11 11:40:40','2026-05-04 11:15:35',1600,1600,490,2.3,'Gasolina','Automática (Doble embrague 7 vel.)','AWD',2,2,'Coupé','Black Carbon / Jet Orange',0,0),(89,'Bugatti Chiron',2016,3000000.00,'El Bugatti Chiron es un superdeportivo biplaza de lujo, sucesor del Veyron, presentado en 2016 con un motor W16 de 8.0 litros y cuatro turbos que genera 1.500 CV. Con una producción limitada y un diseño aerodinámico en fibra de carbono, alcanza velocidades superiores a 420 km/h, marcando un hito en ingeniería.',17,'2026-04-11 11:41:54','2026-05-04 11:15:54',1500,1600,420,2.4,'Gasolina','Automática (Doble embrague 7 vel.)','AWD',2,2,'Coupé','Atlantic Blue',1,0),(90,'Bugatti La Voiture Noire',2019,25000000.00,'El Bugatti La Voiture Noire es un hiperdeportivo único (one-off) y exclusivo, creado para celebrar el 110 aniversario de la marca. Inspirado en el legendario Type 57 SC Atlantic de Jean Bugatti, combina elegancia clásica con ingeniería moderna, destacando su carrocería de fibra de carbono hecha a mano en negro brillante, motor W16 de 8.0 litros con 1500 CV y seis salidas de escape.',17,'2026-04-11 11:43:02','2026-05-04 11:16:25',1500,1600,420,2.4,'Gasolina','Automática (Doble embrague 7 vel.)','AWD',2,2,'Coupé','Deep Black Gloss',1,0),(91,'Bugatti Veyron Grand Sport Vitesse La Finale',2015,2500000.00,'El Bugatti Veyron Grand Sport Vitesse La Finale (2015) es la unidad 450 y última del Veyron, celebrando el fin de su producción. Basado en el Grand Sport Vitesse, monta un motor W16 8.0L con 1.200 CV y 1.500 Nm de par, logrando 410 km/h y 0-100 km/h en 2,6 s. Destaca por su diseño único en rojo y negro, fibra de carbono expuesta y detalles exclusivos.',17,'2026-04-11 11:44:20','2026-05-04 11:16:48',1200,1500,410,2.6,'Gasolina','Automática (Doble embrague 7 vel.)','AWD',2,2,'Cabrio','Italian Red / Black Carbon',1,0),(92,'Bugatti Centodieci',2020,15000000.00,'El Bugatti Centodieci es un hiperdeportivo exclusivo limitado a solo 10 unidades, creado como tributo al Bugatti EB110 de 1991 para celebrar el 110 aniversario de la marca. Basado en el Chiron, cuenta con un motor W16 de 8.0 litros potenciado a 1.600 CV, alcanzando los 380 km/h y 0-100 km/h en 2,4 segundos.',17,'2026-04-11 11:45:24','2026-05-04 11:17:12',1600,1600,380,2.4,'Gasolina','Automática (Doble embrague 7 vel.)','AWD',2,2,'Coupé','Bianco',1,0);
/*!40000 ALTER TABLE `coches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `financiaciones`
--

DROP TABLE IF EXISTS `financiaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `financiaciones` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `coche_id` bigint unsigned NOT NULL,
  `meses` int NOT NULL,
  `cuota_mensual` decimal(8,2) NOT NULL,
  `entrada` decimal(8,2) DEFAULT NULL,
  `interes` decimal(5,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `financiaciones_coche_id_foreign` (`coche_id`),
  KEY `financiaciones_user_id_foreign` (`user_id`),
  CONSTRAINT `financiaciones_coche_id_foreign` FOREIGN KEY (`coche_id`) REFERENCES `coches` (`id`) ON DELETE CASCADE,
  CONSTRAINT `financiaciones_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `financiaciones`
--

LOCK TABLES `financiaciones` WRITE;
/*!40000 ALTER TABLE `financiaciones` DISABLE KEYS */;
/*!40000 ALTER TABLE `financiaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `imagenes_vehiculos`
--

DROP TABLE IF EXISTS `imagenes_vehiculos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `imagenes_vehiculos` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `coche_id` bigint unsigned NOT NULL,
  `ruta` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `es_principal` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `imagenes_vehiculos_coche_id_foreign` (`coche_id`),
  CONSTRAINT `imagenes_vehiculos_coche_id_foreign` FOREIGN KEY (`coche_id`) REFERENCES `coches` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=411 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `imagenes_vehiculos`
--

LOCK TABLES `imagenes_vehiculos` WRITE;
/*!40000 ALTER TABLE `imagenes_vehiculos` DISABLE KEYS */;
INSERT INTO `imagenes_vehiculos` VALUES (1,51,'coches/audi/r8_coupe_v10_gt_rwd/r8-01.png',0,'2026-04-12 09:05:00','2026-04-12 10:22:31'),(2,51,'coches/audi/r8_coupe_v10_gt_rwd/r8-02.png',0,'2026-04-12 09:05:00','2026-04-12 10:22:31'),(3,51,'coches/audi/r8_coupe_v10_gt_rwd/r8-03.png',0,'2026-04-12 09:05:00','2026-04-12 10:22:31'),(4,51,'coches/audi/r8_coupe_v10_gt_rwd/r8-04.png',0,'2026-04-12 09:05:00','2026-04-12 10:22:31'),(5,51,'coches/audi/r8_coupe_v10_gt_rwd/r8-05.png',0,'2026-04-12 09:05:00','2026-04-12 10:22:31'),(6,51,'coches/audi/r8_coupe_v10_gt_rwd/r8-escaparate.png',1,'2026-04-12 09:05:00','2026-04-12 10:22:31'),(7,54,'coches/audi/rs5_berlina/rs5-01.png',0,'2026-04-12 09:05:00','2026-04-12 10:22:31'),(8,54,'coches/audi/rs5_berlina/rs5-02.png',0,'2026-04-12 09:05:00','2026-04-12 10:22:31'),(9,54,'coches/audi/rs5_berlina/rs5-03.png',0,'2026-04-12 09:05:00','2026-04-12 10:22:31'),(10,54,'coches/audi/rs5_berlina/rs5-04.png',0,'2026-04-12 09:05:00','2026-04-12 10:22:31'),(11,54,'coches/audi/rs5_berlina/rs5-escaparate.png',1,'2026-04-12 09:05:00','2026-04-12 10:22:31'),(12,53,'coches/audi/rs6_avant/rs6-01.png',0,'2026-04-12 09:05:00','2026-04-12 10:22:31'),(13,53,'coches/audi/rs6_avant/rs6-02.png',0,'2026-04-12 09:05:00','2026-04-12 10:22:31'),(14,53,'coches/audi/rs6_avant/rs6-03.png',0,'2026-04-12 09:05:00','2026-04-12 10:22:31'),(15,53,'coches/audi/rs6_avant/rs6-04.png',0,'2026-04-12 09:05:00','2026-04-12 10:22:31'),(16,53,'coches/audi/rs6_avant/rs6-escaparate.png',1,'2026-04-12 09:05:00','2026-04-12 10:22:31'),(17,55,'coches/audi/rs7_berlina/rs7-01.png',0,'2026-04-12 09:05:00','2026-04-12 10:22:31'),(18,55,'coches/audi/rs7_berlina/rs7-02.png',0,'2026-04-12 09:05:00','2026-04-12 10:22:31'),(19,55,'coches/audi/rs7_berlina/rs7-03.png',0,'2026-04-12 09:05:00','2026-04-12 10:22:31'),(20,55,'coches/audi/rs7_berlina/rs7-04.png',0,'2026-04-12 09:05:00','2026-04-12 10:22:31'),(21,55,'coches/audi/rs7_berlina/rs7-escaparate.png',1,'2026-04-12 09:05:00','2026-04-12 10:22:31'),(22,56,'coches/audi/s8_us_version/s8-01.png',0,'2026-04-12 09:05:00','2026-04-12 10:22:31'),(23,56,'coches/audi/s8_us_version/s8-02.png',0,'2026-04-12 09:05:00','2026-04-12 10:22:31'),(24,56,'coches/audi/s8_us_version/s8-03.png',0,'2026-04-12 09:05:00','2026-04-12 10:22:31'),(25,56,'coches/audi/s8_us_version/s8-04.jpg',0,'2026-04-12 09:05:00','2026-04-12 10:22:31'),(26,56,'coches/audi/s8_us_version/s8-escaparate.png',1,'2026-04-12 09:05:00','2026-04-12 10:22:31'),(27,52,'coches/audi/tt_coupe/tt-01.png',0,'2026-04-12 09:05:00','2026-04-12 10:22:31'),(28,52,'coches/audi/tt_coupe/tt-02.png',0,'2026-04-12 09:05:00','2026-04-12 10:22:31'),(29,52,'coches/audi/tt_coupe/tt-03.png',0,'2026-04-12 09:05:00','2026-04-12 10:22:31'),(30,52,'coches/audi/tt_coupe/tt-04.png',0,'2026-04-12 09:05:00','2026-04-12 10:22:31'),(31,52,'coches/audi/tt_coupe/tt-escaparate.png',1,'2026-04-12 09:05:00','2026-04-12 10:22:31'),(32,36,'coches/bmw/m2/m2-01.png',0,'2026-04-12 09:05:00','2026-04-12 10:22:31'),(33,36,'coches/bmw/m2/m2-02.png',0,'2026-04-12 09:05:00','2026-04-12 10:22:31'),(34,36,'coches/bmw/m2/m2-03.png',0,'2026-04-12 09:05:00','2026-04-12 10:22:31'),(35,36,'coches/bmw/m2/m2-escaparate.png',1,'2026-04-12 09:05:00','2026-04-12 10:22:31'),(36,34,'coches/bmw/m3_cs/m3-cs-01.png',0,'2026-04-12 09:05:00','2026-04-12 10:22:31'),(37,34,'coches/bmw/m3_cs/m3-cs-02.png',0,'2026-04-12 09:05:00','2026-04-12 10:22:31'),(38,34,'coches/bmw/m3_cs/m3-cs-03.png',0,'2026-04-12 09:05:00','2026-04-12 10:22:31'),(39,34,'coches/bmw/m3_cs/m3-cs-04.png',0,'2026-04-12 09:05:00','2026-04-12 10:22:31'),(40,34,'coches/bmw/m3_cs/m3-cs-escaparate.png',1,'2026-04-12 09:05:00','2026-04-12 10:22:31'),(41,33,'coches/bmw/m3_sport_evolution/m3-sport-evolution-01.jpg',0,'2026-04-12 09:05:00','2026-04-12 10:22:31'),(42,33,'coches/bmw/m3_sport_evolution/m3-sport-evolution-02.jpg',0,'2026-04-12 09:05:00','2026-04-12 10:22:31'),(43,33,'coches/bmw/m3_sport_evolution/m3-sport-evolution-03.png',0,'2026-04-12 09:05:00','2026-04-12 10:22:31'),(44,33,'coches/bmw/m3_sport_evolution/m3-sport-evolution-04.png',0,'2026-04-12 09:05:00','2026-04-12 10:22:31'),(45,33,'coches/bmw/m3_sport_evolution/m3-sport-evolution-escaparate.jpg',1,'2026-04-12 09:05:00','2026-04-12 10:22:31'),(46,32,'coches/bmw/m4_coupe_competition/m4-coupe-01.png',0,'2026-04-12 09:05:00','2026-04-12 10:22:31'),(47,32,'coches/bmw/m4_coupe_competition/m4-coupe-02.png',0,'2026-04-12 09:05:00','2026-04-12 10:22:31'),(48,32,'coches/bmw/m4_coupe_competition/m4-coupe-03.png',0,'2026-04-12 09:05:00','2026-04-12 10:22:31'),(49,32,'coches/bmw/m4_coupe_competition/m4-coupe-04.png',0,'2026-04-12 09:05:00','2026-04-12 10:22:31'),(50,32,'coches/bmw/m4_coupe_competition/m4-coupe-escaparate.png',1,'2026-04-12 09:05:00','2026-04-12 10:22:31'),(51,31,'coches/bmw/m4_gt3/m4-gt3-01.png',0,'2026-04-12 09:05:00','2026-04-12 10:22:31'),(52,31,'coches/bmw/m4_gt3/m4-gt3-02.png',0,'2026-04-12 09:05:00','2026-04-12 10:22:31'),(53,31,'coches/bmw/m4_gt3/m4-gt3-03.png',0,'2026-04-12 09:05:00','2026-04-12 10:22:31'),(54,31,'coches/bmw/m4_gt3/m4-gt3-04.png',0,'2026-04-12 09:05:00','2026-04-12 10:22:31'),(55,31,'coches/bmw/m4_gt3/m4-gt3-escaparate.png',1,'2026-04-12 09:05:00','2026-04-12 10:22:31'),(56,35,'coches/bmw/m5_cs/m5-cs-01.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:31'),(57,35,'coches/bmw/m5_cs/m5-cs-02.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:31'),(58,35,'coches/bmw/m5_cs/m5-cs-03.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:31'),(59,35,'coches/bmw/m5_cs/m5-cs-04.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:31'),(60,35,'coches/bmw/m5_cs/m5-cs-escaparate.jpg',1,'2026-04-12 09:05:01','2026-04-12 10:22:31'),(61,65,'coches/ferrari/488_pista_spider/488-pista-01.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:31'),(62,65,'coches/ferrari/488_pista_spider/488-pista-02.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:31'),(63,65,'coches/ferrari/488_pista_spider/488-pista-03.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:31'),(64,65,'coches/ferrari/488_pista_spider/488-pista-04.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:31'),(65,65,'coches/ferrari/488_pista_spider/488-pista-05.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:31'),(66,65,'coches/ferrari/488_pista_spider/488-pista-06.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:31'),(67,65,'coches/ferrari/488_pista_spider/488-pista-escaparate.png',1,'2026-04-12 09:05:01','2026-04-12 10:22:31'),(68,68,'coches/ferrari/599xx/599xx-01.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:31'),(69,68,'coches/ferrari/599xx/599xx-02.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:31'),(70,68,'coches/ferrari/599xx/599xx-03.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:31'),(71,68,'coches/ferrari/599xx/599xx-04.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:31'),(72,68,'coches/ferrari/599xx/599xx-05.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:31'),(73,68,'coches/ferrari/599xx/599xx-escaparate.png',1,'2026-04-12 09:05:01','2026-04-12 10:22:31'),(74,66,'coches/ferrari/812_competizione/812-competizione-01.jpg',0,'2026-04-12 09:05:01','2026-04-12 10:22:31'),(75,66,'coches/ferrari/812_competizione/812-competizione-02.jpg',0,'2026-04-12 09:05:01','2026-04-12 10:22:31'),(76,66,'coches/ferrari/812_competizione/812-competizione-03.jpg',0,'2026-04-12 09:05:01','2026-04-12 10:22:31'),(77,66,'coches/ferrari/812_competizione/812-competizione-04.jpg',0,'2026-04-12 09:05:01','2026-04-12 10:22:31'),(78,66,'coches/ferrari/812_competizione/812-competizione-05.jpg',0,'2026-04-12 09:05:01','2026-04-12 10:22:31'),(79,66,'coches/ferrari/812_competizione/812-competizione-06.jpg',0,'2026-04-12 09:05:01','2026-04-12 10:22:31'),(80,66,'coches/ferrari/812_competizione/812-competizione-escaparate.jpg',1,'2026-04-12 09:05:01','2026-04-12 10:22:31'),(81,67,'coches/ferrari/812_gts/812-gts-01.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:31'),(82,67,'coches/ferrari/812_gts/812-gts-02.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:31'),(83,67,'coches/ferrari/812_gts/812-gts-03.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:31'),(84,67,'coches/ferrari/812_gts/812-gts-04.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:31'),(85,67,'coches/ferrari/812_gts/812-gts-05.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:31'),(86,67,'coches/ferrari/812_gts/812-gts-escaparate.png',1,'2026-04-12 09:05:01','2026-04-12 10:22:31'),(87,63,'coches/ferrari/f40/f40-01.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:31'),(88,63,'coches/ferrari/f40/f40-02.jpeg',0,'2026-04-12 09:05:01','2026-04-12 10:22:31'),(89,63,'coches/ferrari/f40/f40-03.jpeg',0,'2026-04-12 09:05:01','2026-04-12 10:22:31'),(90,63,'coches/ferrari/f40/f40-04.jpeg',0,'2026-04-12 09:05:01','2026-04-12 10:22:31'),(91,63,'coches/ferrari/f40/f40-05.jpeg',0,'2026-04-12 09:05:01','2026-04-12 10:22:31'),(92,63,'coches/ferrari/f40/f40-escaparate.jpeg',1,'2026-04-12 09:05:01','2026-04-12 10:22:31'),(93,64,'coches/ferrari/laferrari_aperta/laferrari-01.jpg',0,'2026-04-12 09:05:01','2026-04-12 10:22:31'),(94,64,'coches/ferrari/laferrari_aperta/laferrari-02.jpg',0,'2026-04-12 09:05:01','2026-04-12 10:22:31'),(95,64,'coches/ferrari/laferrari_aperta/laferrari-03.jpg',0,'2026-04-12 09:05:01','2026-04-12 10:22:31'),(96,64,'coches/ferrari/laferrari_aperta/laferrari-04.jpg',0,'2026-04-12 09:05:01','2026-04-12 10:22:31'),(97,64,'coches/ferrari/laferrari_aperta/laferrari-escaparate.jpg',1,'2026-04-12 09:05:01','2026-04-12 10:22:31'),(98,27,'coches/lamborghini/aventador_svj_roadster/aventador-01.jpg',0,'2026-04-12 09:05:01','2026-04-12 10:22:31'),(99,27,'coches/lamborghini/aventador_svj_roadster/aventador-02.jpg',0,'2026-04-12 09:05:01','2026-04-12 10:22:31'),(100,27,'coches/lamborghini/aventador_svj_roadster/aventador-03.jpg',0,'2026-04-12 09:05:01','2026-04-12 10:22:31'),(101,27,'coches/lamborghini/aventador_svj_roadster/aventador-04.jpg',0,'2026-04-12 09:05:01','2026-04-12 10:22:31'),(102,27,'coches/lamborghini/aventador_svj_roadster/aventador-05.jpg',0,'2026-04-12 09:05:01','2026-04-12 10:22:31'),(103,27,'coches/lamborghini/aventador_svj_roadster/aventador-escaparate.jpg',1,'2026-04-12 09:05:01','2026-04-12 10:22:31'),(104,26,'coches/lamborghini/huracan_performante/huracan-01.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:31'),(105,26,'coches/lamborghini/huracan_performante/huracan-02.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:31'),(106,26,'coches/lamborghini/huracan_performante/huracan-03.jpg',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(107,26,'coches/lamborghini/huracan_performante/huracan-04.jpg',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(108,26,'coches/lamborghini/huracan_performante/huracan-escaparate.png',1,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(109,30,'coches/lamborghini/murcielago/murcielago-01.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(110,30,'coches/lamborghini/murcielago/murcielago-02.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(111,30,'coches/lamborghini/murcielago/murcielago-03.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(112,30,'coches/lamborghini/murcielago/murcielago-04.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(113,30,'coches/lamborghini/murcielago/murcielago-05.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(114,30,'coches/lamborghini/murcielago/murcielago-escaparate.png',1,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(115,28,'coches/lamborghini/revuelto/revuelto-01.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(116,28,'coches/lamborghini/revuelto/revuelto-02.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(117,28,'coches/lamborghini/revuelto/revuelto-03.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(118,28,'coches/lamborghini/revuelto/revuelto-04.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(119,28,'coches/lamborghini/revuelto/revuelto-05.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(120,28,'coches/lamborghini/revuelto/revuelto-06.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(121,28,'coches/lamborghini/revuelto/revuelto-escaparate.png',1,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(122,29,'coches/lamborghini/urus_performante/urus-01.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(123,29,'coches/lamborghini/urus_performante/urus-02.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(124,29,'coches/lamborghini/urus_performante/urus-03.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(125,29,'coches/lamborghini/urus_performante/urus-04.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(126,29,'coches/lamborghini/urus_performante/urus-05.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(127,29,'coches/lamborghini/urus_performante/urus-06.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(128,29,'coches/lamborghini/urus_performante/urus-escaparate.png',1,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(129,25,'coches/lamborghini/veneno_roadster/veneno-01.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(130,25,'coches/lamborghini/veneno_roadster/veneno-02.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(131,25,'coches/lamborghini/veneno_roadster/veneno-03.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(132,25,'coches/lamborghini/veneno_roadster/veneno-04.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(133,25,'coches/lamborghini/veneno_roadster/veneno-05.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(134,25,'coches/lamborghini/veneno_roadster/veneno-06.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(135,25,'coches/lamborghini/veneno_roadster/veneno-escaparate.png',1,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(136,44,'coches/mclaren/600lt/600lt-01.jpg',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(137,44,'coches/mclaren/600lt/600lt-02.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(138,44,'coches/mclaren/600lt/600lt-03.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(139,44,'coches/mclaren/600lt/600lt-04.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(140,44,'coches/mclaren/600lt/600lt-05.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(141,44,'coches/mclaren/600lt/600lt-escaparate.png',1,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(142,41,'coches/mclaren/675lt/675lt-01.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(143,41,'coches/mclaren/675lt/675lt-02.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(144,41,'coches/mclaren/675lt/675lt-03.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(145,41,'coches/mclaren/675lt/675lt-04.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(146,41,'coches/mclaren/675lt/675lt-05.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(147,41,'coches/mclaren/675lt/675lt-escaparate.png',1,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(148,40,'coches/mclaren/720s/720s-01.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(149,40,'coches/mclaren/720s/720s-02.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(150,40,'coches/mclaren/720s/720s-03.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(151,40,'coches/mclaren/720s/720s-04.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(152,40,'coches/mclaren/720s/720s-05.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(153,40,'coches/mclaren/720s/720s-escaparate.png',1,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(154,38,'coches/mclaren/765lt/765lt-01.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(155,38,'coches/mclaren/765lt/765lt-02.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(156,38,'coches/mclaren/765lt/765lt-03.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(157,38,'coches/mclaren/765lt/765lt-04.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(158,38,'coches/mclaren/765lt/765lt-escaparate.png',1,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(159,39,'coches/mclaren/f1/f1-01.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(160,39,'coches/mclaren/f1/f1-02.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(161,39,'coches/mclaren/f1/f1-03.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(162,39,'coches/mclaren/f1/f1-04.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(163,39,'coches/mclaren/f1/f1-escaparate.png',1,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(164,43,'coches/mclaren/p1/p1-01.jpg',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(165,43,'coches/mclaren/p1/p1-02.jpg',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(166,43,'coches/mclaren/p1/p1-03.jpg',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(167,43,'coches/mclaren/p1/p1-04.jpg',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(168,43,'coches/mclaren/p1/p1-05.jpg',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(169,43,'coches/mclaren/p1/p1-escaparate.jpg',1,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(170,42,'coches/mclaren/p1_gtr/p1-gtr-01.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(171,42,'coches/mclaren/p1_gtr/p1-gtr-02.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(172,42,'coches/mclaren/p1_gtr/p1-gtr-03.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(173,42,'coches/mclaren/p1_gtr/p1-gtr-04.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(174,42,'coches/mclaren/p1_gtr/p1-gtr-escaparate.png',1,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(175,37,'coches/mclaren/senna/senna-01.jpg',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(176,37,'coches/mclaren/senna/senna-02.jpg',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(177,37,'coches/mclaren/senna/senna-03.jpg',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(178,37,'coches/mclaren/senna/senna-04.jpg',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(179,37,'coches/mclaren/senna/senna-05.jpg',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(180,37,'coches/mclaren/senna/senna-escaparate.jpg',1,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(181,85,'coches/mercedes/amg_e63/amg-e63-01.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(182,85,'coches/mercedes/amg_e63/amg-e63-02.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(183,85,'coches/mercedes/amg_e63/amg-e63-03.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(184,85,'coches/mercedes/amg_e63/amg-e63-04.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(185,85,'coches/mercedes/amg_e63/amg-e63-05.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(186,85,'coches/mercedes/amg_e63/amg-e63-06.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(187,85,'coches/mercedes/amg_e63/amg-e63-escaparate.png',1,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(188,82,'coches/mercedes/amg_g63/amg-g63-01.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(189,82,'coches/mercedes/amg_g63/amg-g63-02.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(190,82,'coches/mercedes/amg_g63/amg-g63-03.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(191,82,'coches/mercedes/amg_g63/amg-g63-04.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(192,82,'coches/mercedes/amg_g63/amg-g63-05.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(193,82,'coches/mercedes/amg_g63/amg-g63-06.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(194,82,'coches/mercedes/amg_g63/amg-g63-escaparate.png',1,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(195,86,'coches/mercedes/amg_gt63_s_e_performance/amg-gt63-s-e-performance-01.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(196,86,'coches/mercedes/amg_gt63_s_e_performance/amg-gt63-s-e-performance-02.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(197,86,'coches/mercedes/amg_gt63_s_e_performance/amg-gt63-s-e-performance-03.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(198,86,'coches/mercedes/amg_gt63_s_e_performance/amg-gt63-s-e-performance-04.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(199,86,'coches/mercedes/amg_gt63_s_e_performance/amg-gt63-s-e-performance-05.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(200,86,'coches/mercedes/amg_gt63_s_e_performance/amg-gt63-s-e-performance-escaparate.png',1,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(201,81,'coches/mercedes/amg_gt_black_series/amg-gt-black-series-01.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(202,81,'coches/mercedes/amg_gt_black_series/amg-gt-black-series-02.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(203,81,'coches/mercedes/amg_gt_black_series/amg-gt-black-series-03.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(204,81,'coches/mercedes/amg_gt_black_series/amg-gt-black-series-04.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(205,81,'coches/mercedes/amg_gt_black_series/amg-gt-black-series-05.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(206,81,'coches/mercedes/amg_gt_black_series/amg-gt-black-series-escaparate.png',1,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(207,83,'coches/mercedes/amg_one/amg-one-01.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(208,83,'coches/mercedes/amg_one/amg-one-02.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(209,83,'coches/mercedes/amg_one/amg-one-03.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(210,83,'coches/mercedes/amg_one/amg-one-04.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(211,83,'coches/mercedes/amg_one/amg-one-escaparate.png',1,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(212,84,'coches/mercedes/amg_sl_63/amg-sl-63-01.jpg',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(213,84,'coches/mercedes/amg_sl_63/amg-sl-63-02.jpg',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(214,84,'coches/mercedes/amg_sl_63/amg-sl-63-03.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(215,84,'coches/mercedes/amg_sl_63/amg-sl-63-04.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(216,84,'coches/mercedes/amg_sl_63/amg-sl-63-05.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(217,84,'coches/mercedes/amg_sl_63/amg-sl-63-escaparate.jpg',1,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(218,80,'coches/nissan/350z_z30_wide_body/350z-z30-wide-body-01.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(219,80,'coches/nissan/350z_z30_wide_body/350z-z30-wide-body-02.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(220,80,'coches/nissan/350z_z30_wide_body/350z-z30-wide-body-03.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(221,80,'coches/nissan/350z_z30_wide_body/350z-z30-wide-body-04.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(222,80,'coches/nissan/350z_z30_wide_body/350z-z30-wide-body-05.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(223,80,'coches/nissan/350z_z30_wide_body/350z-z30-wide-body-escaparate.png',1,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(224,77,'coches/nissan/370z/370z-01.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(225,77,'coches/nissan/370z/370z-02.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(226,77,'coches/nissan/370z/370z-03.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(227,77,'coches/nissan/370z/370z-04.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(228,77,'coches/nissan/370z/370z-05.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(229,77,'coches/nissan/370z/370z-escaparate.png',1,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(230,75,'coches/nissan/gt_r_r35/gt-r-r35-01.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(231,75,'coches/nissan/gt_r_r35/gt-r-r35-02.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(232,75,'coches/nissan/gt_r_r35/gt-r-r35-03.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(233,75,'coches/nissan/gt_r_r35/gt-r-r35-04.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(234,75,'coches/nissan/gt_r_r35/gt-r-r35-05.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(235,75,'coches/nissan/gt_r_r35/gt-r-r35-escaparate.png',1,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(236,78,'coches/nissan/silvia_s15/silvia-01.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(237,78,'coches/nissan/silvia_s15/silvia-02.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(238,78,'coches/nissan/silvia_s15/silvia-03.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(239,78,'coches/nissan/silvia_s15/silvia-04.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(240,78,'coches/nissan/silvia_s15/silvia-escaparate.png',1,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(241,79,'coches/nissan/skyline_gt_r_r32/skyline-gt-r-r32-01.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(242,79,'coches/nissan/skyline_gt_r_r32/skyline-gt-r-r32-02.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(243,79,'coches/nissan/skyline_gt_r_r32/skyline-gt-r-r32-03.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(244,79,'coches/nissan/skyline_gt_r_r32/skyline-gt-r-r32-04.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(245,79,'coches/nissan/skyline_gt_r_r32/skyline-gt-r-r32-05.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(246,79,'coches/nissan/skyline_gt_r_r32/skyline-gt-r-r32-escaparate.png',1,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(247,76,'coches/nissan/skyline_gt_r_r34/skyline-gt-r-r34-01.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(248,76,'coches/nissan/skyline_gt_r_r34/skyline-gt-r-r34-02.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(249,76,'coches/nissan/skyline_gt_r_r34/skyline-gt-r-r34-03.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(250,76,'coches/nissan/skyline_gt_r_r34/skyline-gt-r-r34-04.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(251,76,'coches/nissan/skyline_gt_r_r34/skyline-gt-r-r34-05.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(252,76,'coches/nissan/skyline_gt_r_r34/skyline-gt-r-r34-escaparate.png',1,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(253,62,'coches/pagani/huayra_bc/huayra-bc-01.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(254,62,'coches/pagani/huayra_bc/huayra-bc-02.jpg',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(255,62,'coches/pagani/huayra_bc/huayra-bc-03.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(256,62,'coches/pagani/huayra_bc/huayra-bc-04.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(257,62,'coches/pagani/huayra_bc/huayra-bc-05.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(258,62,'coches/pagani/huayra_bc/huayra-bc-06.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(259,62,'coches/pagani/huayra_bc/huayra-bc-escaparate.png',1,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(260,58,'coches/pagani/huayra_r/huayra-r-01.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(261,58,'coches/pagani/huayra_r/huayra-r-02.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(262,58,'coches/pagani/huayra_r/huayra-r-03.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(263,58,'coches/pagani/huayra_r/huayra-r-04.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(264,58,'coches/pagani/huayra_r/huayra-r-05.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(265,58,'coches/pagani/huayra_r/huayra-r-escaparate.png',1,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(266,60,'coches/pagani/imola/imola-01.jpg',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(267,60,'coches/pagani/imola/imola-02.jpg',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(268,60,'coches/pagani/imola/imola-03.jpg',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(269,60,'coches/pagani/imola/imola-04.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(270,60,'coches/pagani/imola/imola-05.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(271,60,'coches/pagani/imola/imola-escaparate.jpg',1,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(272,59,'coches/pagani/utopia/utopia-01.jpg',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(273,59,'coches/pagani/utopia/utopia-02.jpg',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(274,59,'coches/pagani/utopia/utopia-03.jpg',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(275,59,'coches/pagani/utopia/utopia-04.jpg',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(276,59,'coches/pagani/utopia/utopia-05.jpg',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(277,59,'coches/pagani/utopia/utopia-escaparate.jpg',1,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(278,57,'coches/pagani/zonda_r/zonda-r-01.jpg',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(279,57,'coches/pagani/zonda_r/zonda-r-02.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(280,57,'coches/pagani/zonda_r/zonda-r-03.jpg',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(281,57,'coches/pagani/zonda_r/zonda-r-04.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(282,57,'coches/pagani/zonda_r/zonda-r-05.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(283,57,'coches/pagani/zonda_r/zonda-r-06.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(284,57,'coches/pagani/zonda_r/zonda-r-escaparate.jpg',1,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(285,61,'coches/pagani/zonda_revolucion/zonda-revolucion-01.jpg',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(286,61,'coches/pagani/zonda_revolucion/zonda-revolucion-02.jpg',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(287,61,'coches/pagani/zonda_revolucion/zonda-revolucion-03.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(288,61,'coches/pagani/zonda_revolucion/zonda-revolucion-04.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(289,61,'coches/pagani/zonda_revolucion/zonda-revolucion-05.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(290,61,'coches/pagani/zonda_revolucion/zonda-revolucion-06.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(291,61,'coches/pagani/zonda_revolucion/zonda-revolucion-escaparate.jpg',1,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(292,47,'coches/porsche/718_cayman_gt4_rs/718-cayman-01.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(293,47,'coches/porsche/718_cayman_gt4_rs/718-cayman-02.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(294,47,'coches/porsche/718_cayman_gt4_rs/718-cayman-03.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(295,47,'coches/porsche/718_cayman_gt4_rs/718-cayman-04.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(296,47,'coches/porsche/718_cayman_gt4_rs/718-cayman-05.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(297,47,'coches/porsche/718_cayman_gt4_rs/718-cayman-escaparate.png',1,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(298,46,'coches/porsche/911_964_turbo/911-964-01.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(299,46,'coches/porsche/911_964_turbo/911-964-02.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(300,46,'coches/porsche/911_964_turbo/911-964-03.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(301,46,'coches/porsche/911_964_turbo/911-964-04.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(302,46,'coches/porsche/911_964_turbo/911-964-05.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(303,46,'coches/porsche/911_964_turbo/911-964-escaparate.png',1,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(304,45,'coches/porsche/911_gt3_rs/911-gt3-01.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(305,45,'coches/porsche/911_gt3_rs/911-gt3-02.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(306,45,'coches/porsche/911_gt3_rs/911-gt3-03.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(307,45,'coches/porsche/911_gt3_rs/911-gt3-04.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(308,45,'coches/porsche/911_gt3_rs/911-gt3-escaparate.png',1,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(309,49,'coches/porsche/918_spyder/918-spyder-01.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(310,49,'coches/porsche/918_spyder/918-spyder-02.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(311,49,'coches/porsche/918_spyder/918-spyder-03.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(312,49,'coches/porsche/918_spyder/918-spyder-04.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(313,49,'coches/porsche/918_spyder/918-spyder-05.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(314,49,'coches/porsche/918_spyder/918-spyder-06.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(315,49,'coches/porsche/918_spyder/918-spyder-escaparate.png',1,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(316,48,'coches/porsche/935/935-01.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(317,48,'coches/porsche/935/935-02.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(318,48,'coches/porsche/935/935-03.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(319,48,'coches/porsche/935/935-04.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(320,48,'coches/porsche/935/935-escaparate.png',1,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(321,50,'coches/porsche/carrera_gt/carrera-gt-01.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(322,50,'coches/porsche/carrera_gt/carrera-gt-02.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(323,50,'coches/porsche/carrera_gt/carrera-gt-03.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(324,50,'coches/porsche/carrera_gt/carrera-gt-04.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(325,50,'coches/porsche/carrera_gt/carrera-gt-05.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(326,50,'coches/porsche/carrera_gt/carrera-gt-06.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(327,50,'coches/porsche/carrera_gt/carrera-gt-escaparate.png',1,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(328,73,'coches/toyota/camry/camry-01.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(329,73,'coches/toyota/camry/camry-02.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(330,73,'coches/toyota/camry/camry-03.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(331,73,'coches/toyota/camry/camry-04.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(332,73,'coches/toyota/camry/camry-escaparate.jpg',1,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(333,74,'coches/toyota/century/century-01.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(334,74,'coches/toyota/century/century-02.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(335,74,'coches/toyota/century/century-03.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(336,74,'coches/toyota/century/century-04.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(337,74,'coches/toyota/century/century-05.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(338,74,'coches/toyota/century/century-escaparate.png',1,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(339,72,'coches/toyota/gt86/gt86-01.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(340,72,'coches/toyota/gt86/gt86-02.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(341,72,'coches/toyota/gt86/gt86-03.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(342,72,'coches/toyota/gt86/gt86-04.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(343,72,'coches/toyota/gt86/gt86-05.jpg',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(344,72,'coches/toyota/gt86/gt86-escaparate.png',1,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(345,71,'coches/toyota/rav4_trd_off_road/rav4-01.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(346,71,'coches/toyota/rav4_trd_off_road/rav4-02.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(347,71,'coches/toyota/rav4_trd_off_road/rav4-03.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(348,71,'coches/toyota/rav4_trd_off_road/rav4-04.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(349,71,'coches/toyota/rav4_trd_off_road/rav4-05.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(350,71,'coches/toyota/rav4_trd_off_road/rav4-06.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(351,71,'coches/toyota/rav4_trd_off_road/rav4-escaparate.png',1,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(352,70,'coches/toyota/supra_mk4_hycade_stage_1/supra-mk4-01.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(353,70,'coches/toyota/supra_mk4_hycade_stage_1/supra-mk4-02.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(354,70,'coches/toyota/supra_mk4_hycade_stage_1/supra-mk4-03.png',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(355,70,'coches/toyota/supra_mk4_hycade_stage_1/supra-mk4-escaparate.png',1,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(356,69,'coches/toyota/supra_mk5/supra-mk5-01.jpg',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(357,69,'coches/toyota/supra_mk5/supra-mk5-02.jpg',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(358,69,'coches/toyota/supra_mk5/supra-mk5-03.jpg',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(359,69,'coches/toyota/supra_mk5/supra-mk5-04.jpg',0,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(360,69,'coches/toyota/supra_mk5/supra-mk5-escaparate.jpg',1,'2026-04-12 09:05:01','2026-04-12 10:22:32'),(361,87,'coches/bugatti/bolide/bolide-01.jpg',0,'2026-04-12 10:22:31','2026-04-12 10:22:31'),(362,87,'coches/bugatti/bolide/bolide-02.jpg',0,'2026-04-12 10:22:31','2026-04-12 10:22:31'),(363,87,'coches/bugatti/bolide/bolide-03.jpg',0,'2026-04-12 10:22:31','2026-04-12 10:22:31'),(364,87,'coches/bugatti/bolide/bolide-04.png',0,'2026-04-12 10:22:31','2026-04-12 10:22:31'),(365,87,'coches/bugatti/bolide/bolide-05.png',0,'2026-04-12 10:22:31','2026-04-12 10:22:31'),(366,87,'coches/bugatti/bolide/bolide-06.png',0,'2026-04-12 10:22:31','2026-04-12 10:22:31'),(367,87,'coches/bugatti/bolide/bolide-escaparate.jpg',1,'2026-04-12 10:22:31','2026-04-12 10:22:31'),(368,92,'coches/bugatti/centodieci/centodieci-01.png',0,'2026-04-12 10:22:31','2026-04-12 10:22:31'),(369,92,'coches/bugatti/centodieci/centodieci-02.png',0,'2026-04-12 10:22:31','2026-04-12 10:22:31'),(370,92,'coches/bugatti/centodieci/centodieci-03.png',0,'2026-04-12 10:22:31','2026-04-12 10:22:31'),(371,92,'coches/bugatti/centodieci/centodieci-04.png',0,'2026-04-12 10:22:31','2026-04-12 10:22:31'),(372,92,'coches/bugatti/centodieci/centodieci-05.jpg',0,'2026-04-12 10:22:31','2026-04-12 10:22:31'),(373,92,'coches/bugatti/centodieci/centodieci-06.png',0,'2026-04-12 10:22:31','2026-04-12 10:22:31'),(374,92,'coches/bugatti/centodieci/centodieci-07.png',0,'2026-04-12 10:22:31','2026-04-12 10:22:31'),(375,92,'coches/bugatti/centodieci/centodieci-escaparate.png',1,'2026-04-12 10:22:31','2026-04-12 10:22:31'),(376,89,'coches/bugatti/chiron/chiron-01.jpg',0,'2026-04-12 10:22:31','2026-04-12 10:22:31'),(377,89,'coches/bugatti/chiron/chiron-02.jpg',0,'2026-04-12 10:22:31','2026-04-12 10:22:31'),(378,89,'coches/bugatti/chiron/chiron-03.jpg',0,'2026-04-12 10:22:31','2026-04-12 10:22:31'),(379,89,'coches/bugatti/chiron/chiron-04.jpg',0,'2026-04-12 10:22:31','2026-04-12 10:22:31'),(380,89,'coches/bugatti/chiron/chiron-05.jpg',0,'2026-04-12 10:22:31','2026-04-12 10:22:31'),(381,89,'coches/bugatti/chiron/chiron-escaparate.png',1,'2026-04-12 10:22:31','2026-04-12 10:22:31'),(382,88,'coches/bugatti/chiron_super_sport_300/chiron-super-sport-300-01.jpg',0,'2026-04-12 10:22:31','2026-04-12 10:22:31'),(383,88,'coches/bugatti/chiron_super_sport_300/chiron-super-sport-300-02.jpg',0,'2026-04-12 10:22:31','2026-04-12 10:22:31'),(384,88,'coches/bugatti/chiron_super_sport_300/chiron-super-sport-300-03.jpg',0,'2026-04-12 10:22:31','2026-04-12 10:22:31'),(385,88,'coches/bugatti/chiron_super_sport_300/chiron-super-sport-300-04.jpg',0,'2026-04-12 10:22:31','2026-04-12 10:22:31'),(386,88,'coches/bugatti/chiron_super_sport_300/chiron-super-sport-300-05.jpg',0,'2026-04-12 10:22:31','2026-04-12 10:22:31'),(387,88,'coches/bugatti/chiron_super_sport_300/chiron-super-sport-300-06.jpg',0,'2026-04-12 10:22:31','2026-04-12 10:22:31'),(388,88,'coches/bugatti/chiron_super_sport_300/chiron-super-sport-300-07.jpg',0,'2026-04-12 10:22:31','2026-04-12 10:22:31'),(389,88,'coches/bugatti/chiron_super_sport_300/chiron-super-sport-300-escaparate.jpg',1,'2026-04-12 10:22:31','2026-04-12 10:22:31'),(390,90,'coches/bugatti/la_voiture_noire/la-voiture-noire-01.png',0,'2026-04-12 10:22:31','2026-04-12 10:22:31'),(391,90,'coches/bugatti/la_voiture_noire/la-voiture-noire-02.png',0,'2026-04-12 10:22:31','2026-04-12 10:22:31'),(392,90,'coches/bugatti/la_voiture_noire/la-voiture-noire-03.png',0,'2026-04-12 10:22:31','2026-04-12 10:22:31'),(393,90,'coches/bugatti/la_voiture_noire/la-voiture-noire-04.png',0,'2026-04-12 10:22:31','2026-04-12 10:22:31'),(394,90,'coches/bugatti/la_voiture_noire/la-voiture-noire-05.png',0,'2026-04-12 10:22:31','2026-04-12 10:22:31'),(395,90,'coches/bugatti/la_voiture_noire/la-voiture-noire-06.jpg',0,'2026-04-12 10:22:31','2026-04-12 10:22:31'),(396,90,'coches/bugatti/la_voiture_noire/la-voiture-noire-escaparate.jpg',1,'2026-04-12 10:22:31','2026-04-12 10:22:31'),(397,91,'coches/bugatti/veyron_grand_sport_vitesse_la_finale/veyron-grand-sport-vitesse-01.png',0,'2026-04-12 10:22:31','2026-04-12 10:22:31'),(398,91,'coches/bugatti/veyron_grand_sport_vitesse_la_finale/veyron-grand-sport-vitesse-02.png',0,'2026-04-12 10:22:31','2026-04-12 10:22:31'),(399,91,'coches/bugatti/veyron_grand_sport_vitesse_la_finale/veyron-grand-sport-vitesse-03.png',0,'2026-04-12 10:22:31','2026-04-12 10:22:31'),(400,91,'coches/bugatti/veyron_grand_sport_vitesse_la_finale/veyron-grand-sport-vitesse-04.png',0,'2026-04-12 10:22:31','2026-04-12 10:22:31'),(401,91,'coches/bugatti/veyron_grand_sport_vitesse_la_finale/veyron-grand-sport-vitesse-05.png',0,'2026-04-12 10:22:31','2026-04-12 10:22:31'),(402,91,'coches/bugatti/veyron_grand_sport_vitesse_la_finale/veyron-grand-sport-vitesse-06.png',0,'2026-04-12 10:22:31','2026-04-12 10:22:31'),(403,91,'coches/bugatti/veyron_grand_sport_vitesse_la_finale/veyron-grand-sport-vitesse-escaparate.jpg',1,'2026-04-12 10:22:31','2026-04-12 10:22:31'),(405,43,'coches/mclaren/p1/p1-02.jpg',0,'2026-04-25 12:18:15','2026-04-25 12:18:15'),(406,43,'coches/mclaren/p1/p1-03.jpg',0,'2026-04-25 12:18:23','2026-04-25 12:18:23'),(407,43,'coches/mclaren/p1/p1-04.jpg',0,'2026-04-25 12:18:38','2026-04-25 12:18:38'),(408,43,'coches/mclaren/p1/p1-05.jpg',0,'2026-04-25 12:18:42','2026-04-25 12:18:42'),(409,43,'coches/mclaren/p1/p1-01.jpg',0,'2026-04-25 12:18:48','2026-04-25 12:18:48'),(410,43,'coches/mclaren/p1/p1-escaparate.jpg',1,'2026-04-25 12:18:59','2026-04-25 12:18:59');
/*!40000 ALTER TABLE `imagenes_vehiculos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_reserved_at_available_at_index` (`queue`,`reserved_at`,`available_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `marcas`
--

DROP TABLE IF EXISTS `marcas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `marcas` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `imagen_hero` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `slogan` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `anio_fundacion` int DEFAULT NULL,
  `pais` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `logo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `marcas`
--

LOCK TABLES `marcas` WRITE;
/*!40000 ALTER TABLE `marcas` DISABLE KEYS */;
INSERT INTO `marcas` VALUES (4,'Lamborghini','marcas/lamborghini/hero.png','Driving Humans Beyond',1963,'Italia','Automobili Lamborghini (fundada en 1963 por Ferruccio Lamborghini en Sant\'Agata Bolognese, Italia) es un fabricante icónico de superdeportivos de lujo reconocidos por su diseño radical, ángulos afilados, alto rendimiento y motores V12. La marca, parte del Grupo Volkswagen, encarna la fuerza y la pasión con su logo del toro, destacando por modelos como el Miura, Countach, Aventador y Urus.','logos/lamborghini.png',NULL,'2026-05-04 16:07:51'),(8,'BMW','marcas/bmw/hero.png','El placer de conducir',1916,'Alemania','BMW (Bayerische Motoren Werke), fundada en 1916 en Alemania, es un fabricante líder de automóviles y motocicletas de lujo, conocido por su ingeniería de precisión, diseño deportivo y alto rendimiento. Con sede en Múnich, el grupo también es dueño de Mini y Rolls-Royce, destacando por la innovación constante en su gama de vehículos.','logos/bmw.png','2026-04-11 07:31:51','2026-05-04 16:14:30'),(9,'McLaren','marcas/mclaren/hero.png','Fearlessly Forward',1963,'Reino Unido','McLaren es un reconocido fabricante británico de automóviles superdeportivos y de lujo, además de una escudería histórica de Fórmula 1 fundada en 1963 por Bruce McLaren. Conocidos por su ingeniería de precisión y alto rendimiento, utilizan tecnologías derivadas de las carreras, incluyendo chasis monocasco de fibra de carbono.','logos/mclaren.png','2026-04-11 07:38:01','2026-05-04 16:15:10'),(10,'Porsche','marcas/porsche/hero.png','Porsche, there is no substitute',1931,'Alemania','Porsche es una marca alemana de automóviles de lujo fundada en 1931 por Ferdinand Porsche, reconocida mundialmente por su excelencia en ingeniería, alto rendimiento y diseño deportivo. Famosa por el icónico Porsche 911, la marca combina tradición, motor bóxer y versatilidad con modelos modernos como el eléctrico Taycan, SUV (Cayenne/Macan) y sedanes.','logos/porsche.png','2026-04-11 07:45:54','2026-05-04 16:15:52'),(11,'Audi','marcas/audi/hero.png','A la vanguardia de la técnica',1909,'Alemania','Audi es un prestigioso fabricante alemán de automóviles de lujo y alto rendimiento, fundado en 1909 por August Horch y parte del Grupo Volkswagen desde 1965. Su sede está en Ingolstadt, Alemania. El nombre Audi proviene del latín para escucha, una traducción de Horch en alemán. Los cuatro aros representan la fusión de cuatro marcas en 1932: Audi, Horch, DKW y Wanderer.','logos/audi.png','2026-04-11 07:50:33','2026-05-04 16:16:33'),(12,'Pagani','marcas/pagani/hero.png','Arte y Ciencia',1992,'Italia','Pagani es un fabricante italiano de superdeportivos de lujo y alto rendimiento, fundado en 1992 por el argentino-italiano Horacio Pagani en San Cesario sul Panaro, cerca de Módena. Reconocida mundialmente, la marca combina arte, ingeniería avanzada y fibra de carbono en modelos exclusivos y emblemáticos como el Zonda y el Huayra.','logos/pagani.png','2026-04-11 07:53:06','2026-05-04 16:17:10'),(13,'Ferrari','marcas/ferrari/hero.png','Somos la competencia',1947,'Italia','Ferrari es un fabricante italiano de automóviles superdeportivos de lujo y competición, fundado en 1929 por Enzo Ferrari en Maranello. Reconocida mundialmente por su logo del Cavallino Rampante, la marca nació de la división de carreras, la Scuderia Ferrari, y es conocida por sus motores V12 de alto rendimiento, su color rojo distintivo y su éxito en la Fórmula 1.','logos/ferrari.png','2026-04-11 07:55:14','2026-05-04 16:17:39'),(14,'Toyota','marcas/toyota/hero.png','Let\'s Go Places',1937,'Japón','Toyota Motor Corporation es una multinacional japonesa líder automotriz, fundada en 1937 por Kiichiro Toyoda con sede en Toyota City. Reconocida por su fiabilidad e innovación, es uno de los mayores fabricantes mundiales, pionera en tecnología híbrida y comprometida con la neutralidad de carbono. Comercializa vehículos bajo las marcas Toyota, Lexus, Daihatsu e Hino.','logos/toyota.png','2026-04-11 07:58:46','2026-05-04 16:18:05'),(15,'Nissan','marcas/nissan/hero.png','Innovation that excites',1933,'Japón','Nissan Motor Co., Ltd. es un destacado fabricante japonés de automóviles con sede en Yokohama, reconocido mundialmente por su innovación, ingeniería y tecnología, incluyendo sus motores e-POWER y vehículos eléctricos. Forma parte de la alianza Renault-Nissan-Mitsubishi y produce una amplia gama de vehículos, desde sedanes y SUVs hasta opciones de alto rendimiento (Nismo) y comerciales.','logos/nissan.png','2026-04-11 08:01:42','2026-05-04 16:18:39'),(16,'Mercedes-Benz','marcas/mercedes/hero.png','Das Beste oder nichts',1926,'Alemania','Mercedes-Benz es una marca alemana icónica de automóviles de lujo, vehículos comerciales y alto rendimiento, fundada en 1926 por pioneros como Karl Benz y Gottlieb Daimler. Reconocida por su lema lo mejor o nada, se destaca por la innovación en seguridad, diseño sofisticado, motores eficientes y tecnología avanzada, incluyendo una fuerte presencia eléctrica y en Fórmula 1.','logos/mercedes.png','2026-04-11 08:04:31','2026-05-04 16:19:15'),(17,'Bugatti','marcas/bugatti/hero.png','Create the Incomparable',1909,'Francia','Bugatti es una marca francesa de hiperdeportivos de ultra lujo y alto rendimiento, fundada en 1909 por Ettore Bugatti en Molsheim. Es reconocida mundialmente por fusionar ingeniería avanzada con arte, produciendo vehículos exclusivos, extremadamente rápidos y costosos, como los famosos modelos Veyron y Chiron, y es propiedad del Grupo Volkswagen desde 1998.','logos/bugatti.png','2026-04-11 08:06:40','2026-05-04 16:20:13');
/*!40000 ALTER TABLE `marcas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0000_00_00_000000_create_roles_table',1),(2,'0001_01_01_000000_create_users_table',1),(3,'0001_01_01_000001_create_cache_table',1),(4,'0001_01_01_000002_create_jobs_table',1),(5,'2026_03_16_151414_create_marcas_table',1),(6,'2026_03_16_151424_create_coches_table',1),(7,'2026_03_16_151430_create_financiaciones_table',1),(8,'2026_03_16_151436_create_servicios_table',1),(9,'2026_03_16_151445_create_citas_table',1),(10,'2026_03_18_152744_create_personal_access_tokens_table',1),(11,'2026_04_06_102205_create_imagenes_vehiculos_table',2),(12,'2026_04_11_104642_remove_imagen_from_coches_table',3),(13,'2026_05_04_090606_add_technical_fields_to_coches_table',4),(14,'2026_05_04_092627_add_custom_fields_to_marcas_table',5),(15,'2026_05_04_092827_add_destacado_to_coches_table',6),(16,'2026_05_11_124717_add_user_id_to_financiaciones_table',7);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
INSERT INTO `personal_access_tokens` VALUES (1,'App\\Models\\User',1,'api-token','fb15726e4a075e9cdde50004f942ce98becae3ef50be57c194a3025b2de035ce','[\"*\"]','2026-05-04 16:20:13',NULL,'2026-03-30 14:44:06','2026-05-04 16:20:13'),(2,'App\\Models\\User',2,'auth_token','3de7b646c0bf2003805613b0ed1a792424d195600d6324217ca08238324e8f4d','[\"*\"]',NULL,NULL,'2026-05-10 14:48:13','2026-05-10 14:48:13'),(3,'App\\Models\\User',2,'auth_token','af5eecd8e6069386af82d2a5b3c2fc50e90fe607286b728022476dc413670278','[\"*\"]',NULL,NULL,'2026-05-10 15:04:09','2026-05-10 15:04:09'),(4,'App\\Models\\User',2,'auth_token','74c2e39e5dbe125bbe208ef11938649fe408daffc9f0143290ecf04194b8845b','[\"*\"]',NULL,NULL,'2026-05-10 16:25:19','2026-05-10 16:25:19'),(5,'App\\Models\\User',2,'auth_token','8aa58af37c4ee5460cd2220e1ea26ee4a81f8208fe14549690071eb5ad90a9dc','[\"*\"]',NULL,NULL,'2026-05-10 16:28:03','2026-05-10 16:28:03'),(6,'App\\Models\\User',2,'auth_token','17a86ccb0a729be42ab8569264be34747ce70debd98a87748a07c6f29d5ee175','[\"*\"]',NULL,NULL,'2026-05-10 16:28:34','2026-05-10 16:28:34'),(7,'App\\Models\\User',2,'auth_token','3f738b45840eb2a1d7179899fda15efa650372356da98971afa40d1b3b47c27d','[\"*\"]',NULL,NULL,'2026-05-10 16:55:14','2026-05-10 16:55:14'),(8,'App\\Models\\User',2,'auth_token','ce393a2c214284c596b77d9aa932e7996d8f0ce6343ef69065455b446a603869','[\"*\"]',NULL,NULL,'2026-05-11 09:06:23','2026-05-11 09:06:23'),(9,'App\\Models\\User',2,'auth_token','8e630797cf6944d0a3815c2f420bd34d443933da246d0484bae713b89539dc13','[\"*\"]',NULL,NULL,'2026-05-11 09:08:30','2026-05-11 09:08:30'),(10,'App\\Models\\User',2,'auth_token','12db2f80360c25a6de4fd55f14dd6bf16b5e3ac0377b0568a2f2732789bce027','[\"*\"]',NULL,NULL,'2026-05-11 09:11:20','2026-05-11 09:11:20'),(11,'App\\Models\\User',2,'auth_token','4775298ebbf635892264e348f3876d81b3a3286d784f4302c713875424eb958b','[\"*\"]',NULL,NULL,'2026-05-11 09:12:20','2026-05-11 09:12:20'),(12,'App\\Models\\User',2,'auth_token','0ee3a66d1a5103638992b1dd1ac98b90947e2a401ce36c244d2affcec5f1f1d1','[\"*\"]',NULL,NULL,'2026-05-11 09:15:26','2026-05-11 09:15:26'),(15,'App\\Models\\User',4,'auth_token','521f28062ce4876e9ae93bbe1387ea582c7fadbd2768ea7f5b6025a2427ad2b6','[\"*\"]',NULL,NULL,'2026-05-11 16:37:30','2026-05-11 16:37:30');
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'cliente','Cliente estándar del concesionario','2026-03-30 14:41:02','2026-03-30 14:41:02'),(2,'admin','Administrador con acceso total','2026-03-30 14:41:02','2026-03-30 14:41:02'),(3,'empleado','Empleado del concesionario','2026-05-15 20:16:17','2026-05-15 20:16:17');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `servicios`
--

DROP TABLE IF EXISTS `servicios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `servicios` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `precio` decimal(8,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `servicios`
--

LOCK TABLES `servicios` WRITE;
/*!40000 ALTER TABLE `servicios` DISABLE KEYS */;
INSERT INTO `servicios` VALUES (1,'Prueba de Conducción','Prueba dinámica del vehículo acompañado por un asesor.',0.00,'2026-03-30 14:41:02','2026-03-30 14:41:02'),(2,'Revisión mecánica','Chequeo completo de 50 puntos clave del vehículo.',49.99,'2026-03-30 14:41:02','2026-03-30 14:41:02'),(3,'Tasación de vehículo','Valoración de tu coche actual como parte de pago.',0.00,'2026-03-30 14:41:02','2026-03-30 14:41:02');
/*!40000 ALTER TABLE `servicios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('ephdluFVksQTs3imp0xzFUXsoALZ4mNGE9znmERt',NULL,'127.0.0.1','PostmanRuntime/7.51.1','YTozOntzOjY6Il90b2tlbiI7czo0MDoiS05INU5YcmlQQUVlcjF2VUhOSFo3dGVSQUlsdWJnVjdlcUk3eGJYbiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1778431173);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role_id` bigint unsigned NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_role_id_foreign` (`role_id`),
  CONSTRAINT `users_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Raul Zaldua','raul@example.com',NULL,'$2y$12$JNM0TOnSZKkqOTxklJhf1uQaxL0tOiSfTRtTsIJVU1NGbt5PckJ82',2,NULL,'2026-03-30 14:41:18','2026-03-30 14:42:12'),(2,'Test User','test@test.com',NULL,'$2y$12$f0OLvqS5MYMgjkc9ikEEjuight.bmca.cWknC75gSYIxuGyHLwSua',2,NULL,'2026-05-10 14:47:12','2026-05-10 14:47:12'),(3,'Raul','zalduaraul05@gmail.com',NULL,'$2y$12$cLYv6GvxWKeCgsgTW5CWFuSK0L9FoHbCYooBDyAyDgZk8Tb5ELZiG',1,NULL,'2026-05-11 16:32:00','2026-05-11 16:32:00'),(4,'Raul','zalduaraul11@gmail.com',NULL,'$2y$12$Rm3LJxECwVqf3JT1qU4xMe7sAenKGxNTMaWIsv2iY89sH5Eh8uJfq',2,NULL,'2026-05-11 16:37:29','2026-05-11 16:37:29'),(5,'Raul','zalduaraul02@gmail.com',NULL,'$2y$12$CxXngpPAQ44889cD.DsXbeXUOgTB4yNeiiQKwbSggSSK9ccyyvJjm',1,NULL,'2026-05-11 16:40:11','2026-05-11 16:40:11'),(6,'qwrwer','zalduaraul01@gmail.com',NULL,'$2y$12$wJBf8FJX/MPQvPrBtLGmOecn5Sl3ZZlmHMPWSImOXf4Pma3S2GgKa',3,NULL,'2026-05-14 14:41:09','2026-05-14 14:41:09');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-15 23:24:49
