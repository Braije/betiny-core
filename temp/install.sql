CREATE DATABASE IF NOT EXISTS nuts CHARACTER SET utf8 COLLATE utf8_general_ci;
CREATE TABLE IF NOT EXISTS `geojson` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `cntr_id` varchar(5) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `year` smallint(6) DEFAULT NULL,
  `projection` smallint(6) DEFAULT NULL,
  `scale` varchar(2) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `level` tinyint(4) DEFAULT NULL,
  `feature` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `year` (`year`) USING BTREE,
  KEY `scale` (`scale`) USING BTREE,
  KEY `projection` (`projection`) USING BTREE,
  KEY `level` (`level`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=100000 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;