/*
SQLyog Ultimate
MySQL - 8.0.30 : Database - space_math
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
/*Table structure for table `nilai` */

CREATE TABLE `nilai` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama_pemain` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `menu` varchar(225) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `skor` int NOT NULL,
  `waktu` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `nilai` */

insert  into `nilai`(`id`,`nama_pemain`,`menu`,`skor`,`waktu`) values (1,'Mufi','quiz',100,'2025-01-30 21:56:18');
insert  into `nilai`(`id`,`nama_pemain`,`menu`,`skor`,`waktu`) values (2,'Tes Nama','audio',0,'2025-01-31 22:51:42');
insert  into `nilai`(`id`,`nama_pemain`,`menu`,`skor`,`waktu`) values (3,'Test123','audio',0,'2025-02-09 10:29:22');
insert  into `nilai`(`id`,`nama_pemain`,`menu`,`skor`,`waktu`) values (4,'Tes','',50,'2025-02-16 12:00:00');
insert  into `nilai`(`id`,`nama_pemain`,`menu`,`skor`,`waktu`) values (5,'Tes','',0,'2025-02-16 05:27:57');
insert  into `nilai`(`id`,`nama_pemain`,`menu`,`skor`,`waktu`) values (6,'coba','',0,'2025-02-16 05:30:27');
insert  into `nilai`(`id`,`nama_pemain`,`menu`,`skor`,`waktu`) values (7,'coba','',0,'2025-02-16 05:30:53');
insert  into `nilai`(`id`,`nama_pemain`,`menu`,`skor`,`waktu`) values (8,'coba','',90,'2025-02-16 05:33:13');
insert  into `nilai`(`id`,`nama_pemain`,`menu`,`skor`,`waktu`) values (9,'coba','',100,'2025-02-16 05:40:04');
insert  into `nilai`(`id`,`nama_pemain`,`menu`,`skor`,`waktu`) values (10,'tesquiz','',0,'2025-02-16 05:46:27');
insert  into `nilai`(`id`,`nama_pemain`,`menu`,`skor`,`waktu`) values (11,'tesquiz','',90,'2025-02-16 05:47:16');
insert  into `nilai`(`id`,`nama_pemain`,`menu`,`skor`,`waktu`) values (12,'tesquiz','',80,'2025-02-16 05:51:22');
insert  into `nilai`(`id`,`nama_pemain`,`menu`,`skor`,`waktu`) values (13,'tesquiz','',80,'2025-02-16 05:57:16');
insert  into `nilai`(`id`,`nama_pemain`,`menu`,`skor`,`waktu`) values (14,'tesquiz','',100,'2025-02-16 06:02:37');
insert  into `nilai`(`id`,`nama_pemain`,`menu`,`skor`,`waktu`) values (15,'tesquiz','',100,'2025-02-16 06:15:36');
insert  into `nilai`(`id`,`nama_pemain`,`menu`,`skor`,`waktu`) values (16,'tesquiz','',100,'2025-02-16 06:51:39');
insert  into `nilai`(`id`,`nama_pemain`,`menu`,`skor`,`waktu`) values (17,'tesmemori','',0,'2025-02-16 14:08:40');
insert  into `nilai`(`id`,`nama_pemain`,`menu`,`skor`,`waktu`) values (18,'tes memori','',0,'2025-02-17 02:50:50');
insert  into `nilai`(`id`,`nama_pemain`,`menu`,`skor`,`waktu`) values (19,'tes memori','',0,'2025-02-17 05:21:24');
insert  into `nilai`(`id`,`nama_pemain`,`menu`,`skor`,`waktu`) values (20,'tes memori','',100,'2025-02-17 06:17:07');
insert  into `nilai`(`id`,`nama_pemain`,`menu`,`skor`,`waktu`) values (21,'tes memori','',0,'2025-02-17 09:27:54');
insert  into `nilai`(`id`,`nama_pemain`,`menu`,`skor`,`waktu`) values (22,'contoh','',0,'2025-02-17 14:04:59');
insert  into `nilai`(`id`,`nama_pemain`,`menu`,`skor`,`waktu`) values (23,'tes','',0,'2025-02-17 14:07:28');
insert  into `nilai`(`id`,`nama_pemain`,`menu`,`skor`,`waktu`) values (24,'tes','',80,'2025-02-17 14:14:38');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
