-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               11.7.2-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.10.0.7000
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

-- Dumping data for table admin_service.addresses: ~3 rows (approximately)
DELETE FROM `addresses`;
INSERT INTO `addresses` (`id`, `city`, `country`, `created_at`, `district`, `number`, `street`, `updated_at`, `ward`) VALUES
	(1, NULL, NULL, '2025-04-09 00:49:25.922132', NULL, NULL, NULL, NULL, NULL),
	(2, 'Hồ Chí Minh', 'Việt Nam', '2025-04-09 00:49:32.136136', 'Gò Vấp', '123/321', 'Dương Quảng Hàm', NULL, '10'),
	(3, NULL, NULL, '2025-04-09 01:09:33.085097', NULL, NULL, NULL, NULL, NULL);

-- Dumping structure for table admin_service.admins
DROP TABLE IF EXISTS `admins`;
CREATE TABLE IF NOT EXISTS `admins` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `avatar` varchar(500) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `dob` date NOT NULL,
  `email` varchar(200) NOT NULL,
  `email_verified` bit(1) NOT NULL,
  `face_encode_value` varchar(5000) DEFAULT NULL,
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

-- Dumping structure for table admin_service.authenticate_provider
DROP TABLE IF EXISTS `authenticate_provider`;
CREATE TABLE IF NOT EXISTS `authenticate_provider` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `authen_name` varchar(100) NOT NULL,
  `status` bit(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKmch87ongxq9k1dysaggwe2ggf` (`authen_name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

-- Dumping data for table admin_service.authenticate_provider: ~1 rows (approximately)
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
  `face_encode_value` varchar(5000) DEFAULT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

-- Dumping data for table admin_service.doctors: ~2 rows (approximately)
DELETE FROM `doctors`;
INSERT INTO `doctors` (`id`, `avatar`, `created_at`, `dob`, `email`, `email_verified`, `face_encode_value`, `first_name`, `last_name`, `password`, `phone`, `sex`, `status`, `updated_at`, `user_id`, `specialization`, `address_id`, `authed_provider_id`, `type_disease`) VALUES
	(1, NULL, '2025-04-09 00:49:25.920128', '1990-05-10', 'minhthu281103@gmail.com', b'0', '', 'Thư', 'Lê', '123456789', '0246813579', b'0', b'1', NULL, '20250409004925-20533-19900510', 'TÂM LÝ HỌC TÂM THẦN', 1, 1, 4),
	(2, NULL, '2025-04-09 01:09:33.085097', '1990-05-10', 'joebidden@gmail.com', b'0', '', 'Joe', 'Bidden', '123456789', '035792468', b'0', b'1', NULL, '20250409010933-55428-19900510', 'TÂM LÝ HỌC CẢM XÚC', 3, 1, 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

-- Dumping data for table admin_service.doctor_certificates: ~2 rows (approximately)
DELETE FROM `doctor_certificates`;
INSERT INTO `doctor_certificates` (`id`, `cert_name`, `created_at`, `issue_date`, `doctor_id`) VALUES
	(1, 'CHỨNG CHỈ TÂM LÝ HỌC', '2025-04-09 00:49:28.026415', '2012-06-21', 1),
	(2, 'CHỨNG CHỈ TÂM LÝ HỌC', '2025-04-09 01:09:35.108836', '2012-06-21', 2);

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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

-- Dumping data for table admin_service.doctor_educations: ~2 rows (approximately)
DELETE FROM `doctor_educations`;
INSERT INTO `doctor_educations` (`id`, `created_at`, `diploma`, `graduate_date`, `join_date`, `school_name`, `doctor_id`) VALUES
	(1, '2025-04-09 00:49:30.059415', 'BACHELOR', '2012-06-21', '2008-09-10', 'ĐẠI HỌC Y HÀ NỘI', 1),
	(2, '2025-04-09 01:09:37.122932', 'BACHELOR', '2012-06-21', '2008-09-10', 'ĐẠI HỌC Y HÀ NỘI', 2);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

-- Dumping data for table admin_service.doctor_experiences: ~1 rows (approximately)
DELETE FROM `doctor_experiences`;
INSERT INTO `doctor_experiences` (`id`, `company_name`, `created_at`, `description`, `end_date`, `specialization`, `start_date`, `comp_address_id`, `doctor_id`) VALUES
	(1, 'TÂM LÝ HỌC THUẬN AN', '2025-04-09 00:49:32.159440', NULL, '2024-12-10', 'TÂM LÝ HỌC TÂM THẦN', '2012-09-02', 2, 1);

-- Dumping structure for table admin_service.drugs
DROP TABLE IF EXISTS `drugs`;
CREATE TABLE IF NOT EXISTS `drugs` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `drug_name` varchar(150) NOT NULL,
  `drug_type` varchar(300) NOT NULL,
  `unit` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

-- Dumping data for table admin_service.drugs: ~15 rows (approximately)
DELETE FROM `drugs`;
INSERT INTO `drugs` (`id`, `created_at`, `drug_name`, `drug_type`, `unit`) VALUES
	(1, '2025-04-09 00:27:48.298580', 'Fluoxetine', 'Thuốc Chống Trầm Cảm', '20 mg/viên'),
	(2, '2025-04-09 00:29:07.262295', 'Sertraline', 'Thuốc Chống Trầm Cảm', '50mg/viên'),
	(3, '2025-04-09 00:31:28.118114', 'Mirtazapine', 'Thuốc Chống Trầm Cảm', '15mg/viên'),
	(4, '2025-04-09 00:31:48.998542', 'Diazepam', 'Thuốc Chống Lo Âu', '10mg/viên'),
	(5, '2025-04-09 00:31:58.003571', 'Lorazepam', 'Thuốc Chống Lo Âu', '2mg/viên'),
	(6, '2025-04-09 00:33:05.078145', 'Alprazolam', 'Thuốc Chống Lo Âu', '0.25mg/viên'),
	(7, '2025-04-09 00:33:31.632064', 'Lithium carbonate', 'Thuốc Ổn Định Tâm Trạng', '300mg/viên'),
	(8, '2025-04-09 00:34:45.706967', 'Lamotrigine', 'Thuốc Ổn Định Tâm Trạng', '25mg/viên'),
	(9, '2025-04-09 00:35:12.917266', 'Carbamazepine', 'Thuốc Ổn Định Tâm Trạng', '200mg/viên'),
	(10, '2025-04-09 00:36:44.628290', 'Risperidone', 'Thuốc Chống Loạn Thần', '1mg/viên'),
	(11, '2025-04-09 00:37:02.558346', 'Olanzapine', 'Thuốc Chống Loạn Thần', '5mg/viên'),
	(12, '2025-04-09 00:37:11.903117', 'Quetiapine', 'Thuốc Chống Loạn Thần', '25mg/viên'),
	(13, '2025-04-09 00:37:39.295570', 'Zolpidem', 'Thuốc Hỗ Trợ Giấc Ngủ', '5mg/viên'),
	(14, '2025-04-09 00:38:14.445929', 'Quetiapine (liều thấp)', 'Thuốc Hỗ Trợ Giấc Ngủ', '25mg/viên'),
	(15, '2025-04-09 00:39:14.333611', 'Melatonin', 'Thuốc Hỗ Trợ Giấc Ngủ', '3mg/viên');

-- Dumping structure for table admin_service.patients
DROP TABLE IF EXISTS `patients`;
CREATE TABLE IF NOT EXISTS `patients` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `avatar` varchar(500) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `dob` date NOT NULL,
  `email` varchar(200) NOT NULL,
  `email_verified` bit(1) NOT NULL,
  `face_encode_value` varchar(5000) DEFAULT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

-- Dumping data for table admin_service.patients: ~1 rows (approximately)
DELETE FROM `patients`;
INSERT INTO `patients` (`id`, `avatar`, `created_at`, `dob`, `email`, `email_verified`, `face_encode_value`, `first_name`, `last_name`, `password`, `phone`, `sex`, `status`, `updated_at`, `user_id`, `address_id`, `authed_provider_id`) VALUES
	(1, NULL, '2025-04-09 00:01:48.649487', '1946-06-14', 'donaldtrump@gmail.com', b'0', '0.10584330558776855,0.13875123858451843,0.017335709184408188,-0.034396834671497345,0.0634281262755394,0.1731046438217163,0.13706965744495392,0.1279967874288559,-0.20125851035118103,0.1432647705078125,-0.016337769106030464,0.04654732719063759,0.09448826313018799,-0.14152637124061584,0.09778915345668793,-0.02033647708594799,0.09336532652378082,0.03785158321261406,-0.014978325925767422,-0.01065089926123619,0.08321639895439148,0.06275706738233566,-0.09443117678165436,0.06672995537519455,0.02548397332429886,-0.020930727943778038,-0.09379740059375763,-0.1023077517747879,0.06712616235017776,0.127790167927742,-0.07611799240112305,0.03837759420275688,-0.08349186927080154,0.08980368077754974,0.01547415554523468,-0.1361146718263626,0.04725499823689461,-0.025039980188012123,0.049504172056913376,-0.014677601866424084,0.038522396236658096,-0.06674099713563919,0.10104412585496902,0.06536762416362762,-0.07993385195732117,0.006556610111147165,0.12748196721076965,-0.05896943435072899,-0.1696457862854004,-0.017484785988926888,0.2638590335845947,-0.026486936956644058,-0.11667561531066895,0.008834133855998516,0.06422130018472672,0.014854923821985722,-0.05251426622271538,0.035479795187711716,0.048541177064180374,-0.07095971703529358,0.004742802586406469,-0.09870276600122452,-0.029856251552700996,-0.1513420045375824,0.07640501111745834,-0.12929591536521912,0.0021999350283294916,-0.022297585383057594,-0.10714013874530792,-0.05744510516524315,0.023083405569195747,0.09507455676794052,-0.056554775685071945,-0.07993900775909424,-0.04638156667351723,0.0924389660358429,-0.010323582217097282,0.10469857603311539,0.08798302710056305,0.08940759301185608,-0.029620077461004257,-0.011434666812419891,0.12538853287696838,0.09091522544622421,0.059597987681627274,-0.08719949424266815,0.11513292044401169,-0.04865673929452896,0.07340408861637115,0.05124524608254433,-0.13828705251216888,-0.10107102990150452,-0.12693481147289276,0.048568710684776306,-0.1492796242237091,-0.03339071571826935,0.1399904489517212,-0.008997241035103798,-0.08009881526231766,-0.0026522742118686438,-0.003236828139051795,0.16625501215457916,0.007123994641005993,0.1711837649345398,-0.18761046230793,-0.04617668315768242,-0.1000283807516098,0.10408741235733032,-0.05619249492883682,-0.04356605187058449,0.06135101616382599,0.0009394040098413825,-0.14605748653411865,-0.025118842720985413,0.03374747559428215,-0.02206031233072281,-0.10726196318864822,-0.08281461894512177,-0.11964135617017746,0.0577523410320282,0.016832564026117325,-0.012915853410959244,0.04364259913563728,0.015186404809355736,0.13587065041065216,-0.013775747269392014,0.023463400080800056,-0.08957294374704361', 'Donald', 'Trump', '123456789', '0129384756', b'0', b'1', NULL, '20250409000148-52838-19460614', NULL, 1);

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

-- Dumping structure for table admin_service.shifts
DROP TABLE IF EXISTS `shifts`;
CREATE TABLE IF NOT EXISTS `shifts` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `end` time(6) NOT NULL,
  `shift` int(11) NOT NULL,
  `start` time(6) NOT NULL,
  `status` bit(1) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

-- Dumping data for table admin_service.shifts: ~2 rows (approximately)
DELETE FROM `shifts`;
INSERT INTO `shifts` (`id`, `created_at`, `end`, `shift`, `start`, `status`, `updated_at`) VALUES
	(1, '2025-04-09 00:07:02.102611', '11:00:00.000000', 1, '07:00:00.000000', b'1', '2025-04-09 00:07:02.102611'),
	(2, '2025-04-09 00:07:18.252282', '17:00:00.000000', 2, '13:00:00.000000', b'1', '2025-04-09 00:07:18.252282');

-- Dumping structure for table admin_service.type_diseases
DROP TABLE IF EXISTS `type_diseases`;
CREATE TABLE IF NOT EXISTS `type_diseases` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `name` varchar(100) NOT NULL,
  `status` bit(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKpbl5knbx178mflcgajpwk3f6q` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

-- Dumping data for table admin_service.type_diseases: ~9 rows (approximately)
DELETE FROM `type_diseases`;
INSERT INTO `type_diseases` (`id`, `created_at`, `name`, `status`) VALUES
	(1, '2025-04-09 00:08:37.330874', 'TRẦM CẢM', b'1'),
	(2, '2025-04-09 00:08:51.607775', 'RỐI LOẠN LO ÂU', b'1'),
	(3, '2025-04-09 00:09:04.146636', 'RỐI LOẠN LƯỠNG CỰC', b'1'),
	(4, '2025-04-09 00:09:15.827363', 'TÂM THẦN PHÂN LIỆT', b'1'),
	(5, '2025-04-09 00:09:33.089745', 'RỐI LOẠN ÁM ẢNH CƯỠNG CHẾ', b'1'),
	(6, '2025-04-09 00:09:43.963199', 'RỐI LOẠN ĂN UỐNG', b'1'),
	(7, '2025-04-09 00:10:04.259456', 'RỐI LOẠN CĂNG THẲNG SAU SANG CHẤN', b'1'),
	(8, '2025-04-09 00:10:15.236747', 'RỐI LOẠN NHÂN CÁCH', b'1'),
	(9, '2025-04-09 00:10:19.659104', 'KHÁC', b'1');


-- Dumping database structure for appointment_service
DROP DATABASE IF EXISTS `appointment_service`;
CREATE DATABASE IF NOT EXISTS `appointment_service` /*!40100 DEFAULT CHARACTER SET utf8mb3 COLLATE utf8mb3_bin */;
USE `appointment_service`;

-- Dumping structure for table appointment_service.drugs
DROP TABLE IF EXISTS `drugs`;
CREATE TABLE IF NOT EXISTS `drugs` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `drug_name` varchar(150) NOT NULL,
  `drug_type` varchar(300) NOT NULL,
  `unit` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

-- Dumping data for table appointment_service.drugs: ~15 rows (approximately)
DELETE FROM `drugs`;
INSERT INTO `drugs` (`id`, `created_at`, `drug_name`, `drug_type`, `unit`) VALUES
	(1, '2025-04-09 00:27:48.593902', 'Fluoxetine', 'Thuốc Chống Trầm Cảm', '20 mg/viên'),
	(2, '2025-04-09 00:29:07.263296', 'Sertraline', 'Thuốc Chống Trầm Cảm', '50mg/viên'),
	(3, '2025-04-09 00:31:28.118114', 'Mirtazapine', 'Thuốc Chống Trầm Cảm', '15mg/viên'),
	(4, '2025-04-09 00:31:48.998542', 'Diazepam', 'Thuốc Chống Lo Âu', '10mg/viên'),
	(5, '2025-04-09 00:31:58.007083', 'Lorazepam', 'Thuốc Chống Lo Âu', '2mg/viên'),
	(6, '2025-04-09 00:33:04.994412', 'Alprazolam', 'Thuốc Chống Lo Âu', '0.25mg/viên'),
	(7, '2025-04-09 00:33:31.632064', 'Lithium carbonate', 'Thuốc Ổn Định Tâm Trạng', '300mg/viên'),
	(8, '2025-04-09 00:34:45.706967', 'Lamotrigine', 'Thuốc Ổn Định Tâm Trạng', '25mg/viên'),
	(9, '2025-04-09 00:35:12.925920', 'Carbamazepine', 'Thuốc Ổn Định Tâm Trạng', '200mg/viên'),
	(10, '2025-04-09 00:36:44.635844', 'Risperidone', 'Thuốc Chống Loạn Thần', '1mg/viên'),
	(11, '2025-04-09 00:37:02.558346', 'Olanzapine', 'Thuốc Chống Loạn Thần', '5mg/viên'),
	(12, '2025-04-09 00:37:11.904626', 'Quetiapine', 'Thuốc Chống Loạn Thần', '25mg/viên'),
	(13, '2025-04-09 00:37:39.297569', 'Zolpidem', 'Thuốc Hỗ Trợ Giấc Ngủ', '5mg/viên'),
	(14, '2025-04-09 00:38:14.446930', 'Quetiapine (liều thấp)', 'Thuốc Hỗ Trợ Giấc Ngủ', '25mg/viên'),
	(15, '2025-04-09 00:39:14.336611', 'Melatonin', 'Thuốc Hỗ Trợ Giấc Ngủ', '3mg/viên');


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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

-- Dumping data for table authenticate_service.addresses: ~3 rows (approximately)
DELETE FROM `addresses`;
INSERT INTO `addresses` (`id`, `city`, `country`, `created_at`, `district`, `number`, `street`, `updated_at`, `ward`) VALUES
	(1, NULL, NULL, '2025-04-09 00:49:26.239222', NULL, NULL, NULL, NULL, NULL),
	(2, 'Hồ Chí Minh', 'Việt Nam', '2025-04-09 00:49:32.221342', 'Gò Vấp', '123/321', 'Dương Quảng Hàm', NULL, '10'),
	(3, NULL, NULL, '2025-04-09 01:09:33.097091', NULL, NULL, NULL, NULL, NULL);

-- Dumping structure for table authenticate_service.admins
DROP TABLE IF EXISTS `admins`;
CREATE TABLE IF NOT EXISTS `admins` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `avatar` varchar(500) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `dob` date NOT NULL,
  `email` varchar(200) NOT NULL,
  `email_verified` bit(1) NOT NULL,
  `face_encode_value` varchar(5000) DEFAULT NULL,
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

-- Dumping data for table authenticate_service.authenticate_provider: ~1 rows (approximately)
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
  `face_encode_value` varchar(5000) DEFAULT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

-- Dumping data for table authenticate_service.doctors: ~2 rows (approximately)
DELETE FROM `doctors`;
INSERT INTO `doctors` (`id`, `avatar`, `created_at`, `dob`, `email`, `email_verified`, `face_encode_value`, `first_name`, `last_name`, `password`, `phone`, `sex`, `status`, `updated_at`, `user_id`, `specialization`, `address_id`, `authed_provider_id`, `type_disease`) VALUES
	(1, NULL, '2025-04-09 00:49:26.224129', '1990-05-10', 'minhthu281103@gmail.com', b'0', '', 'Thư', 'Lê', '123456789', '0246813579', b'0', b'1', NULL, '20250409004925-20533-19900510', 'TÂM LÝ HỌC TÂM THẦN', 1, 1, 4),
	(2, NULL, '2025-04-09 01:09:33.097091', '1990-05-10', 'joebidden@gmail.com', b'0', '', 'Joe', 'Bidden', '123456789', '035792468', b'0', b'1', NULL, '20250409010933-55428-19900510', 'TÂM LÝ HỌC CẢM XÚC', 3, 1, 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

-- Dumping data for table authenticate_service.doctor_certificates: ~2 rows (approximately)
DELETE FROM `doctor_certificates`;
INSERT INTO `doctor_certificates` (`id`, `cert_name`, `created_at`, `issue_date`, `doctor_id`) VALUES
	(1, 'CHỨNG CHỈ TÂM LÝ HỌC', '2025-04-09 00:49:28.056455', '2012-06-21', 1),
	(2, 'CHỨNG CHỈ TÂM LÝ HỌC', '2025-04-09 01:09:35.119127', '2012-06-21', 2);

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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

-- Dumping data for table authenticate_service.doctor_educations: ~2 rows (approximately)
DELETE FROM `doctor_educations`;
INSERT INTO `doctor_educations` (`id`, `created_at`, `diploma`, `graduate_date`, `join_date`, `school_name`, `doctor_id`) VALUES
	(1, '2025-04-09 00:49:30.081370', 'BACHELOR', '2012-06-21', '2008-09-10', 'ĐẠI HỌC Y HÀ NỘI', 1),
	(2, '2025-04-09 01:09:37.131925', 'BACHELOR', '2012-06-21', '2008-09-10', 'ĐẠI HỌC Y HÀ NỘI', 2);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

-- Dumping data for table authenticate_service.doctor_experiences: ~1 rows (approximately)
DELETE FROM `doctor_experiences`;
INSERT INTO `doctor_experiences` (`id`, `company_name`, `created_at`, `description`, `end_date`, `specialization`, `start_date`, `comp_address_id`, `doctor_id`) VALUES
	(1, 'TÂM LÝ HỌC THUẬN AN', '2025-04-09 00:49:32.244416', NULL, '2024-12-10', 'TÂM LÝ HỌC TÂM THẦN', '2012-09-02', 2, 1);

-- Dumping structure for table authenticate_service.patients
DROP TABLE IF EXISTS `patients`;
CREATE TABLE IF NOT EXISTS `patients` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `avatar` varchar(500) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `dob` date NOT NULL,
  `email` varchar(200) NOT NULL,
  `email_verified` bit(1) NOT NULL,
  `face_encode_value` varchar(5000) DEFAULT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

-- Dumping data for table authenticate_service.patients: ~1 rows (approximately)
DELETE FROM `patients`;
INSERT INTO `patients` (`id`, `avatar`, `created_at`, `dob`, `email`, `email_verified`, `face_encode_value`, `first_name`, `last_name`, `password`, `phone`, `sex`, `status`, `updated_at`, `user_id`, `address_id`, `authed_provider_id`) VALUES
	(1, NULL, '2025-04-09 00:01:48.537920', '1946-06-14', 'donaldtrump@gmail.com', b'0', '0.10584330558776855,0.13875123858451843,0.017335709184408188,-0.034396834671497345,0.0634281262755394,0.1731046438217163,0.13706965744495392,0.1279967874288559,-0.20125851035118103,0.1432647705078125,-0.016337769106030464,0.04654732719063759,0.09448826313018799,-0.14152637124061584,0.09778915345668793,-0.02033647708594799,0.09336532652378082,0.03785158321261406,-0.014978325925767422,-0.01065089926123619,0.08321639895439148,0.06275706738233566,-0.09443117678165436,0.06672995537519455,0.02548397332429886,-0.020930727943778038,-0.09379740059375763,-0.1023077517747879,0.06712616235017776,0.127790167927742,-0.07611799240112305,0.03837759420275688,-0.08349186927080154,0.08980368077754974,0.01547415554523468,-0.1361146718263626,0.04725499823689461,-0.025039980188012123,0.049504172056913376,-0.014677601866424084,0.038522396236658096,-0.06674099713563919,0.10104412585496902,0.06536762416362762,-0.07993385195732117,0.006556610111147165,0.12748196721076965,-0.05896943435072899,-0.1696457862854004,-0.017484785988926888,0.2638590335845947,-0.026486936956644058,-0.11667561531066895,0.008834133855998516,0.06422130018472672,0.014854923821985722,-0.05251426622271538,0.035479795187711716,0.048541177064180374,-0.07095971703529358,0.004742802586406469,-0.09870276600122452,-0.029856251552700996,-0.1513420045375824,0.07640501111745834,-0.12929591536521912,0.0021999350283294916,-0.022297585383057594,-0.10714013874530792,-0.05744510516524315,0.023083405569195747,0.09507455676794052,-0.056554775685071945,-0.07993900775909424,-0.04638156667351723,0.0924389660358429,-0.010323582217097282,0.10469857603311539,0.08798302710056305,0.08940759301185608,-0.029620077461004257,-0.011434666812419891,0.12538853287696838,0.09091522544622421,0.059597987681627274,-0.08719949424266815,0.11513292044401169,-0.04865673929452896,0.07340408861637115,0.05124524608254433,-0.13828705251216888,-0.10107102990150452,-0.12693481147289276,0.048568710684776306,-0.1492796242237091,-0.03339071571826935,0.1399904489517212,-0.008997241035103798,-0.08009881526231766,-0.0026522742118686438,-0.003236828139051795,0.16625501215457916,0.007123994641005993,0.1711837649345398,-0.18761046230793,-0.04617668315768242,-0.1000283807516098,0.10408741235733032,-0.05619249492883682,-0.04356605187058449,0.06135101616382599,0.0009394040098413825,-0.14605748653411865,-0.025118842720985413,0.03374747559428215,-0.02206031233072281,-0.10726196318864822,-0.08281461894512177,-0.11964135617017746,0.0577523410320282,0.016832564026117325,-0.012915853410959244,0.04364259913563728,0.015186404809355736,0.13587065041065216,-0.013775747269392014,0.023463400080800056,-0.08957294374704361', 'Donald', 'Trump', '123456789', '0129384756', b'0', b'1', NULL, '20250409000148-52838-19460614', NULL, 1);

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

-- Dumping structure for table authenticate_service.shifts
DROP TABLE IF EXISTS `shifts`;
CREATE TABLE IF NOT EXISTS `shifts` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `end` time(6) NOT NULL,
  `shift` int(11) NOT NULL,
  `start` time(6) NOT NULL,
  `status` bit(1) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

-- Dumping data for table authenticate_service.shifts: ~2 rows (approximately)
DELETE FROM `shifts`;
INSERT INTO `shifts` (`id`, `created_at`, `end`, `shift`, `start`, `status`, `updated_at`) VALUES
	(1, '2025-04-09 00:07:02.184562', '11:00:00.000000', 1, '07:00:00.000000', b'1', '2025-04-09 00:07:02.184562'),
	(2, '2025-04-09 00:07:18.257279', '17:00:00.000000', 2, '13:00:00.000000', b'1', '2025-04-09 00:07:18.257279');

-- Dumping structure for table authenticate_service.type_diseases
DROP TABLE IF EXISTS `type_diseases`;
CREATE TABLE IF NOT EXISTS `type_diseases` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `name` varchar(100) NOT NULL,
  `status` bit(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKpbl5knbx178mflcgajpwk3f6q` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

-- Dumping data for table authenticate_service.type_diseases: ~9 rows (approximately)
DELETE FROM `type_diseases`;
INSERT INTO `type_diseases` (`id`, `created_at`, `name`, `status`) VALUES
	(1, '2025-04-09 00:08:37.337330', 'TRẦM CẢM', b'1'),
	(2, '2025-04-09 00:08:51.611769', 'RỐI LOẠN LO ÂU', b'1'),
	(3, '2025-04-09 00:09:04.141639', 'RỐI LOẠN LƯỠNG CỰC', b'1'),
	(4, '2025-04-09 00:09:15.830801', 'TÂM THẦN PHÂN LIỆT', b'1'),
	(5, '2025-04-09 00:09:33.089745', 'RỐI LOẠN ÁM ẢNH CƯỠNG CHẾ', b'1'),
	(6, '2025-04-09 00:09:43.967506', 'RỐI LOẠN ĂN UỐNG', b'1'),
	(7, '2025-04-09 00:10:04.265532', 'RỐI LOẠN CĂNG THẲNG SAU SANG CHẤN', b'1'),
	(8, '2025-04-09 00:10:15.240746', 'RỐI LOẠN NHÂN CÁCH', b'1'),
	(9, '2025-04-09 00:10:19.665100', 'KHÁC', b'1');


-- Dumping database structure for image_detect_service
DROP DATABASE IF EXISTS `image_detect_service`;
CREATE DATABASE IF NOT EXISTS `image_detect_service` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin */;
USE `image_detect_service`;

-- Dumping structure for table image_detect_service.auth_group
DROP TABLE IF EXISTS `auth_group`;
CREATE TABLE IF NOT EXISTS `auth_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Dumping data for table image_detect_service.auth_group: ~0 rows (approximately)
DELETE FROM `auth_group`;

-- Dumping structure for table image_detect_service.auth_group_permissions
DROP TABLE IF EXISTS `auth_group_permissions`;
CREATE TABLE IF NOT EXISTS `auth_group_permissions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `group_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Dumping data for table image_detect_service.auth_group_permissions: ~0 rows (approximately)
DELETE FROM `auth_group_permissions`;

-- Dumping structure for table image_detect_service.auth_permission
DROP TABLE IF EXISTS `auth_permission`;
CREATE TABLE IF NOT EXISTS `auth_permission` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int(11) NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Dumping data for table image_detect_service.auth_permission: ~28 rows (approximately)
DELETE FROM `auth_permission`;
INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES
	(1, 'Can add log entry', 1, 'add_logentry'),
	(2, 'Can change log entry', 1, 'change_logentry'),
	(3, 'Can delete log entry', 1, 'delete_logentry'),
	(4, 'Can view log entry', 1, 'view_logentry'),
	(5, 'Can add permission', 2, 'add_permission'),
	(6, 'Can change permission', 2, 'change_permission'),
	(7, 'Can delete permission', 2, 'delete_permission'),
	(8, 'Can view permission', 2, 'view_permission'),
	(9, 'Can add group', 3, 'add_group'),
	(10, 'Can change group', 3, 'change_group'),
	(11, 'Can delete group', 3, 'delete_group'),
	(12, 'Can view group', 3, 'view_group'),
	(13, 'Can add user', 4, 'add_user'),
	(14, 'Can change user', 4, 'change_user'),
	(15, 'Can delete user', 4, 'delete_user'),
	(16, 'Can view user', 4, 'view_user'),
	(17, 'Can add content type', 5, 'add_contenttype'),
	(18, 'Can change content type', 5, 'change_contenttype'),
	(19, 'Can delete content type', 5, 'delete_contenttype'),
	(20, 'Can view content type', 5, 'view_contenttype'),
	(21, 'Can add session', 6, 'add_session'),
	(22, 'Can change session', 6, 'change_session'),
	(23, 'Can delete session', 6, 'delete_session'),
	(24, 'Can view session', 6, 'view_session'),
	(25, 'Can add user', 7, 'add_user'),
	(26, 'Can change user', 7, 'change_user'),
	(27, 'Can delete user', 7, 'delete_user'),
	(28, 'Can view user', 7, 'view_user');

-- Dumping structure for table image_detect_service.auth_user
DROP TABLE IF EXISTS `auth_user`;
CREATE TABLE IF NOT EXISTS `auth_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Dumping data for table image_detect_service.auth_user: ~0 rows (approximately)
DELETE FROM `auth_user`;

-- Dumping structure for table image_detect_service.auth_user_groups
DROP TABLE IF EXISTS `auth_user_groups`;
CREATE TABLE IF NOT EXISTS `auth_user_groups` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`),
  CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Dumping data for table image_detect_service.auth_user_groups: ~0 rows (approximately)
DELETE FROM `auth_user_groups`;

-- Dumping structure for table image_detect_service.auth_user_user_permissions
DROP TABLE IF EXISTS `auth_user_user_permissions`;
CREATE TABLE IF NOT EXISTS `auth_user_user_permissions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Dumping data for table image_detect_service.auth_user_user_permissions: ~0 rows (approximately)
DELETE FROM `auth_user_user_permissions`;

-- Dumping structure for table image_detect_service.django_admin_log
DROP TABLE IF EXISTS `django_admin_log`;
CREATE TABLE IF NOT EXISTS `django_admin_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext DEFAULT NULL,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint(5) unsigned NOT NULL CHECK (`action_flag` >= 0),
  `change_message` longtext NOT NULL,
  `content_type_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Dumping data for table image_detect_service.django_admin_log: ~0 rows (approximately)
DELETE FROM `django_admin_log`;

-- Dumping structure for table image_detect_service.django_content_type
DROP TABLE IF EXISTS `django_content_type`;
CREATE TABLE IF NOT EXISTS `django_content_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Dumping data for table image_detect_service.django_content_type: ~7 rows (approximately)
DELETE FROM `django_content_type`;
INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES
	(1, 'admin', 'logentry'),
	(3, 'auth', 'group'),
	(2, 'auth', 'permission'),
	(4, 'auth', 'user'),
	(5, 'contenttypes', 'contenttype'),
	(7, 'healthcare_app_server', 'user'),
	(6, 'sessions', 'session');

-- Dumping structure for table image_detect_service.django_migrations
DROP TABLE IF EXISTS `django_migrations`;
CREATE TABLE IF NOT EXISTS `django_migrations` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Dumping data for table image_detect_service.django_migrations: ~23 rows (approximately)
DELETE FROM `django_migrations`;
INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES
	(1, 'contenttypes', '0001_initial', '2025-04-08 16:57:54.740453'),
	(2, 'auth', '0001_initial', '2025-04-08 16:57:55.049224'),
	(3, 'admin', '0001_initial', '2025-04-08 16:57:55.129890'),
	(4, 'admin', '0002_logentry_remove_auto_add', '2025-04-08 16:57:55.140314'),
	(5, 'admin', '0003_logentry_add_action_flag_choices', '2025-04-08 16:57:55.153025'),
	(6, 'contenttypes', '0002_remove_content_type_name', '2025-04-08 16:57:55.217304'),
	(7, 'auth', '0002_alter_permission_name_max_length', '2025-04-08 16:57:55.261222'),
	(8, 'auth', '0003_alter_user_email_max_length', '2025-04-08 16:57:55.286262'),
	(9, 'auth', '0004_alter_user_username_opts', '2025-04-08 16:57:55.306308'),
	(10, 'auth', '0005_alter_user_last_login_null', '2025-04-08 16:57:55.350604'),
	(11, 'auth', '0006_require_contenttypes_0002', '2025-04-08 16:57:55.352508'),
	(12, 'auth', '0007_alter_validators_add_error_messages', '2025-04-08 16:57:55.372151'),
	(13, 'auth', '0008_alter_user_username_max_length', '2025-04-08 16:57:55.402820'),
	(14, 'auth', '0009_alter_user_last_name_max_length', '2025-04-08 16:57:55.437033'),
	(15, 'auth', '0010_alter_group_name_max_length', '2025-04-08 16:57:55.464620'),
	(16, 'auth', '0011_update_proxy_permissions', '2025-04-08 16:57:55.484125'),
	(17, 'auth', '0012_alter_user_first_name_max_length', '2025-04-08 16:57:55.517633'),
	(18, 'healthcare_app_server', '0001_initial', '2025-04-08 16:57:55.582352'),
	(19, 'healthcare_app_server', '0002_user', '2025-04-08 16:57:55.605671'),
	(20, 'healthcare_app_server', '0003_remove_historydetect_user_id_historydetect_user', '2025-04-08 16:57:55.669329'),
	(21, 'healthcare_app_server', '0004_remove_user_face_image_user_face_detect_data', '2025-04-08 16:57:55.716307'),
	(22, 'healthcare_app_server', '0005_remove_historydetect_type_detect_id_and_more', '2025-04-08 16:57:56.069812'),
	(23, 'sessions', '0001_initial', '2025-04-08 16:57:56.105898');

-- Dumping structure for table image_detect_service.django_session
DROP TABLE IF EXISTS `django_session`;
CREATE TABLE IF NOT EXISTS `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Dumping data for table image_detect_service.django_session: ~0 rows (approximately)
DELETE FROM `django_session`;

-- Dumping structure for table image_detect_service.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(30) NOT NULL,
  `face_encode_value` longtext NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Dumping data for table image_detect_service.users: ~1 rows (approximately)
DELETE FROM `users`;
INSERT INTO `users` (`id`, `user_id`, `face_encode_value`) VALUES
	(1, '20250409000148-52838-19460614', '0.10584330558776855,0.13875123858451843,0.017335709184408188,-0.034396834671497345,0.0634281262755394,0.1731046438217163,0.13706965744495392,0.1279967874288559,-0.20125851035118103,0.1432647705078125,-0.016337769106030464,0.04654732719063759,0.09448826313018799,-0.14152637124061584,0.09778915345668793,-0.02033647708594799,0.09336532652378082,0.03785158321261406,-0.014978325925767422,-0.01065089926123619,0.08321639895439148,0.06275706738233566,-0.09443117678165436,0.06672995537519455,0.02548397332429886,-0.020930727943778038,-0.09379740059375763,-0.1023077517747879,0.06712616235017776,0.127790167927742,-0.07611799240112305,0.03837759420275688,-0.08349186927080154,0.08980368077754974,0.01547415554523468,-0.1361146718263626,0.04725499823689461,-0.025039980188012123,0.049504172056913376,-0.014677601866424084,0.038522396236658096,-0.06674099713563919,0.10104412585496902,0.06536762416362762,-0.07993385195732117,0.006556610111147165,0.12748196721076965,-0.05896943435072899,-0.1696457862854004,-0.017484785988926888,0.2638590335845947,-0.026486936956644058,-0.11667561531066895,0.008834133855998516,0.06422130018472672,0.014854923821985722,-0.05251426622271538,0.035479795187711716,0.048541177064180374,-0.07095971703529358,0.004742802586406469,-0.09870276600122452,-0.029856251552700996,-0.1513420045375824,0.07640501111745834,-0.12929591536521912,0.0021999350283294916,-0.022297585383057594,-0.10714013874530792,-0.05744510516524315,0.023083405569195747,0.09507455676794052,-0.056554775685071945,-0.07993900775909424,-0.04638156667351723,0.0924389660358429,-0.010323582217097282,0.10469857603311539,0.08798302710056305,0.08940759301185608,-0.029620077461004257,-0.011434666812419891,0.12538853287696838,0.09091522544622421,0.059597987681627274,-0.08719949424266815,0.11513292044401169,-0.04865673929452896,0.07340408861637115,0.05124524608254433,-0.13828705251216888,-0.10107102990150452,-0.12693481147289276,0.048568710684776306,-0.1492796242237091,-0.03339071571826935,0.1399904489517212,-0.008997241035103798,-0.08009881526231766,-0.0026522742118686438,-0.003236828139051795,0.16625501215457916,0.007123994641005993,0.1711837649345398,-0.18761046230793,-0.04617668315768242,-0.1000283807516098,0.10408741235733032,-0.05619249492883682,-0.04356605187058449,0.06135101616382599,0.0009394040098413825,-0.14605748653411865,-0.025118842720985413,0.03374747559428215,-0.02206031233072281,-0.10726196318864822,-0.08281461894512177,-0.11964135617017746,0.0577523410320282,0.016832564026117325,-0.012915853410959244,0.04364259913563728,0.015186404809355736,0.13587065041065216,-0.013775747269392014,0.023463400080800056,-0.08957294374704361');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
