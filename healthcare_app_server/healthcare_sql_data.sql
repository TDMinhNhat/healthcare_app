-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               11.5.2-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for admin_service
DROP DATABASE IF EXISTS `admin_service`;
CREATE DATABASE IF NOT EXISTS `admin_service` /*!40100 DEFAULT CHARACTER SET utf8mb3 COLLATE utf8mb3_bin */;
USE `admin_service`;

-- Dumping structure for table admin_service.addresses
DROP TABLE IF EXISTS `addresses`;
CREATE TABLE IF NOT EXISTS `addresses` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `city` varchar(100) DEFAULT NULL,
  `country` varchar(50) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `district` varchar(100) DEFAULT NULL,
  `number` varchar(255) DEFAULT NULL,
  `street` varchar(100) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `ward` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

-- Dumping data for table admin_service.addresses: ~70 rows (approximately)
DELETE FROM `addresses`;
INSERT INTO `addresses` (`id`, `city`, `country`, `created_at`, `district`, `number`, `street`, `updated_at`, `ward`) VALUES
	(1, NULL, NULL, '2025-03-04 18:05:17.431591', NULL, NULL, NULL, NULL, NULL),
	(2, 'North Gertude', 'Cocos (Keeling) Islands', '2025-03-04 18:05:17.514413', 'Beahan Stream No District', '541', 'Beahan Stream', NULL, 'Beahan Stream No Ward'),
	(3, 'South Aide', 'Paraguay', '2025-03-04 18:05:17.550407', 'Victor Trail No District', '273', 'Victor Trail', NULL, 'Victor Trail No Ward'),
	(4, 'Reichelton', 'Guatemala', '2025-03-04 18:05:17.559946', 'Rempel Ramp No District', '497', 'Rempel Ramp', NULL, 'Rempel Ramp No Ward'),
	(5, NULL, NULL, '2025-03-04 18:05:17.580475', NULL, NULL, NULL, NULL, NULL),
	(6, 'North Rickyfort', 'Guernsey', '2025-03-04 18:05:17.586517', 'Hipolito Squares No District', '384', 'Hipolito Squares', NULL, 'Hipolito Squares No Ward'),
	(7, 'Kamhaven', 'Pitcairn Islands', '2025-03-04 18:05:17.597067', 'Champlin Island No District', '458', 'Champlin Island', NULL, 'Champlin Island No Ward'),
	(8, 'Hyattstad', 'Zimbabwe', '2025-03-04 18:05:17.605618', 'Norman Drive No District', '488', 'Norman Drive', NULL, 'Norman Drive No Ward'),
	(9, NULL, NULL, '2025-03-04 18:05:17.624270', NULL, NULL, NULL, NULL, NULL),
	(10, 'New Olympiamouth', 'Qatar', '2025-03-04 18:05:17.630263', 'Gerri Turnpike No District', '341', 'Gerri Turnpike', NULL, 'Gerri Turnpike No Ward'),
	(11, 'Traceetown', 'Mauritius', '2025-03-04 18:05:17.638793', 'Connelly Key No District', '358', 'Connelly Key', NULL, 'Connelly Key No Ward'),
	(12, 'Port Jaimeechester', 'Falkland Islands (Malvinas)', '2025-03-04 18:05:17.650326', 'Cristi Orchard No District', '516', 'Cristi Orchard', NULL, 'Cristi Orchard No Ward'),
	(13, NULL, NULL, '2025-03-04 18:05:17.671418', NULL, NULL, NULL, NULL, NULL),
	(14, 'Hortensiabury', 'Nauru', '2025-03-04 18:05:17.680477', 'Kenisha Crossroad No District', '844', 'Kenisha Crossroad', NULL, 'Kenisha Crossroad No Ward'),
	(15, 'South Leifstad', 'Singapore', '2025-03-04 18:05:17.689002', 'Ankunding Road No District', '39', 'Ankunding Road', NULL, 'Ankunding Road No Ward'),
	(16, 'West Vanitaborough', 'Liberia', '2025-03-04 18:05:17.698541', 'Gerardo Harbor No District', '749', 'Gerardo Harbor', NULL, 'Gerardo Harbor No Ward'),
	(17, NULL, NULL, '2025-03-04 18:05:17.718136', NULL, NULL, NULL, NULL, NULL),
	(18, 'Divinamouth', 'Japan', '2025-03-04 18:05:17.724209', 'Evelyne Flats No District', '66', 'Evelyne Flats', NULL, 'Evelyne Flats No Ward'),
	(19, 'East Phylicia', 'Slovenia', '2025-03-04 18:05:17.733737', 'Tracey Stream No District', '891', 'Tracey Stream', NULL, 'Tracey Stream No Ward'),
	(20, 'Lynnamouth', 'Singapore', '2025-03-04 18:05:17.741281', 'Langosh Spur No District', '634', 'Langosh Spur', NULL, 'Langosh Spur No Ward'),
	(21, NULL, NULL, '2025-03-04 18:05:17.757917', NULL, NULL, NULL, NULL, NULL),
	(22, 'Towneview', 'Republic of Korea', '2025-03-04 18:05:17.764454', 'Hermiston Canyon No District', '518', 'Hermiston Canyon', NULL, 'Hermiston Canyon No Ward'),
	(23, 'Port Rogelioville', 'Vanuatu', '2025-03-04 18:05:17.770995', 'Hilton Pike No District', '621', 'Hilton Pike', NULL, 'Hilton Pike No Ward'),
	(24, 'West Nikia', 'United States of America', '2025-03-04 18:05:17.781531', 'Ray Locks No District', '362', 'Ray Locks', NULL, 'Ray Locks No Ward'),
	(25, NULL, NULL, '2025-03-04 18:05:17.798584', NULL, NULL, NULL, NULL, NULL),
	(26, 'Goodwinberg', 'Saint Martin', '2025-03-04 18:05:17.804106', 'Jasmin Loaf No District', '984', 'Jasmin Loaf', NULL, 'Jasmin Loaf No Ward'),
	(27, 'Willbury', 'Virgin Islands, British', '2025-03-04 18:05:17.813125', 'Georgine Valley No District', '336', 'Georgine Valley', NULL, 'Georgine Valley No Ward'),
	(28, 'Bergstromfurt', 'Albania', '2025-03-04 18:05:17.820331', 'Schowalter Ridge No District', '930', 'Schowalter Ridge', NULL, 'Schowalter Ridge No Ward'),
	(29, NULL, NULL, '2025-03-04 18:05:17.841450', NULL, NULL, NULL, NULL, NULL),
	(30, 'East Adrianshire', 'Cocos (Keeling) Islands', '2025-03-04 18:05:17.848108', 'Demarcus Lock No District', '464', 'Demarcus Lock', NULL, 'Demarcus Lock No Ward'),
	(31, 'Lake Norris', 'Antigua and Barbuda', '2025-03-04 18:05:17.858635', 'Ambrose Estates No District', '694', 'Ambrose Estates', NULL, 'Ambrose Estates No Ward'),
	(32, 'New Dustybury', 'Samoa', '2025-03-04 18:05:17.866633', 'Norris Neck No District', '139', 'Norris Neck', NULL, 'Norris Neck No Ward'),
	(33, NULL, NULL, '2025-03-04 18:05:17.885515', NULL, NULL, NULL, NULL, NULL),
	(34, 'Noeport', 'Cape Verde', '2025-03-04 18:05:17.892846', 'Mayert Square No District', '385', 'Mayert Square', NULL, 'Mayert Square No Ward'),
	(35, 'Bobbiehaven', 'Tuvalu', '2025-03-04 18:05:17.902358', 'Virgen Camp No District', '856', 'Virgen Camp', NULL, 'Virgen Camp No Ward'),
	(36, 'Gordonfort', 'Tunisia', '2025-03-04 18:05:17.911889', 'Pagac Motorway No District', '383', 'Pagac Motorway', NULL, 'Pagac Motorway No Ward'),
	(37, NULL, NULL, '2025-03-04 18:05:17.930439', NULL, NULL, NULL, NULL, NULL),
	(38, 'West Vivianhaven', 'Anguilla', '2025-03-04 18:05:17.937526', 'Marquardt Plains No District', '987', 'Marquardt Plains', NULL, 'Marquardt Plains No Ward'),
	(39, 'New Breann', 'Bhutan', '2025-03-04 18:05:17.946636', 'Schuster Fort No District', '24', 'Schuster Fort', NULL, 'Schuster Fort No Ward'),
	(40, 'Port Solomonmouth', 'Ecuador', '2025-03-04 18:05:17.954708', 'Effertz Falls No District', '388', 'Effertz Falls', NULL, 'Effertz Falls No Ward'),
	(41, NULL, NULL, '2025-03-04 18:20:50.458047', NULL, NULL, NULL, NULL, NULL),
	(42, NULL, NULL, '2025-03-04 18:20:50.517828', NULL, NULL, NULL, NULL, NULL),
	(43, NULL, NULL, '2025-03-04 18:20:50.527399', NULL, NULL, NULL, NULL, NULL),
	(44, NULL, NULL, '2025-03-04 18:20:50.536901', NULL, NULL, NULL, NULL, NULL),
	(45, NULL, NULL, '2025-03-04 18:20:50.547442', NULL, NULL, NULL, NULL, NULL),
	(46, NULL, NULL, '2025-03-04 18:20:50.556452', NULL, NULL, NULL, NULL, NULL),
	(47, NULL, NULL, '2025-03-04 18:20:50.565585', NULL, NULL, NULL, NULL, NULL),
	(48, NULL, NULL, '2025-03-04 18:20:50.576123', NULL, NULL, NULL, NULL, NULL),
	(49, NULL, NULL, '2025-03-04 18:20:50.585693', NULL, NULL, NULL, NULL, NULL),
	(50, NULL, NULL, '2025-03-04 18:20:50.594227', NULL, NULL, NULL, NULL, NULL),
	(51, NULL, NULL, '2025-03-04 18:20:50.604747', NULL, NULL, NULL, NULL, NULL),
	(52, NULL, NULL, '2025-03-04 18:20:50.615807', NULL, NULL, NULL, NULL, NULL),
	(53, NULL, NULL, '2025-03-04 18:20:50.628338', NULL, NULL, NULL, NULL, NULL),
	(54, NULL, NULL, '2025-03-04 18:20:50.638873', NULL, NULL, NULL, NULL, NULL),
	(55, NULL, NULL, '2025-03-04 18:20:50.650415', NULL, NULL, NULL, NULL, NULL),
	(56, NULL, NULL, '2025-03-04 18:20:50.660941', NULL, NULL, NULL, NULL, NULL),
	(57, NULL, NULL, '2025-03-04 18:20:50.671026', NULL, NULL, NULL, NULL, NULL),
	(58, NULL, NULL, '2025-03-04 18:20:50.680071', NULL, NULL, NULL, NULL, NULL),
	(59, NULL, NULL, '2025-03-04 18:20:50.690126', NULL, NULL, NULL, NULL, NULL),
	(60, NULL, NULL, '2025-03-04 18:20:50.699103', NULL, NULL, NULL, NULL, NULL),
	(61, NULL, NULL, '2025-03-04 18:20:50.707619', NULL, NULL, NULL, NULL, NULL),
	(62, NULL, NULL, '2025-03-04 18:20:50.714633', NULL, NULL, NULL, NULL, NULL),
	(63, NULL, NULL, '2025-03-04 18:20:50.723166', NULL, NULL, NULL, NULL, NULL),
	(64, NULL, NULL, '2025-03-04 18:20:50.730111', NULL, NULL, NULL, NULL, NULL),
	(65, NULL, NULL, '2025-03-04 18:20:50.738105', NULL, NULL, NULL, NULL, NULL),
	(66, NULL, NULL, '2025-03-04 18:20:50.746613', NULL, NULL, NULL, NULL, NULL),
	(67, NULL, NULL, '2025-03-04 18:20:50.756140', NULL, NULL, NULL, NULL, NULL),
	(68, NULL, NULL, '2025-03-04 18:20:50.763485', NULL, NULL, NULL, NULL, NULL),
	(69, NULL, NULL, '2025-03-04 18:20:50.771483', NULL, NULL, NULL, NULL, NULL),
	(70, NULL, NULL, '2025-03-04 18:20:50.781057', NULL, NULL, NULL, NULL, NULL);

-- Dumping structure for table admin_service.admins
DROP TABLE IF EXISTS `admins`;
CREATE TABLE IF NOT EXISTS `admins` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `avatar` varchar(500) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `dob` date NOT NULL,
  `email` varchar(200) NOT NULL,
  `email_verified` bit(1) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `sex` bit(1) NOT NULL,
  `status` bit(1) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `user_id` varchar(50) NOT NULL,
  `address_id` bigint(20) DEFAULT NULL,
  `authed_provider_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK47bvqemyk6vlm0w7crc3opdd4` (`email`),
  UNIQUE KEY `UKpiovo1hsx7hi5f9ax85epqya9` (`user_id`),
  UNIQUE KEY `UK50fcivxhjyl86o4xam5sq0v2j` (`address_id`),
  KEY `FKdyc5pst6ok5n4t5jx2djo429x` (`authed_provider_id`),
  CONSTRAINT `FKd22ndptupnu1wj0fawg36qfmh` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`),
  CONSTRAINT `FKdyc5pst6ok5n4t5jx2djo429x` FOREIGN KEY (`authed_provider_id`) REFERENCES `authenticate_provider` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

-- Dumping data for table admin_service.admins: ~0 rows (approximately)
DELETE FROM `admins`;

-- Dumping structure for table admin_service.appointments
DROP TABLE IF EXISTS `appointments`;
CREATE TABLE IF NOT EXISTS `appointments` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `note` varchar(500) DEFAULT NULL,
  `room_id` varchar(50) NOT NULL,
  `status` tinyint(4) NOT NULL CHECK (`status` between 0 and 3),
  `work_schedule_id` bigint(20) NOT NULL,
  `patient_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK8exap5wmg8kmb1g1rx3by21yt` (`patient_id`),
  CONSTRAINT `FK8exap5wmg8kmb1g1rx3by21yt` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

-- Dumping data for table admin_service.appointments: ~0 rows (approximately)
DELETE FROM `appointments`;
INSERT INTO `appointments` (`id`, `created_at`, `note`, `room_id`, `status`, `work_schedule_id`, `patient_id`) VALUES
	(1, '2025-03-05 00:12:48.033277', 'null', '763722-05032025001247', 0, 1, 4);

-- Dumping structure for table admin_service.authenticate_provider
DROP TABLE IF EXISTS `authenticate_provider`;
CREATE TABLE IF NOT EXISTS `authenticate_provider` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `authen_name` varchar(100) NOT NULL,
  `status` bit(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKmch87ongxq9k1dysaggwe2ggf` (`authen_name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

-- Dumping data for table admin_service.authenticate_provider: ~0 rows (approximately)
DELETE FROM `authenticate_provider`;
INSERT INTO `authenticate_provider` (`id`, `authen_name`, `status`) VALUES
	(1, 'APPLICATION', b'1');

-- Dumping structure for table admin_service.doctors
DROP TABLE IF EXISTS `doctors`;
CREATE TABLE IF NOT EXISTS `doctors` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `avatar` varchar(500) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `dob` date NOT NULL,
  `email` varchar(200) NOT NULL,
  `email_verified` bit(1) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `sex` bit(1) NOT NULL,
  `status` bit(1) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `user_id` varchar(50) NOT NULL,
  `specialization` varchar(100) NOT NULL,
  `address_id` bigint(20) DEFAULT NULL,
  `authed_provider_id` bigint(20) NOT NULL,
  `type_disease` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKcaifv0va46t2mu85cg5afmayf` (`email`),
  UNIQUE KEY `UKt1f6cueqyjwx5ghew9ar1exe3` (`user_id`),
  UNIQUE KEY `UK19v5ip05jridmdecfyq8k9flb` (`address_id`),
  KEY `FKqlqav15r1wbthdbd7xus4e3b3` (`authed_provider_id`),
  KEY `FKrs925uccbwa4satfufrgayf94` (`type_disease`),
  CONSTRAINT `FKp4iloqqmw98s65wv8761exy6c` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`),
  CONSTRAINT `FKqlqav15r1wbthdbd7xus4e3b3` FOREIGN KEY (`authed_provider_id`) REFERENCES `authenticate_provider` (`id`),
  CONSTRAINT `FKrs925uccbwa4satfufrgayf94` FOREIGN KEY (`type_disease`) REFERENCES `type_diseases` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

-- Dumping data for table admin_service.doctors: ~10 rows (approximately)
DELETE FROM `doctors`;
INSERT INTO `doctors` (`id`, `avatar`, `created_at`, `dob`, `email`, `email_verified`, `first_name`, `last_name`, `password`, `phone`, `sex`, `status`, `updated_at`, `user_id`, `specialization`, `address_id`, `authed_provider_id`, `type_disease`) VALUES
	(1, NULL, '2025-03-04 18:05:17.425072', '1995-08-10', 'barbra.powlowski@yahoo.com', b'1', 'Truman', 'Spinka', '6u5vjao881r1pjzl', '(812) 976-1981', b'1', b'1', NULL, '20250304180516-62345-19950810', '', 1, 1, 6),
	(2, NULL, '2025-03-04 18:05:17.580475', '1987-10-21', 'lee.durgan@gmail.com', b'1', 'Oda', 'Wiza', 'm9l4uc5j9r9qy3g', '(730) 608-1762', b'0', b'1', NULL, '20250304180517-42192-19871021', '', 5, 1, 5),
	(3, NULL, '2025-03-04 18:05:17.624270', '1986-02-22', 'don.reynolds@yahoo.com', b'1', 'Rocky', 'Luettgen', 'n26n7935j', '(505) 905-0902', b'0', b'1', NULL, '20250304180517-16185-19860222', '', 9, 1, 3),
	(4, NULL, '2025-03-04 18:05:17.671418', '1985-03-03', 'winston.satterfield@hotmail.com', b'1', 'Zetta', 'Simonis', 'h30qto571g', '(386) 493-5144', b'0', b'1', NULL, '20250304180517-50571-19850303', '', 13, 1, 5),
	(5, NULL, '2025-03-04 18:05:17.718136', '1991-01-27', 'byron.greenfelder@gmail.com', b'1', 'Cassey', 'Pouros', 'v1fjcn2j7', '(305) 254-3317', b'1', b'1', NULL, '20250304180517-74899-19910127', '', 17, 1, 6),
	(6, NULL, '2025-03-04 18:05:17.757917', '1993-08-12', 'ursula.kerluke@yahoo.com', b'1', 'Vicente', 'Wehner', '1d5ritpqzj5i6', '(929) 376-5586', b'1', b'1', NULL, '20250304180517-71924-19930812', '', 21, 1, 6),
	(7, NULL, '2025-03-04 18:05:17.798584', '1998-01-31', 'jasmine.terry@hotmail.com', b'1', 'Cleveland', 'Moore', 'h1bl08bw3', '(505) 808-6102', b'1', b'1', NULL, '20250304180517-85560-19980131', '', 25, 1, 3),
	(8, NULL, '2025-03-04 18:05:17.841450', '1988-01-28', 'karole.gislason@yahoo.com', b'1', 'Sandy', 'Lind', '34qrqw6596b7885', '(730) 242-9581', b'1', b'1', NULL, '20250304180517-80532-19880128', '', 29, 1, 7),
	(9, NULL, '2025-03-04 18:05:17.885515', '1992-12-07', 'alonzo.hodkiewicz@hotmail.com', b'1', 'Marlon', 'Kshlerin', 'i603y98l14', '(539) 813-0320', b'0', b'1', NULL, '20250304180517-35792-19921207', '', 33, 1, 2),
	(10, NULL, '2025-03-04 18:05:17.930439', '1983-08-02', 'salvador.okon@hotmail.com', b'1', 'Krystina', 'Mann', '845h9asj83cw9t1', '(305) 508-8671', b'1', b'1', NULL, '20250304180517-48275-19830802', '', 37, 1, 4);

-- Dumping structure for table admin_service.doctor_certificates
DROP TABLE IF EXISTS `doctor_certificates`;
CREATE TABLE IF NOT EXISTS `doctor_certificates` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `cert_name` varchar(150) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `issue_date` date NOT NULL,
  `doctor_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK4s0nv89dnoagx4dlsiu03hob2` (`doctor_id`),
  CONSTRAINT `FK4s0nv89dnoagx4dlsiu03hob2` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

-- Dumping data for table admin_service.doctor_certificates: ~0 rows (approximately)
DELETE FROM `doctor_certificates`;

-- Dumping structure for table admin_service.doctor_educations
DROP TABLE IF EXISTS `doctor_educations`;
CREATE TABLE IF NOT EXISTS `doctor_educations` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `diploma` enum('BACHELOR','DOCTOR','MASTER','PROFESSOR') NOT NULL,
  `graduate_date` date NOT NULL,
  `join_date` date NOT NULL,
  `school_name` varchar(200) NOT NULL,
  `doctor_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKlqv3elmi210q99ipk3cmegr2q` (`doctor_id`),
  CONSTRAINT `FKlqv3elmi210q99ipk3cmegr2q` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

-- Dumping data for table admin_service.doctor_educations: ~10 rows (approximately)
DELETE FROM `doctor_educations`;
INSERT INTO `doctor_educations` (`id`, `created_at`, `diploma`, `graduate_date`, `join_date`, `school_name`, `doctor_id`) VALUES
	(1, '2025-03-04 18:05:17.569460', 'BACHELOR', '2003-06-01', '2007-12-22', 'Dicki and Sons', 1),
	(2, '2025-03-04 18:05:17.615142', 'BACHELOR', '2003-12-05', '2007-05-29', 'Mitchell-Quitzon', 2),
	(3, '2025-03-04 18:05:17.660864', 'BACHELOR', '2004-02-06', '2008-01-31', 'Aufderhar, Crona and Boyer', 3),
	(4, '2025-03-04 18:05:17.709110', 'BACHELOR', '2003-06-07', '2007-04-13', 'Feest Inc', 4),
	(5, '2025-03-04 18:05:17.749387', 'BACHELOR', '2003-05-12', '2007-08-28', 'Gerlach LLC', 5),
	(6, '2025-03-04 18:05:17.788523', 'BACHELOR', '2003-08-22', '2007-11-13', 'Homenick Inc', 6),
	(7, '2025-03-04 18:05:17.831885', 'BACHELOR', '2003-05-25', '2007-11-06', 'Muller Inc', 7),
	(8, '2025-03-04 18:05:17.877178', 'BACHELOR', '2003-09-21', '2007-03-11', 'Littel-Turner', 8),
	(9, '2025-03-04 18:05:17.921405', 'BACHELOR', '2003-09-16', '2007-04-12', 'Schimmel LLC', 9),
	(10, '2025-03-04 18:05:17.961705', 'BACHELOR', '2004-01-13', '2007-10-20', 'Bechtelar Inc', 10);

-- Dumping structure for table admin_service.doctor_experiences
DROP TABLE IF EXISTS `doctor_experiences`;
CREATE TABLE IF NOT EXISTS `doctor_experiences` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `company_name` varchar(100) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `end_date` date NOT NULL,
  `specialization` varchar(150) NOT NULL,
  `start_date` date NOT NULL,
  `comp_address_id` bigint(20) NOT NULL,
  `doctor_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKl47o8476q5k3fhjbany3vy5lp` (`comp_address_id`),
  KEY `FKnoss5vksd9wtpthgxm30dqdbn` (`doctor_id`),
  CONSTRAINT `FKl47o8476q5k3fhjbany3vy5lp` FOREIGN KEY (`comp_address_id`) REFERENCES `addresses` (`id`),
  CONSTRAINT `FKnoss5vksd9wtpthgxm30dqdbn` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

-- Dumping data for table admin_service.doctor_experiences: ~30 rows (approximately)
DELETE FROM `doctor_experiences`;
INSERT INTO `doctor_experiences` (`id`, `company_name`, `created_at`, `description`, `end_date`, `specialization`, `start_date`, `comp_address_id`, `doctor_id`) VALUES
	(1, 'Hintz Group', '2025-03-04 18:05:17.544094', 'Ipsum quod dicta.', '2001-02-16', '', '2002-02-12', 2, 1),
	(2, 'Ebert-Cronin', '2025-03-04 18:05:17.554410', 'Quis totam incidunt ipsa.', '2000-10-10', '', '2002-10-01', 3, 1),
	(3, 'Kertzmann Inc', '2025-03-04 18:05:17.564947', 'Non aperiam amet.', '2000-12-06', '', '2001-05-20', 4, 1),
	(4, 'Cummerata Group', '2025-03-04 18:05:17.592050', 'Unde incidunt nostrum sit accusantium.', '2000-05-22', '', '2002-05-29', 6, 2),
	(5, 'Cremin Inc', '2025-03-04 18:05:17.600066', 'Facere nesciunt voluptates consectetur error commodi deleniti eius.', '2000-09-18', '', '2001-10-07', 7, 2),
	(6, 'Kreiger and Sons', '2025-03-04 18:05:17.610613', 'Esse eius nesciunt nisi.', '2000-05-05', '', '2001-10-25', 8, 2),
	(7, 'Emard-Schneider', '2025-03-04 18:05:17.633778', 'Minima ad quos sapiente.', '2000-07-11', '', '2002-07-26', 10, 3),
	(8, 'Huels-Gorczany', '2025-03-04 18:05:17.644311', 'Deserunt eaque tenetur nam minima earum.', '2000-07-28', '', '2002-02-26', 11, 3),
	(9, 'Bailey, Lubowitz and Steuber', '2025-03-04 18:05:17.654844', 'Harum animi numquam recusandae.', '2000-11-16', '', '2002-09-22', 12, 3),
	(10, 'Kilback-Zboncak', '2025-03-04 18:05:17.685468', 'Similique vero eveniet nesciunt non aperiam.', '2000-04-12', '', '2002-12-16', 14, 4),
	(11, 'Steuber, Doyle and Dare', '2025-03-04 18:05:17.694008', 'Modi molestiae dolores.', '2000-08-31', '', '2002-05-11', 15, 4),
	(12, 'Robel LLC', '2025-03-04 18:05:17.703575', 'Tenetur tempora doloribus illo voluptatum exercitationem cum quo.', '2000-05-12', '', '2003-02-28', 16, 4),
	(13, 'Kautzer-Swift', '2025-03-04 18:05:17.728196', 'Quisquam eveniet odit eligendi officia.', '2000-03-31', '', '2001-05-21', 18, 5),
	(14, 'Pacocha-Wiza', '2025-03-04 18:05:17.737726', 'Dicta earum distinctio ad.', '2000-03-05', '', '2001-05-13', 19, 5),
	(15, 'Becker, Streich and Greenfelder', '2025-03-04 18:05:17.745403', 'Fugiat dolorem sit.', '2000-09-19', '', '2002-03-27', 20, 5),
	(16, 'O\'Conner-Kris', '2025-03-04 18:05:17.768456', 'Fuga sapiente vel consequuntur minima nemo.', '2000-08-30', '', '2001-06-10', 22, 6),
	(17, 'Willms-Labadie', '2025-03-04 18:05:17.776529', 'Exercitationem praesentium earum at veniam ullam.', '2000-06-24', '', '2002-06-03', 23, 6),
	(18, 'Jacobi-Johnson', '2025-03-04 18:05:17.784510', 'Earum dolore laudantium.', '2000-12-21', '', '2003-02-24', 24, 6),
	(19, 'Walker-Bode', '2025-03-04 18:05:17.809127', 'Facilis officiis nulla hic.', '2000-08-20', '', '2001-11-29', 26, 7),
	(20, 'Kunde, Willms and Lockman', '2025-03-04 18:05:17.817334', 'Cupiditate enim vitae facilis in quaerat.', '2000-05-30', '', '2003-01-05', 27, 7),
	(21, 'Dare Group', '2025-03-04 18:05:17.825851', 'Ducimus totam in dicta nobis.', '2000-08-31', '', '2002-03-27', 28, 7),
	(22, 'Carter, White and Quigley', '2025-03-04 18:05:17.853100', 'Dolorem saepe nam architecto sit quae quia.', '2001-01-26', '', '2002-05-22', 30, 8),
	(23, 'Grimes-Cummerata', '2025-03-04 18:05:17.862634', 'Quas laudantium officiis repudiandae consequatur iste omnis omnis.', '2000-04-09', '', '2003-01-28', 31, 8),
	(24, 'Stiedemann, D\'Amore and Macejkovic', '2025-03-04 18:05:17.872175', 'Velit voluptates aliquam quam.', '2000-09-08', '', '2002-07-25', 32, 8),
	(25, 'Rogahn-Hudson', '2025-03-04 18:05:17.896830', 'Quisquam architecto in veniam quam ut veritatis error.', '2000-04-14', '', '2002-10-24', 34, 9),
	(26, 'Jacobi-O\'Conner', '2025-03-04 18:05:17.907356', 'Dolore repellat consequuntur et odio.', '2001-02-04', '', '2002-01-30', 35, 9),
	(27, 'Casper LLC', '2025-03-04 18:05:17.916893', 'Doloribus tenetur labore reiciendis eligendi dicta facere.', '2001-01-22', '', '2002-05-20', 36, 9),
	(28, 'Johns and Sons', '2025-03-04 18:05:17.941538', 'Eius cupiditate blanditiis.', '2001-03-03', '', '2001-04-07', 38, 10),
	(29, 'Medhurst-Shanahan', '2025-03-04 18:05:17.950638', 'Debitis fuga esse inventore illum.', '2000-06-05', '', '2001-09-21', 39, 10),
	(30, 'Bins and Sons', '2025-03-04 18:05:17.957706', 'Exercitationem ut fuga.', '2000-06-27', '', '2001-08-02', 40, 10);

-- Dumping structure for table admin_service.drugs
DROP TABLE IF EXISTS `drugs`;
CREATE TABLE IF NOT EXISTS `drugs` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `drug_name` varchar(150) NOT NULL,
  `unit` varchar(50) NOT NULL,
  `drug_type` varchar(300) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

-- Dumping data for table admin_service.drugs: ~8 rows (approximately)
DELETE FROM `drugs`;
INSERT INTO `drugs` (`id`, `created_at`, `drug_name`, `unit`, `drug_type`) VALUES
	(1, '2025-02-28 22:33:55.828644', 'Amoxicillin 500mg', 'Viên', 'Thuốc Kháng Sinh'),
	(2, '2025-02-28 22:34:20.021350', 'Amoxicillin + Acid Clavulanic (Augmentin) 625mg', 'Viên', 'Thuốc Kháng Sinh'),
	(3, '2025-02-28 22:34:49.178892', 'Ibuprofen 400mg', 'Viên', 'Thuốc Giảm Đau, Chống Viêm'),
	(4, '2025-02-28 22:35:02.186566', 'Paracetamol 500mg', 'Viên', 'Thuốc Giảm Đau, Chống Viêm'),
	(5, '2025-02-28 22:35:29.960031', 'Chlorhexidine 0.12%', 'Chai (ml)', 'Thuốc Súc Miệng, Kháng Khuẩn'),
	(6, '2025-02-28 22:35:40.458009', 'Hydrogen Peroxide 3%', 'Chai (ml)', 'Thuốc Súc Miệng, Kháng Khuẩn'),
	(7, '2025-02-28 22:36:06.272755', 'Nystatin 500.000 IU', 'Viên / Ngậm', 'Thuốc Chống Nấm Miệng'),
	(8, '2025-02-28 22:36:21.974716', 'Miconazole gel 2%', 'Tuýp (g)', 'Thuốc Chống Nấm Miệng'),
	(9, '2025-02-28 22:36:39.005893', 'Triamcinolone Acetonide 0.1% (Oracort)', 'Tuýp (g)', 'Thuốc Điều Trị Loét Miệng'),
	(10, '2025-02-28 22:36:52.853523', 'Betamethasone 0.1%', 'Tuýp (g)', 'Thuốc Điều Trị Loét Miệng');

-- Dumping structure for table admin_service.medical_records
DROP TABLE IF EXISTS `medical_records`;
CREATE TABLE IF NOT EXISTS `medical_records` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `diagnosis_disease` varchar(300) DEFAULT NULL,
  `note` varchar(500) DEFAULT NULL,
  `re_examination_date` date NOT NULL,
  `appointment_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK2nyonrbplqq716buy7u4ghmt8` (`appointment_id`),
  CONSTRAINT `FKifeec8p5v06rt258odelw8s7j` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

-- Dumping data for table admin_service.medical_records: ~0 rows (approximately)
DELETE FROM `medical_records`;

-- Dumping structure for table admin_service.medical_record_drugs
DROP TABLE IF EXISTS `medical_record_drugs`;
CREATE TABLE IF NOT EXISTS `medical_record_drugs` (
  `how_use` varchar(5000) NOT NULL,
  `quantity` double NOT NULL,
  `medical_record` bigint(20) NOT NULL,
  `drug_id` bigint(20) NOT NULL,
  PRIMARY KEY (`drug_id`,`medical_record`),
  KEY `FKq0r5sgy3stpiwdksamwdrls34` (`medical_record`),
  CONSTRAINT `FK4c6sp5dplul9mxwk0cn1ehyhi` FOREIGN KEY (`drug_id`) REFERENCES `drugs` (`id`),
  CONSTRAINT `FKq0r5sgy3stpiwdksamwdrls34` FOREIGN KEY (`medical_record`) REFERENCES `medical_records` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

-- Dumping data for table admin_service.medical_record_drugs: ~0 rows (approximately)
DELETE FROM `medical_record_drugs`;

-- Dumping structure for table admin_service.patients
DROP TABLE IF EXISTS `patients`;
CREATE TABLE IF NOT EXISTS `patients` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `avatar` varchar(500) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `dob` date NOT NULL,
  `email` varchar(200) NOT NULL,
  `email_verified` bit(1) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `sex` bit(1) NOT NULL,
  `status` bit(1) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `user_id` varchar(50) NOT NULL,
  `address_id` bigint(20) DEFAULT NULL,
  `authed_provider_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKa370hmxgv0l5c9panryr1ji7d` (`email`),
  UNIQUE KEY `UK9tbsl3fmey0eofbm2xj69v4qs` (`user_id`),
  UNIQUE KEY `UKpveescs3fe3p1eaabryivpydo` (`address_id`),
  KEY `FK7s92dg6yxcss33sqqh1d7dg1v` (`authed_provider_id`),
  CONSTRAINT `FK7s92dg6yxcss33sqqh1d7dg1v` FOREIGN KEY (`authed_provider_id`) REFERENCES `authenticate_provider` (`id`),
  CONSTRAINT `FKjc8017x8ae0rqi11m8jmny646` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

-- Dumping data for table admin_service.patients: ~33 rows (approximately)
DELETE FROM `patients`;
INSERT INTO `patients` (`id`, `avatar`, `created_at`, `dob`, `email`, `email_verified`, `first_name`, `last_name`, `password`, `phone`, `sex`, `status`, `updated_at`, `user_id`, `address_id`, `authed_provider_id`) VALUES
	(1, NULL, '2025-02-28 08:19:50.363986', '2003-09-13', 'tdminhnhat13092003@gmail.com', b'1', 'Nhat', 'Truong', '123456789', '0123456789', b'0', b'1', NULL, '20250228081950-93569-20030913', NULL, 1),
	(2, NULL, '2025-02-28 19:22:36.042887', '2000-01-02', 'skyherobrine13092003@gmail.com', b'0', 'Linh', 'NgÅ©', '123456789', '0135792468', b'0', b'1', NULL, '20250228192235-63089-20000102', NULL, 1),
	(3, NULL, '2025-02-28 19:23:59.902233', '2000-10-01', 'nhatdev13092003@gmail.com', b'0', 'Vy', 'Nguyen', '123456789', '0129384756', b'1', b'1', NULL, '20250228192359-55935-20001001', NULL, 1),
	(4, NULL, '2025-03-04 18:20:50.451763', '2001-02-21', 'kelley.greenfelder@hotmail.com', b'0', 'Leslie', 'Tremblay', '2p7hdf9j7q', '(414) 902-8116', b'0', b'1', NULL, '20250304182049-40175-20010221', 41, 1),
	(5, NULL, '2025-03-04 18:20:50.517828', '1986-02-18', 'vina.ondricka@gmail.com', b'0', 'Johnathan', 'Wyman', '28hje83y3h9', '(730) 201-7158', b'0', b'1', NULL, '20250304182050-56975-19860218', 42, 1),
	(6, NULL, '2025-03-04 18:20:50.527399', '1990-03-30', 'peter.morissette@yahoo.com', b'0', 'Jeannine', 'Torp', 'l7qy35l8qdj16zc', '(305) 232-2688', b'0', b'1', NULL, '20250304182050-32009-19900330', 43, 1),
	(7, NULL, '2025-03-04 18:20:50.536901', '1988-05-23', 'trevor.johnston@yahoo.com', b'0', 'Ashley', 'Erdman', '36782ko4u5v27502', '(561) 540-5279', b'1', b'1', NULL, '20250304182050-82154-19880523', 44, 1),
	(8, NULL, '2025-03-04 18:20:50.547442', '1988-11-28', 'marcus.kling@hotmail.com', b'0', 'Annis', 'Doyle', '7wv1v24lcr7s7', '(305) 983-6503', b'0', b'1', NULL, '20250304182050-47732-19881128', 45, 1),
	(9, NULL, '2025-03-04 18:20:50.556452', '1975-09-25', 'avril.gutkowski@gmail.com', b'0', 'Valerie', 'Brakus', '36oi0416', '(983) 300-9340', b'0', b'1', NULL, '20250304182050-83383-19750925', 46, 1),
	(10, NULL, '2025-03-04 18:20:50.565585', '1967-10-02', 'erich.gorczany@hotmail.com', b'0', 'Rafael', 'Koch', '29l0g50xg', '(505) 601-6995', b'1', b'1', NULL, '20250304182050-38167-19671002', 47, 1),
	(11, NULL, '2025-03-04 18:20:50.576123', '1997-10-30', 'diedra.corwin@hotmail.com', b'0', 'Bryce', 'Hand', 'cbbk79lo9', '(305) 265-9885', b'1', b'1', NULL, '20250304182050-41137-19971030', 48, 1),
	(12, NULL, '2025-03-04 18:20:50.584698', '1983-08-20', 'catina.bernier@hotmail.com', b'0', 'Stanton', 'Johnson', '49w25h3v', '(313) 201-2829', b'1', b'1', NULL, '20250304182050-99844-19830820', 49, 1),
	(13, NULL, '2025-03-04 18:20:50.594227', '1973-01-30', 'sanford.schaden@yahoo.com', b'0', 'Silas', 'Howell', '233qk00710ksu807', '(234) 778-1906', b'0', b'1', NULL, '20250304182050-27503-19730130', 50, 1),
	(14, NULL, '2025-03-04 18:20:50.604747', '2001-06-23', 'katheleen.gottlieb@gmail.com', b'0', 'Toshiko', 'Ziemann', 'c157fl3pr4o', '(636) 311-1662', b'1', b'1', NULL, '20250304182050-47036-20010623', 51, 1),
	(15, NULL, '2025-03-04 18:20:50.615807', '2002-02-10', 'juliet.keebler@gmail.com', b'0', 'Claudio', 'Buckridge', '70o41wc8we', '(505) 635-9246', b'1', b'1', NULL, '20250304182050-74349-20020210', 52, 1),
	(16, NULL, '2025-03-04 18:20:50.628338', '1986-08-18', 'humberto.kub@hotmail.com', b'0', 'Deon', 'Gottlieb', 'o015ic812', '(252) 645-2702', b'0', b'1', NULL, '20250304182050-60369-19860818', 53, 1),
	(17, NULL, '2025-03-04 18:20:50.638873', '1997-05-25', 'lenora.rempel@yahoo.com', b'0', 'Benedict', 'Bahringer', 'xrjpjpc1a8', '(305) 293-3368', b'1', b'1', NULL, '20250304182050-83401-19970525', 54, 1),
	(18, NULL, '2025-03-04 18:20:50.650415', '1978-11-04', 'wendell.murray@gmail.com', b'0', 'Barrett', 'Glover', '27xe0pk87', '(505) 648-7073', b'1', b'1', NULL, '20250304182050-72921-19781104', 55, 1),
	(19, NULL, '2025-03-04 18:20:50.659942', '1987-03-27', 'angelo.gislason@gmail.com', b'0', 'Magaret', 'Kunze', 'b25u3t4fe33m7', '(680) 634-6703', b'1', b'1', NULL, '20250304182050-59530-19870327', 56, 1),
	(20, NULL, '2025-03-04 18:20:50.670027', '2004-04-25', 'marc.vandervort@hotmail.com', b'0', 'Sydney', 'Fadel', '6hd00dd8d3z84', '(305) 206-1616', b'0', b'1', NULL, '20250304182050-34472-20040425', 57, 1),
	(21, NULL, '2025-03-04 18:20:50.680071', '1998-03-25', 'twana.weber@yahoo.com', b'0', 'Myron', 'Spencer', 'nv9595plw5', '(505) 630-4490', b'1', b'1', NULL, '20250304182050-86688-19980325', 58, 1),
	(22, NULL, '2025-03-04 18:20:50.690126', '2007-02-28', 'jed.mclaughlin@yahoo.com', b'0', 'Howard', 'Fay', 'd6zn9x1kf0youq', '(727) 230-5263', b'0', b'1', NULL, '20250304182050-89117-20070228', 59, 1),
	(23, NULL, '2025-03-04 18:20:50.699103', '1960-12-22', 'lenna.white@gmail.com', b'0', 'Franklin', 'Dietrich', '3852y8awg', '(505) 690-9903', b'0', b'1', NULL, '20250304182050-78903-19601222', 60, 1),
	(24, NULL, '2025-03-04 18:20:50.707619', '1955-10-04', 'romona.smitham@yahoo.com', b'0', 'Val', 'Harber', '99qbm4c85o', '(983) 898-4187', b'0', b'1', NULL, '20250304182050-59751-19551004', 61, 1),
	(25, NULL, '2025-03-04 18:20:50.714633', '1978-10-17', 'leon.zieme@gmail.com', b'0', 'Mayra', 'Auer', 'a6o84900', '(505) 621-7008', b'0', b'1', NULL, '20250304182050-31302-19781017', 62, 1),
	(26, NULL, '2025-03-04 18:20:50.723166', '1968-05-03', 'dimple.anderson@hotmail.com', b'0', 'Leeann', 'McKenzie', '0r1p1xgi6', '(828) 690-7431', b'0', b'1', NULL, '20250304182050-93840-19680503', 63, 1),
	(27, NULL, '2025-03-04 18:20:50.730111', '1989-07-08', 'eusebio.herzog@hotmail.com', b'0', 'Elva', 'Littel', 't1cd5131f235sk3', '(805) 531-6795', b'0', b'1', NULL, '20250304182050-91670-19890708', 64, 1),
	(28, NULL, '2025-03-04 18:20:50.738105', '1997-01-06', 'davida.strosin@hotmail.com', b'0', 'Josiah', 'Moen', '4cc888iu2fl', '(305) 204-8347', b'1', b'1', NULL, '20250304182050-60679-19970106', 65, 1),
	(29, NULL, '2025-03-04 18:20:50.746613', '1976-04-17', 'mitzi.hane@yahoo.com', b'0', 'Walker', 'Toy', 'm2x455bc66v4v', '(305) 434-4861', b'0', b'1', NULL, '20250304182050-66373-19760417', 66, 1),
	(30, NULL, '2025-03-04 18:20:50.756140', '1970-07-05', 'teri.weber@yahoo.com', b'0', 'Miguel', 'Marks', 'oqh7j29969341x', '(350) 870-7432', b'1', b'1', NULL, '20250304182050-71357-19700705', 67, 1),
	(31, NULL, '2025-03-04 18:20:50.763485', '1996-12-30', 'eddie.barrows@yahoo.com', b'0', 'Hertha', 'Gusikowski', 'm903w9710o916lkw', '(983) 794-4826', b'1', b'1', NULL, '20250304182050-16310-19961230', 68, 1),
	(32, NULL, '2025-03-04 18:20:50.771483', '1967-05-27', 'jeniffer.beier@gmail.com', b'0', 'Margert', 'Durgan', '3110g050927u96', '(505) 894-3265', b'1', b'1', NULL, '20250304182050-89821-19670527', 69, 1),
	(33, NULL, '2025-03-04 18:20:50.781057', '2003-10-04', 'johanna.johnston@gmail.com', b'0', 'Sina', 'Swaniawski', 'b8495zswb3', '(730) 645-4969', b'0', b'1', NULL, '20250304182050-25278-20031004', 70, 1);

-- Dumping structure for table admin_service.patient_face_encodes
DROP TABLE IF EXISTS `patient_face_encodes`;
CREATE TABLE IF NOT EXISTS `patient_face_encodes` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `in_front_of_encode` varchar(5000) NOT NULL,
  `left_encode` varchar(5000) NOT NULL,
  `right_encode` varchar(5000) NOT NULL,
  `patient_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKg76pu2iqt0woxcsvj4xmx9tgl` (`patient_id`),
  CONSTRAINT `FKcao55bflc5bi4o6c64aimsnmb` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

-- Dumping data for table admin_service.patient_face_encodes: ~0 rows (approximately)
DELETE FROM `patient_face_encodes`;

-- Dumping structure for table admin_service.type_diseases
DROP TABLE IF EXISTS `type_diseases`;
CREATE TABLE IF NOT EXISTS `type_diseases` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `name` varchar(100) NOT NULL,
  `status` bit(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKpbl5knbx178mflcgajpwk3f6q` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

-- Dumping data for table admin_service.type_diseases: ~8 rows (approximately)
DELETE FROM `type_diseases`;
INSERT INTO `type_diseases` (`id`, `created_at`, `name`, `status`) VALUES
	(1, '2025-03-04 17:06:05.254544', 'SÂU RĂNG', b'1'),
	(2, '2025-03-04 17:06:14.134782', 'VÔI RĂNG', b'1'),
	(3, '2025-03-04 17:06:21.036571', 'KHÁC', b'1'),
	(4, '2025-03-04 17:07:21.705339', 'VIÊM NƯỚU', b'1'),
	(5, '2025-03-04 17:07:31.284605', 'VIÊM NHA CHU', b'1'),
	(6, '2025-03-04 17:07:44.656807', 'MÒN RĂNG', b'1'),
	(7, '2025-03-04 17:07:49.845096', 'RĂNG KHÔN', b'1'),
	(8, '2025-03-04 17:07:56.681766', 'HÔI MIỆNG', b'1');


-- Dumping database structure for appointment_service
DROP DATABASE IF EXISTS `appointment_service`;
CREATE DATABASE IF NOT EXISTS `appointment_service` /*!40100 DEFAULT CHARACTER SET utf8mb3 COLLATE utf8mb3_bin */;
USE `appointment_service`;

-- Dumping structure for table appointment_service.appointments
DROP TABLE IF EXISTS `appointments`;
CREATE TABLE IF NOT EXISTS `appointments` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `note` varchar(500) DEFAULT NULL,
  `patient_id` varchar(50) NOT NULL,
  `room_id` varchar(255) NOT NULL,
  `status` tinyint(4) NOT NULL CHECK (`status` between 0 and 3),
  `work_schedule_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

-- Dumping data for table appointment_service.appointments: ~0 rows (approximately)
DELETE FROM `appointments`;
INSERT INTO `appointments` (`id`, `created_at`, `note`, `patient_id`, `room_id`, `status`, `work_schedule_id`) VALUES
	(1, '2025-03-05 00:12:47.441633', NULL, '20250304182049-40175-20010221', '763722-05032025001247', 0, 1);

-- Dumping structure for table appointment_service.drugs
DROP TABLE IF EXISTS `drugs`;
CREATE TABLE IF NOT EXISTS `drugs` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `drug_name` varchar(150) NOT NULL,
  `unit` varchar(50) NOT NULL,
  `drug_type` varchar(300) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

-- Dumping data for table appointment_service.drugs: ~8 rows (approximately)
DELETE FROM `drugs`;
INSERT INTO `drugs` (`id`, `created_at`, `drug_name`, `unit`, `drug_type`) VALUES
	(1, '2025-02-28 22:33:55.905653', 'Amoxicillin 500mg', 'Viên', 'Thuốc Kháng Sinh'),
	(2, '2025-02-28 22:34:20.025343', 'Amoxicillin + Acid Clavulanic (Augmentin) 625mg', 'Viên', 'Thuốc Kháng Sinh'),
	(3, '2025-02-28 22:34:49.183905', 'Ibuprofen 400mg', 'Viên', 'Thuốc Giảm Đau, Chống Viêm'),
	(4, '2025-02-28 22:35:02.192926', 'Paracetamol 500mg', 'Viên', 'Thuốc Giảm Đau, Chống Viêm'),
	(5, '2025-02-28 22:35:29.966024', 'Chlorhexidine 0.12%', 'Chai (ml)', 'Thuốc Súc Miệng, Kháng Khuẩn'),
	(6, '2025-02-28 22:35:40.462012', 'Hydrogen Peroxide 3%', 'Chai (ml)', 'Thuốc Súc Miệng, Kháng Khuẩn'),
	(7, '2025-02-28 22:36:06.277188', 'Nystatin 500.000 IU', 'Viên / Ngậm', 'Thuốc Chống Nấm Miệng'),
	(8, '2025-02-28 22:36:21.978703', 'Miconazole gel 2%', 'Tuýp (g)', 'Thuốc Chống Nấm Miệng'),
	(9, '2025-02-28 22:36:39.010389', 'Triamcinolone Acetonide 0.1% (Oracort)', 'Tuýp (g)', 'Thuốc Điều Trị Loét Miệng'),
	(10, '2025-02-28 22:36:52.858511', 'Betamethasone 0.1%', 'Tuýp (g)', 'Thuốc Điều Trị Loét Miệng');

-- Dumping structure for table appointment_service.medical_records
DROP TABLE IF EXISTS `medical_records`;
CREATE TABLE IF NOT EXISTS `medical_records` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `diagnosis_disease` varchar(300) DEFAULT NULL,
  `note` varchar(500) DEFAULT NULL,
  `re_examination_date` date NOT NULL,
  `appointment_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK2nyonrbplqq716buy7u4ghmt8` (`appointment_id`),
  CONSTRAINT `FKifeec8p5v06rt258odelw8s7j` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

-- Dumping data for table appointment_service.medical_records: ~0 rows (approximately)
DELETE FROM `medical_records`;

-- Dumping structure for table appointment_service.medical_record_drugs
DROP TABLE IF EXISTS `medical_record_drugs`;
CREATE TABLE IF NOT EXISTS `medical_record_drugs` (
  `how_use` varchar(5000) NOT NULL,
  `quantity` double NOT NULL,
  `medical_record` bigint(20) NOT NULL,
  `drug_id` bigint(20) NOT NULL,
  PRIMARY KEY (`drug_id`,`medical_record`),
  KEY `FKq0r5sgy3stpiwdksamwdrls34` (`medical_record`),
  CONSTRAINT `FK4c6sp5dplul9mxwk0cn1ehyhi` FOREIGN KEY (`drug_id`) REFERENCES `drugs` (`id`),
  CONSTRAINT `FKq0r5sgy3stpiwdksamwdrls34` FOREIGN KEY (`medical_record`) REFERENCES `medical_records` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

-- Dumping data for table appointment_service.medical_record_drugs: ~0 rows (approximately)
DELETE FROM `medical_record_drugs`;


-- Dumping database structure for authenticate_service
DROP DATABASE IF EXISTS `authenticate_service`;
CREATE DATABASE IF NOT EXISTS `authenticate_service` /*!40100 DEFAULT CHARACTER SET utf8mb3 COLLATE utf8mb3_bin */;
USE `authenticate_service`;

-- Dumping structure for table authenticate_service.addresses
DROP TABLE IF EXISTS `addresses`;
CREATE TABLE IF NOT EXISTS `addresses` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `city` varchar(100) DEFAULT NULL,
  `country` varchar(50) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `district` varchar(100) DEFAULT NULL,
  `number` varchar(255) DEFAULT NULL,
  `street` varchar(100) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `ward` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

-- Dumping data for table authenticate_service.addresses: ~70 rows (approximately)
DELETE FROM `addresses`;
INSERT INTO `addresses` (`id`, `city`, `country`, `created_at`, `district`, `number`, `street`, `updated_at`, `ward`) VALUES
	(1, NULL, NULL, '2025-03-04 18:05:17.431591', NULL, NULL, NULL, NULL, NULL),
	(2, 'North Gertude', 'Cocos (Keeling) Islands', '2025-03-04 18:05:17.514413', 'Beahan Stream No District', '541', 'Beahan Stream', NULL, 'Beahan Stream No Ward'),
	(3, 'South Aide', 'Paraguay', '2025-03-04 18:05:17.550407', 'Victor Trail No District', '273', 'Victor Trail', NULL, 'Victor Trail No Ward'),
	(4, 'Reichelton', 'Guatemala', '2025-03-04 18:05:17.559946', 'Rempel Ramp No District', '497', 'Rempel Ramp', NULL, 'Rempel Ramp No Ward'),
	(5, NULL, NULL, '2025-03-04 18:05:17.580475', NULL, NULL, NULL, NULL, NULL),
	(6, 'North Rickyfort', 'Guernsey', '2025-03-04 18:05:17.586517', 'Hipolito Squares No District', '384', 'Hipolito Squares', NULL, 'Hipolito Squares No Ward'),
	(7, 'Kamhaven', 'Pitcairn Islands', '2025-03-04 18:05:17.597067', 'Champlin Island No District', '458', 'Champlin Island', NULL, 'Champlin Island No Ward'),
	(8, 'Hyattstad', 'Zimbabwe', '2025-03-04 18:05:17.605618', 'Norman Drive No District', '488', 'Norman Drive', NULL, 'Norman Drive No Ward'),
	(9, NULL, NULL, '2025-03-04 18:05:17.624270', NULL, NULL, NULL, NULL, NULL),
	(10, 'New Olympiamouth', 'Qatar', '2025-03-04 18:05:17.630263', 'Gerri Turnpike No District', '341', 'Gerri Turnpike', NULL, 'Gerri Turnpike No Ward'),
	(11, 'Traceetown', 'Mauritius', '2025-03-04 18:05:17.638793', 'Connelly Key No District', '358', 'Connelly Key', NULL, 'Connelly Key No Ward'),
	(12, 'Port Jaimeechester', 'Falkland Islands (Malvinas)', '2025-03-04 18:05:17.650326', 'Cristi Orchard No District', '516', 'Cristi Orchard', NULL, 'Cristi Orchard No Ward'),
	(13, NULL, NULL, '2025-03-04 18:05:17.671418', NULL, NULL, NULL, NULL, NULL),
	(14, 'Hortensiabury', 'Nauru', '2025-03-04 18:05:17.680477', 'Kenisha Crossroad No District', '844', 'Kenisha Crossroad', NULL, 'Kenisha Crossroad No Ward'),
	(15, 'South Leifstad', 'Singapore', '2025-03-04 18:05:17.689002', 'Ankunding Road No District', '39', 'Ankunding Road', NULL, 'Ankunding Road No Ward'),
	(16, 'West Vanitaborough', 'Liberia', '2025-03-04 18:05:17.698541', 'Gerardo Harbor No District', '749', 'Gerardo Harbor', NULL, 'Gerardo Harbor No Ward'),
	(17, NULL, NULL, '2025-03-04 18:05:17.718136', NULL, NULL, NULL, NULL, NULL),
	(18, 'Divinamouth', 'Japan', '2025-03-04 18:05:17.724209', 'Evelyne Flats No District', '66', 'Evelyne Flats', NULL, 'Evelyne Flats No Ward'),
	(19, 'East Phylicia', 'Slovenia', '2025-03-04 18:05:17.733737', 'Tracey Stream No District', '891', 'Tracey Stream', NULL, 'Tracey Stream No Ward'),
	(20, 'Lynnamouth', 'Singapore', '2025-03-04 18:05:17.741281', 'Langosh Spur No District', '634', 'Langosh Spur', NULL, 'Langosh Spur No Ward'),
	(21, NULL, NULL, '2025-03-04 18:05:17.757917', NULL, NULL, NULL, NULL, NULL),
	(22, 'Towneview', 'Republic of Korea', '2025-03-04 18:05:17.764454', 'Hermiston Canyon No District', '518', 'Hermiston Canyon', NULL, 'Hermiston Canyon No Ward'),
	(23, 'Port Rogelioville', 'Vanuatu', '2025-03-04 18:05:17.770995', 'Hilton Pike No District', '621', 'Hilton Pike', NULL, 'Hilton Pike No Ward'),
	(24, 'West Nikia', 'United States of America', '2025-03-04 18:05:17.781531', 'Ray Locks No District', '362', 'Ray Locks', NULL, 'Ray Locks No Ward'),
	(25, NULL, NULL, '2025-03-04 18:05:17.798584', NULL, NULL, NULL, NULL, NULL),
	(26, 'Goodwinberg', 'Saint Martin', '2025-03-04 18:05:17.804106', 'Jasmin Loaf No District', '984', 'Jasmin Loaf', NULL, 'Jasmin Loaf No Ward'),
	(27, 'Willbury', 'Virgin Islands, British', '2025-03-04 18:05:17.813125', 'Georgine Valley No District', '336', 'Georgine Valley', NULL, 'Georgine Valley No Ward'),
	(28, 'Bergstromfurt', 'Albania', '2025-03-04 18:05:17.820331', 'Schowalter Ridge No District', '930', 'Schowalter Ridge', NULL, 'Schowalter Ridge No Ward'),
	(29, NULL, NULL, '2025-03-04 18:05:17.841450', NULL, NULL, NULL, NULL, NULL),
	(30, 'East Adrianshire', 'Cocos (Keeling) Islands', '2025-03-04 18:05:17.848108', 'Demarcus Lock No District', '464', 'Demarcus Lock', NULL, 'Demarcus Lock No Ward'),
	(31, 'Lake Norris', 'Antigua and Barbuda', '2025-03-04 18:05:17.858635', 'Ambrose Estates No District', '694', 'Ambrose Estates', NULL, 'Ambrose Estates No Ward'),
	(32, 'New Dustybury', 'Samoa', '2025-03-04 18:05:17.866633', 'Norris Neck No District', '139', 'Norris Neck', NULL, 'Norris Neck No Ward'),
	(33, NULL, NULL, '2025-03-04 18:05:17.885515', NULL, NULL, NULL, NULL, NULL),
	(34, 'Noeport', 'Cape Verde', '2025-03-04 18:05:17.892846', 'Mayert Square No District', '385', 'Mayert Square', NULL, 'Mayert Square No Ward'),
	(35, 'Bobbiehaven', 'Tuvalu', '2025-03-04 18:05:17.902358', 'Virgen Camp No District', '856', 'Virgen Camp', NULL, 'Virgen Camp No Ward'),
	(36, 'Gordonfort', 'Tunisia', '2025-03-04 18:05:17.911889', 'Pagac Motorway No District', '383', 'Pagac Motorway', NULL, 'Pagac Motorway No Ward'),
	(37, NULL, NULL, '2025-03-04 18:05:17.930439', NULL, NULL, NULL, NULL, NULL),
	(38, 'West Vivianhaven', 'Anguilla', '2025-03-04 18:05:17.937526', 'Marquardt Plains No District', '987', 'Marquardt Plains', NULL, 'Marquardt Plains No Ward'),
	(39, 'New Breann', 'Bhutan', '2025-03-04 18:05:17.946636', 'Schuster Fort No District', '24', 'Schuster Fort', NULL, 'Schuster Fort No Ward'),
	(40, 'Port Solomonmouth', 'Ecuador', '2025-03-04 18:05:17.954708', 'Effertz Falls No District', '388', 'Effertz Falls', NULL, 'Effertz Falls No Ward'),
	(41, NULL, NULL, '2025-03-04 18:20:50.458047', NULL, NULL, NULL, NULL, NULL),
	(42, NULL, NULL, '2025-03-04 18:20:50.517828', NULL, NULL, NULL, NULL, NULL),
	(43, NULL, NULL, '2025-03-04 18:20:50.527399', NULL, NULL, NULL, NULL, NULL),
	(44, NULL, NULL, '2025-03-04 18:20:50.536901', NULL, NULL, NULL, NULL, NULL),
	(45, NULL, NULL, '2025-03-04 18:20:50.547442', NULL, NULL, NULL, NULL, NULL),
	(46, NULL, NULL, '2025-03-04 18:20:50.556452', NULL, NULL, NULL, NULL, NULL),
	(47, NULL, NULL, '2025-03-04 18:20:50.565585', NULL, NULL, NULL, NULL, NULL),
	(48, NULL, NULL, '2025-03-04 18:20:50.576123', NULL, NULL, NULL, NULL, NULL),
	(49, NULL, NULL, '2025-03-04 18:20:50.585693', NULL, NULL, NULL, NULL, NULL),
	(50, NULL, NULL, '2025-03-04 18:20:50.594227', NULL, NULL, NULL, NULL, NULL),
	(51, NULL, NULL, '2025-03-04 18:20:50.604747', NULL, NULL, NULL, NULL, NULL),
	(52, NULL, NULL, '2025-03-04 18:20:50.615807', NULL, NULL, NULL, NULL, NULL),
	(53, NULL, NULL, '2025-03-04 18:20:50.628338', NULL, NULL, NULL, NULL, NULL),
	(54, NULL, NULL, '2025-03-04 18:20:50.638873', NULL, NULL, NULL, NULL, NULL),
	(55, NULL, NULL, '2025-03-04 18:20:50.650415', NULL, NULL, NULL, NULL, NULL),
	(56, NULL, NULL, '2025-03-04 18:20:50.660941', NULL, NULL, NULL, NULL, NULL),
	(57, NULL, NULL, '2025-03-04 18:20:50.671026', NULL, NULL, NULL, NULL, NULL),
	(58, NULL, NULL, '2025-03-04 18:20:50.680071', NULL, NULL, NULL, NULL, NULL),
	(59, NULL, NULL, '2025-03-04 18:20:50.690126', NULL, NULL, NULL, NULL, NULL),
	(60, NULL, NULL, '2025-03-04 18:20:50.699103', NULL, NULL, NULL, NULL, NULL),
	(61, NULL, NULL, '2025-03-04 18:20:50.707619', NULL, NULL, NULL, NULL, NULL),
	(62, NULL, NULL, '2025-03-04 18:20:50.714633', NULL, NULL, NULL, NULL, NULL),
	(63, NULL, NULL, '2025-03-04 18:20:50.723166', NULL, NULL, NULL, NULL, NULL),
	(64, NULL, NULL, '2025-03-04 18:20:50.730111', NULL, NULL, NULL, NULL, NULL),
	(65, NULL, NULL, '2025-03-04 18:20:50.738105', NULL, NULL, NULL, NULL, NULL),
	(66, NULL, NULL, '2025-03-04 18:20:50.746613', NULL, NULL, NULL, NULL, NULL),
	(67, NULL, NULL, '2025-03-04 18:20:50.756140', NULL, NULL, NULL, NULL, NULL),
	(68, NULL, NULL, '2025-03-04 18:20:50.763485', NULL, NULL, NULL, NULL, NULL),
	(69, NULL, NULL, '2025-03-04 18:20:50.771483', NULL, NULL, NULL, NULL, NULL),
	(70, NULL, NULL, '2025-03-04 18:20:50.781057', NULL, NULL, NULL, NULL, NULL);

-- Dumping structure for table authenticate_service.admins
DROP TABLE IF EXISTS `admins`;
CREATE TABLE IF NOT EXISTS `admins` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `avatar` varchar(500) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `dob` date NOT NULL,
  `email` varchar(200) NOT NULL,
  `email_verified` bit(1) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `sex` bit(1) NOT NULL,
  `status` bit(1) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `user_id` varchar(50) NOT NULL,
  `address_id` bigint(20) DEFAULT NULL,
  `authed_provider_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK47bvqemyk6vlm0w7crc3opdd4` (`email`),
  UNIQUE KEY `UKpiovo1hsx7hi5f9ax85epqya9` (`user_id`),
  UNIQUE KEY `UK50fcivxhjyl86o4xam5sq0v2j` (`address_id`),
  KEY `FKdyc5pst6ok5n4t5jx2djo429x` (`authed_provider_id`),
  CONSTRAINT `FKd22ndptupnu1wj0fawg36qfmh` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`),
  CONSTRAINT `FKdyc5pst6ok5n4t5jx2djo429x` FOREIGN KEY (`authed_provider_id`) REFERENCES `authenticate_provider` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

-- Dumping data for table authenticate_service.admins: ~0 rows (approximately)
DELETE FROM `admins`;

-- Dumping structure for table authenticate_service.authenticate_provider
DROP TABLE IF EXISTS `authenticate_provider`;
CREATE TABLE IF NOT EXISTS `authenticate_provider` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `authen_name` varchar(100) NOT NULL,
  `status` bit(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKmch87ongxq9k1dysaggwe2ggf` (`authen_name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

-- Dumping data for table authenticate_service.authenticate_provider: ~0 rows (approximately)
DELETE FROM `authenticate_provider`;
INSERT INTO `authenticate_provider` (`id`, `authen_name`, `status`) VALUES
	(1, 'APPLICATION', b'1');

-- Dumping structure for table authenticate_service.doctors
DROP TABLE IF EXISTS `doctors`;
CREATE TABLE IF NOT EXISTS `doctors` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `avatar` varchar(500) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `dob` date NOT NULL,
  `email` varchar(200) NOT NULL,
  `email_verified` bit(1) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `sex` bit(1) NOT NULL,
  `status` bit(1) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `user_id` varchar(50) NOT NULL,
  `specialization` varchar(100) NOT NULL,
  `address_id` bigint(20) DEFAULT NULL,
  `authed_provider_id` bigint(20) NOT NULL,
  `type_disease` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKcaifv0va46t2mu85cg5afmayf` (`email`),
  UNIQUE KEY `UKt1f6cueqyjwx5ghew9ar1exe3` (`user_id`),
  UNIQUE KEY `UK19v5ip05jridmdecfyq8k9flb` (`address_id`),
  KEY `FKqlqav15r1wbthdbd7xus4e3b3` (`authed_provider_id`),
  KEY `FKrs925uccbwa4satfufrgayf94` (`type_disease`),
  CONSTRAINT `FKp4iloqqmw98s65wv8761exy6c` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`),
  CONSTRAINT `FKqlqav15r1wbthdbd7xus4e3b3` FOREIGN KEY (`authed_provider_id`) REFERENCES `authenticate_provider` (`id`),
  CONSTRAINT `FKrs925uccbwa4satfufrgayf94` FOREIGN KEY (`type_disease`) REFERENCES `type_diseases` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

-- Dumping data for table authenticate_service.doctors: ~10 rows (approximately)
DELETE FROM `doctors`;
INSERT INTO `doctors` (`id`, `avatar`, `created_at`, `dob`, `email`, `email_verified`, `first_name`, `last_name`, `password`, `phone`, `sex`, `status`, `updated_at`, `user_id`, `specialization`, `address_id`, `authed_provider_id`, `type_disease`) VALUES
	(1, NULL, '2025-03-04 18:05:17.425072', '1995-08-10', 'barbra.powlowski@yahoo.com', b'1', 'Truman', 'Spinka', '6u5vjao881r1pjzl', '(812) 976-1981', b'1', b'1', NULL, '20250304180516-62345-19950810', '', 1, 1, 6),
	(2, NULL, '2025-03-04 18:05:17.580475', '1987-10-21', 'lee.durgan@gmail.com', b'1', 'Oda', 'Wiza', 'm9l4uc5j9r9qy3g', '(730) 608-1762', b'0', b'1', NULL, '20250304180517-42192-19871021', '', 5, 1, 5),
	(3, NULL, '2025-03-04 18:05:17.624270', '1986-02-22', 'don.reynolds@yahoo.com', b'1', 'Rocky', 'Luettgen', 'n26n7935j', '(505) 905-0902', b'0', b'1', NULL, '20250304180517-16185-19860222', '', 9, 1, 3),
	(4, NULL, '2025-03-04 18:05:17.671418', '1985-03-03', 'winston.satterfield@hotmail.com', b'1', 'Zetta', 'Simonis', 'h30qto571g', '(386) 493-5144', b'0', b'1', NULL, '20250304180517-50571-19850303', '', 13, 1, 5),
	(5, NULL, '2025-03-04 18:05:17.718136', '1991-01-27', 'byron.greenfelder@gmail.com', b'1', 'Cassey', 'Pouros', 'v1fjcn2j7', '(305) 254-3317', b'1', b'1', NULL, '20250304180517-74899-19910127', '', 17, 1, 6),
	(6, NULL, '2025-03-04 18:05:17.757917', '1993-08-12', 'ursula.kerluke@yahoo.com', b'1', 'Vicente', 'Wehner', '1d5ritpqzj5i6', '(929) 376-5586', b'1', b'1', NULL, '20250304180517-71924-19930812', '', 21, 1, 6),
	(7, NULL, '2025-03-04 18:05:17.798584', '1998-01-31', 'jasmine.terry@hotmail.com', b'1', 'Cleveland', 'Moore', 'h1bl08bw3', '(505) 808-6102', b'1', b'1', NULL, '20250304180517-85560-19980131', '', 25, 1, 3),
	(8, NULL, '2025-03-04 18:05:17.841450', '1988-01-28', 'karole.gislason@yahoo.com', b'1', 'Sandy', 'Lind', '34qrqw6596b7885', '(730) 242-9581', b'1', b'1', NULL, '20250304180517-80532-19880128', '', 29, 1, 7),
	(9, NULL, '2025-03-04 18:05:17.885515', '1992-12-07', 'alonzo.hodkiewicz@hotmail.com', b'1', 'Marlon', 'Kshlerin', 'i603y98l14', '(539) 813-0320', b'0', b'1', NULL, '20250304180517-35792-19921207', '', 33, 1, 2),
	(10, NULL, '2025-03-04 18:05:17.930439', '1983-08-02', 'salvador.okon@hotmail.com', b'1', 'Krystina', 'Mann', '845h9asj83cw9t1', '(305) 508-8671', b'1', b'1', NULL, '20250304180517-48275-19830802', '', 37, 1, 4);

-- Dumping structure for table authenticate_service.doctor_certificates
DROP TABLE IF EXISTS `doctor_certificates`;
CREATE TABLE IF NOT EXISTS `doctor_certificates` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `cert_name` varchar(150) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `issue_date` date NOT NULL,
  `doctor_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK4s0nv89dnoagx4dlsiu03hob2` (`doctor_id`),
  CONSTRAINT `FK4s0nv89dnoagx4dlsiu03hob2` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

-- Dumping data for table authenticate_service.doctor_certificates: ~0 rows (approximately)
DELETE FROM `doctor_certificates`;

-- Dumping structure for table authenticate_service.doctor_educations
DROP TABLE IF EXISTS `doctor_educations`;
CREATE TABLE IF NOT EXISTS `doctor_educations` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `diploma` enum('BACHELOR','DOCTOR','MASTER','PROFESSOR') NOT NULL,
  `graduate_date` date NOT NULL,
  `join_date` date NOT NULL,
  `school_name` varchar(200) NOT NULL,
  `doctor_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKlqv3elmi210q99ipk3cmegr2q` (`doctor_id`),
  CONSTRAINT `FKlqv3elmi210q99ipk3cmegr2q` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

-- Dumping data for table authenticate_service.doctor_educations: ~10 rows (approximately)
DELETE FROM `doctor_educations`;
INSERT INTO `doctor_educations` (`id`, `created_at`, `diploma`, `graduate_date`, `join_date`, `school_name`, `doctor_id`) VALUES
	(1, '2025-03-04 18:05:17.569460', 'BACHELOR', '2003-06-01', '2007-12-22', 'Dicki and Sons', 1),
	(2, '2025-03-04 18:05:17.615142', 'BACHELOR', '2003-12-05', '2007-05-29', 'Mitchell-Quitzon', 2),
	(3, '2025-03-04 18:05:17.660864', 'BACHELOR', '2004-02-06', '2008-01-31', 'Aufderhar, Crona and Boyer', 3),
	(4, '2025-03-04 18:05:17.709110', 'BACHELOR', '2003-06-07', '2007-04-13', 'Feest Inc', 4),
	(5, '2025-03-04 18:05:17.749387', 'BACHELOR', '2003-05-12', '2007-08-28', 'Gerlach LLC', 5),
	(6, '2025-03-04 18:05:17.788523', 'BACHELOR', '2003-08-22', '2007-11-13', 'Homenick Inc', 6),
	(7, '2025-03-04 18:05:17.831885', 'BACHELOR', '2003-05-25', '2007-11-06', 'Muller Inc', 7),
	(8, '2025-03-04 18:05:17.877178', 'BACHELOR', '2003-09-21', '2007-03-11', 'Littel-Turner', 8),
	(9, '2025-03-04 18:05:17.921405', 'BACHELOR', '2003-09-16', '2007-04-12', 'Schimmel LLC', 9),
	(10, '2025-03-04 18:05:17.961705', 'BACHELOR', '2004-01-13', '2007-10-20', 'Bechtelar Inc', 10);

-- Dumping structure for table authenticate_service.doctor_experiences
DROP TABLE IF EXISTS `doctor_experiences`;
CREATE TABLE IF NOT EXISTS `doctor_experiences` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `company_name` varchar(100) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `end_date` date NOT NULL,
  `specialization` varchar(150) NOT NULL,
  `start_date` date NOT NULL,
  `comp_address_id` bigint(20) NOT NULL,
  `doctor_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKl47o8476q5k3fhjbany3vy5lp` (`comp_address_id`),
  KEY `FKnoss5vksd9wtpthgxm30dqdbn` (`doctor_id`),
  CONSTRAINT `FKl47o8476q5k3fhjbany3vy5lp` FOREIGN KEY (`comp_address_id`) REFERENCES `addresses` (`id`),
  CONSTRAINT `FKnoss5vksd9wtpthgxm30dqdbn` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

-- Dumping data for table authenticate_service.doctor_experiences: ~30 rows (approximately)
DELETE FROM `doctor_experiences`;
INSERT INTO `doctor_experiences` (`id`, `company_name`, `created_at`, `description`, `end_date`, `specialization`, `start_date`, `comp_address_id`, `doctor_id`) VALUES
	(1, 'Hintz Group', '2025-03-04 18:05:17.544094', 'Ipsum quod dicta.', '2001-02-16', '', '2002-02-12', 2, 1),
	(2, 'Ebert-Cronin', '2025-03-04 18:05:17.554410', 'Quis totam incidunt ipsa.', '2000-10-10', '', '2002-10-01', 3, 1),
	(3, 'Kertzmann Inc', '2025-03-04 18:05:17.564947', 'Non aperiam amet.', '2000-12-06', '', '2001-05-20', 4, 1),
	(4, 'Cummerata Group', '2025-03-04 18:05:17.592050', 'Unde incidunt nostrum sit accusantium.', '2000-05-22', '', '2002-05-29', 6, 2),
	(5, 'Cremin Inc', '2025-03-04 18:05:17.600066', 'Facere nesciunt voluptates consectetur error commodi deleniti eius.', '2000-09-18', '', '2001-10-07', 7, 2),
	(6, 'Kreiger and Sons', '2025-03-04 18:05:17.610613', 'Esse eius nesciunt nisi.', '2000-05-05', '', '2001-10-25', 8, 2),
	(7, 'Emard-Schneider', '2025-03-04 18:05:17.633778', 'Minima ad quos sapiente.', '2000-07-11', '', '2002-07-26', 10, 3),
	(8, 'Huels-Gorczany', '2025-03-04 18:05:17.644311', 'Deserunt eaque tenetur nam minima earum.', '2000-07-28', '', '2002-02-26', 11, 3),
	(9, 'Bailey, Lubowitz and Steuber', '2025-03-04 18:05:17.654844', 'Harum animi numquam recusandae.', '2000-11-16', '', '2002-09-22', 12, 3),
	(10, 'Kilback-Zboncak', '2025-03-04 18:05:17.685468', 'Similique vero eveniet nesciunt non aperiam.', '2000-04-12', '', '2002-12-16', 14, 4),
	(11, 'Steuber, Doyle and Dare', '2025-03-04 18:05:17.694008', 'Modi molestiae dolores.', '2000-08-31', '', '2002-05-11', 15, 4),
	(12, 'Robel LLC', '2025-03-04 18:05:17.703575', 'Tenetur tempora doloribus illo voluptatum exercitationem cum quo.', '2000-05-12', '', '2003-02-28', 16, 4),
	(13, 'Kautzer-Swift', '2025-03-04 18:05:17.728196', 'Quisquam eveniet odit eligendi officia.', '2000-03-31', '', '2001-05-21', 18, 5),
	(14, 'Pacocha-Wiza', '2025-03-04 18:05:17.737726', 'Dicta earum distinctio ad.', '2000-03-05', '', '2001-05-13', 19, 5),
	(15, 'Becker, Streich and Greenfelder', '2025-03-04 18:05:17.745403', 'Fugiat dolorem sit.', '2000-09-19', '', '2002-03-27', 20, 5),
	(16, 'O\'Conner-Kris', '2025-03-04 18:05:17.768456', 'Fuga sapiente vel consequuntur minima nemo.', '2000-08-30', '', '2001-06-10', 22, 6),
	(17, 'Willms-Labadie', '2025-03-04 18:05:17.776529', 'Exercitationem praesentium earum at veniam ullam.', '2000-06-24', '', '2002-06-03', 23, 6),
	(18, 'Jacobi-Johnson', '2025-03-04 18:05:17.784510', 'Earum dolore laudantium.', '2000-12-21', '', '2003-02-24', 24, 6),
	(19, 'Walker-Bode', '2025-03-04 18:05:17.809127', 'Facilis officiis nulla hic.', '2000-08-20', '', '2001-11-29', 26, 7),
	(20, 'Kunde, Willms and Lockman', '2025-03-04 18:05:17.817334', 'Cupiditate enim vitae facilis in quaerat.', '2000-05-30', '', '2003-01-05', 27, 7),
	(21, 'Dare Group', '2025-03-04 18:05:17.825851', 'Ducimus totam in dicta nobis.', '2000-08-31', '', '2002-03-27', 28, 7),
	(22, 'Carter, White and Quigley', '2025-03-04 18:05:17.853100', 'Dolorem saepe nam architecto sit quae quia.', '2001-01-26', '', '2002-05-22', 30, 8),
	(23, 'Grimes-Cummerata', '2025-03-04 18:05:17.862634', 'Quas laudantium officiis repudiandae consequatur iste omnis omnis.', '2000-04-09', '', '2003-01-28', 31, 8),
	(24, 'Stiedemann, D\'Amore and Macejkovic', '2025-03-04 18:05:17.872175', 'Velit voluptates aliquam quam.', '2000-09-08', '', '2002-07-25', 32, 8),
	(25, 'Rogahn-Hudson', '2025-03-04 18:05:17.896830', 'Quisquam architecto in veniam quam ut veritatis error.', '2000-04-14', '', '2002-10-24', 34, 9),
	(26, 'Jacobi-O\'Conner', '2025-03-04 18:05:17.907356', 'Dolore repellat consequuntur et odio.', '2001-02-04', '', '2002-01-30', 35, 9),
	(27, 'Casper LLC', '2025-03-04 18:05:17.916893', 'Doloribus tenetur labore reiciendis eligendi dicta facere.', '2001-01-22', '', '2002-05-20', 36, 9),
	(28, 'Johns and Sons', '2025-03-04 18:05:17.941538', 'Eius cupiditate blanditiis.', '2001-03-03', '', '2001-04-07', 38, 10),
	(29, 'Medhurst-Shanahan', '2025-03-04 18:05:17.950638', 'Debitis fuga esse inventore illum.', '2000-06-05', '', '2001-09-21', 39, 10),
	(30, 'Bins and Sons', '2025-03-04 18:05:17.957706', 'Exercitationem ut fuga.', '2000-06-27', '', '2001-08-02', 40, 10);

-- Dumping structure for table authenticate_service.patients
DROP TABLE IF EXISTS `patients`;
CREATE TABLE IF NOT EXISTS `patients` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `avatar` varchar(500) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `dob` date NOT NULL,
  `email` varchar(200) NOT NULL,
  `email_verified` bit(1) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `sex` bit(1) NOT NULL,
  `status` bit(1) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `user_id` varchar(50) NOT NULL,
  `address_id` bigint(20) DEFAULT NULL,
  `authed_provider_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKa370hmxgv0l5c9panryr1ji7d` (`email`),
  UNIQUE KEY `UK9tbsl3fmey0eofbm2xj69v4qs` (`user_id`),
  UNIQUE KEY `UKpveescs3fe3p1eaabryivpydo` (`address_id`),
  KEY `FK7s92dg6yxcss33sqqh1d7dg1v` (`authed_provider_id`),
  CONSTRAINT `FK7s92dg6yxcss33sqqh1d7dg1v` FOREIGN KEY (`authed_provider_id`) REFERENCES `authenticate_provider` (`id`),
  CONSTRAINT `FKjc8017x8ae0rqi11m8jmny646` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

-- Dumping data for table authenticate_service.patients: ~33 rows (approximately)
DELETE FROM `patients`;
INSERT INTO `patients` (`id`, `avatar`, `created_at`, `dob`, `email`, `email_verified`, `first_name`, `last_name`, `password`, `phone`, `sex`, `status`, `updated_at`, `user_id`, `address_id`, `authed_provider_id`) VALUES
	(1, NULL, '2025-02-28 08:19:50.363986', '2003-09-13', 'tdminhnhat13092003@gmail.com', b'1', 'Nhat', 'Truong', '123456789', '0123456789', b'0', b'1', NULL, '20250228081950-93569-20030913', NULL, 1),
	(2, NULL, '2025-02-28 19:22:36.042887', '2000-01-02', 'skyherobrine13092003@gmail.com', b'0', 'Linh', 'Ngũ', '123456789', '0135792468', b'0', b'1', NULL, '20250228192235-63089-20000102', NULL, 1),
	(3, NULL, '2025-02-28 19:23:59.902233', '2000-10-01', 'nhatdev13092003@gmail.com', b'0', 'Vy', 'Nguyen', '123456789', '0129384756', b'1', b'1', NULL, '20250228192359-55935-20001001', NULL, 1),
	(4, NULL, '2025-03-04 18:20:50.451763', '2001-02-21', 'kelley.greenfelder@hotmail.com', b'0', 'Leslie', 'Tremblay', '2p7hdf9j7q', '(414) 902-8116', b'0', b'1', NULL, '20250304182049-40175-20010221', 41, 1),
	(5, NULL, '2025-03-04 18:20:50.517828', '1986-02-18', 'vina.ondricka@gmail.com', b'0', 'Johnathan', 'Wyman', '28hje83y3h9', '(730) 201-7158', b'0', b'1', NULL, '20250304182050-56975-19860218', 42, 1),
	(6, NULL, '2025-03-04 18:20:50.527399', '1990-03-30', 'peter.morissette@yahoo.com', b'0', 'Jeannine', 'Torp', 'l7qy35l8qdj16zc', '(305) 232-2688', b'0', b'1', NULL, '20250304182050-32009-19900330', 43, 1),
	(7, NULL, '2025-03-04 18:20:50.536901', '1988-05-23', 'trevor.johnston@yahoo.com', b'0', 'Ashley', 'Erdman', '36782ko4u5v27502', '(561) 540-5279', b'1', b'1', NULL, '20250304182050-82154-19880523', 44, 1),
	(8, NULL, '2025-03-04 18:20:50.547442', '1988-11-28', 'marcus.kling@hotmail.com', b'0', 'Annis', 'Doyle', '7wv1v24lcr7s7', '(305) 983-6503', b'0', b'1', NULL, '20250304182050-47732-19881128', 45, 1),
	(9, NULL, '2025-03-04 18:20:50.556452', '1975-09-25', 'avril.gutkowski@gmail.com', b'0', 'Valerie', 'Brakus', '36oi0416', '(983) 300-9340', b'0', b'1', NULL, '20250304182050-83383-19750925', 46, 1),
	(10, NULL, '2025-03-04 18:20:50.565585', '1967-10-02', 'erich.gorczany@hotmail.com', b'0', 'Rafael', 'Koch', '29l0g50xg', '(505) 601-6995', b'1', b'1', NULL, '20250304182050-38167-19671002', 47, 1),
	(11, NULL, '2025-03-04 18:20:50.576123', '1997-10-30', 'diedra.corwin@hotmail.com', b'0', 'Bryce', 'Hand', 'cbbk79lo9', '(305) 265-9885', b'1', b'1', NULL, '20250304182050-41137-19971030', 48, 1),
	(12, NULL, '2025-03-04 18:20:50.584698', '1983-08-20', 'catina.bernier@hotmail.com', b'0', 'Stanton', 'Johnson', '49w25h3v', '(313) 201-2829', b'1', b'1', NULL, '20250304182050-99844-19830820', 49, 1),
	(13, NULL, '2025-03-04 18:20:50.594227', '1973-01-30', 'sanford.schaden@yahoo.com', b'0', 'Silas', 'Howell', '233qk00710ksu807', '(234) 778-1906', b'0', b'1', NULL, '20250304182050-27503-19730130', 50, 1),
	(14, NULL, '2025-03-04 18:20:50.604747', '2001-06-23', 'katheleen.gottlieb@gmail.com', b'0', 'Toshiko', 'Ziemann', 'c157fl3pr4o', '(636) 311-1662', b'1', b'1', NULL, '20250304182050-47036-20010623', 51, 1),
	(15, NULL, '2025-03-04 18:20:50.615807', '2002-02-10', 'juliet.keebler@gmail.com', b'0', 'Claudio', 'Buckridge', '70o41wc8we', '(505) 635-9246', b'1', b'1', NULL, '20250304182050-74349-20020210', 52, 1),
	(16, NULL, '2025-03-04 18:20:50.628338', '1986-08-18', 'humberto.kub@hotmail.com', b'0', 'Deon', 'Gottlieb', 'o015ic812', '(252) 645-2702', b'0', b'1', NULL, '20250304182050-60369-19860818', 53, 1),
	(17, NULL, '2025-03-04 18:20:50.638873', '1997-05-25', 'lenora.rempel@yahoo.com', b'0', 'Benedict', 'Bahringer', 'xrjpjpc1a8', '(305) 293-3368', b'1', b'1', NULL, '20250304182050-83401-19970525', 54, 1),
	(18, NULL, '2025-03-04 18:20:50.650415', '1978-11-04', 'wendell.murray@gmail.com', b'0', 'Barrett', 'Glover', '27xe0pk87', '(505) 648-7073', b'1', b'1', NULL, '20250304182050-72921-19781104', 55, 1),
	(19, NULL, '2025-03-04 18:20:50.659942', '1987-03-27', 'angelo.gislason@gmail.com', b'0', 'Magaret', 'Kunze', 'b25u3t4fe33m7', '(680) 634-6703', b'1', b'1', NULL, '20250304182050-59530-19870327', 56, 1),
	(20, NULL, '2025-03-04 18:20:50.670027', '2004-04-25', 'marc.vandervort@hotmail.com', b'0', 'Sydney', 'Fadel', '6hd00dd8d3z84', '(305) 206-1616', b'0', b'1', NULL, '20250304182050-34472-20040425', 57, 1),
	(21, NULL, '2025-03-04 18:20:50.680071', '1998-03-25', 'twana.weber@yahoo.com', b'0', 'Myron', 'Spencer', 'nv9595plw5', '(505) 630-4490', b'1', b'1', NULL, '20250304182050-86688-19980325', 58, 1),
	(22, NULL, '2025-03-04 18:20:50.690126', '2007-02-28', 'jed.mclaughlin@yahoo.com', b'0', 'Howard', 'Fay', 'd6zn9x1kf0youq', '(727) 230-5263', b'0', b'1', NULL, '20250304182050-89117-20070228', 59, 1),
	(23, NULL, '2025-03-04 18:20:50.699103', '1960-12-22', 'lenna.white@gmail.com', b'0', 'Franklin', 'Dietrich', '3852y8awg', '(505) 690-9903', b'0', b'1', NULL, '20250304182050-78903-19601222', 60, 1),
	(24, NULL, '2025-03-04 18:20:50.707619', '1955-10-04', 'romona.smitham@yahoo.com', b'0', 'Val', 'Harber', '99qbm4c85o', '(983) 898-4187', b'0', b'1', NULL, '20250304182050-59751-19551004', 61, 1),
	(25, NULL, '2025-03-04 18:20:50.714633', '1978-10-17', 'leon.zieme@gmail.com', b'0', 'Mayra', 'Auer', 'a6o84900', '(505) 621-7008', b'0', b'1', NULL, '20250304182050-31302-19781017', 62, 1),
	(26, NULL, '2025-03-04 18:20:50.723166', '1968-05-03', 'dimple.anderson@hotmail.com', b'0', 'Leeann', 'McKenzie', '0r1p1xgi6', '(828) 690-7431', b'0', b'1', NULL, '20250304182050-93840-19680503', 63, 1),
	(27, NULL, '2025-03-04 18:20:50.730111', '1989-07-08', 'eusebio.herzog@hotmail.com', b'0', 'Elva', 'Littel', 't1cd5131f235sk3', '(805) 531-6795', b'0', b'1', NULL, '20250304182050-91670-19890708', 64, 1),
	(28, NULL, '2025-03-04 18:20:50.738105', '1997-01-06', 'davida.strosin@hotmail.com', b'0', 'Josiah', 'Moen', '4cc888iu2fl', '(305) 204-8347', b'1', b'1', NULL, '20250304182050-60679-19970106', 65, 1),
	(29, NULL, '2025-03-04 18:20:50.746613', '1976-04-17', 'mitzi.hane@yahoo.com', b'0', 'Walker', 'Toy', 'm2x455bc66v4v', '(305) 434-4861', b'0', b'1', NULL, '20250304182050-66373-19760417', 66, 1),
	(30, NULL, '2025-03-04 18:20:50.756140', '1970-07-05', 'teri.weber@yahoo.com', b'0', 'Miguel', 'Marks', 'oqh7j29969341x', '(350) 870-7432', b'1', b'1', NULL, '20250304182050-71357-19700705', 67, 1),
	(31, NULL, '2025-03-04 18:20:50.763485', '1996-12-30', 'eddie.barrows@yahoo.com', b'0', 'Hertha', 'Gusikowski', 'm903w9710o916lkw', '(983) 794-4826', b'1', b'1', NULL, '20250304182050-16310-19961230', 68, 1),
	(32, NULL, '2025-03-04 18:20:50.771483', '1967-05-27', 'jeniffer.beier@gmail.com', b'0', 'Margert', 'Durgan', '3110g050927u96', '(505) 894-3265', b'1', b'1', NULL, '20250304182050-89821-19670527', 69, 1),
	(33, NULL, '2025-03-04 18:20:50.781057', '2003-10-04', 'johanna.johnston@gmail.com', b'0', 'Sina', 'Swaniawski', 'b8495zswb3', '(730) 645-4969', b'0', b'1', NULL, '20250304182050-25278-20031004', 70, 1);

-- Dumping structure for table authenticate_service.patient_face_encodes
DROP TABLE IF EXISTS `patient_face_encodes`;
CREATE TABLE IF NOT EXISTS `patient_face_encodes` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `in_front_of_encode` varchar(5000) NOT NULL,
  `left_encode` varchar(5000) NOT NULL,
  `right_encode` varchar(5000) NOT NULL,
  `patient_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKg76pu2iqt0woxcsvj4xmx9tgl` (`patient_id`),
  CONSTRAINT `FKcao55bflc5bi4o6c64aimsnmb` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

-- Dumping data for table authenticate_service.patient_face_encodes: ~0 rows (approximately)
DELETE FROM `patient_face_encodes`;

-- Dumping structure for table authenticate_service.type_diseases
DROP TABLE IF EXISTS `type_diseases`;
CREATE TABLE IF NOT EXISTS `type_diseases` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `name` varchar(100) NOT NULL,
  `status` bit(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKpbl5knbx178mflcgajpwk3f6q` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

-- Dumping data for table authenticate_service.type_diseases: ~8 rows (approximately)
DELETE FROM `type_diseases`;
INSERT INTO `type_diseases` (`id`, `created_at`, `name`, `status`) VALUES
	(1, '2025-03-04 17:06:05.353767', 'SÂU RĂNG', b'1'),
	(2, '2025-03-04 17:06:14.141431', 'VÔI RĂNG', b'1'),
	(3, '2025-03-04 17:06:21.041771', 'KHÁC', b'1'),
	(4, '2025-03-04 17:07:21.711850', 'VIÊM NƯỚU', b'1'),
	(5, '2025-03-04 17:07:31.290151', 'VIÊM NHA CHU', b'1'),
	(6, '2025-03-04 17:07:44.660812', 'MÒN RĂNG', b'1'),
	(7, '2025-03-04 17:07:49.849652', 'RĂNG KHÔN', b'1'),
	(8, '2025-03-04 17:07:56.685278', 'HÔI MIỆNG', b'1');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
