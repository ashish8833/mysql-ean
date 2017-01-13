-- phpMyAdmin SQL Dump
-- version 4.4.10
-- http://www.phpmyadmin.net
--
-- Host: localhost:8889
-- Generation Time: Jan 09, 2017 at 01:06 PM
-- Server version: 5.5.42
-- PHP Version: 5.6.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `yudiz_pemdas`
--

-- --------------------------------------------------------

--
-- Table structure for table `mst_adminrole`
--

CREATE TABLE `mst_adminrole` (
  `iModuleId` smallint(5) unsigned NOT NULL,
  `iSectionId` smallint(5) unsigned NOT NULL,
  `vTitle` varchar(100) NOT NULL,
  `vPageName` varchar(100) NOT NULL,
  `vClass` varchar(50) NOT NULL,
  `vPermissions` text NOT NULL,
  `iSequence` smallint(5) unsigned NOT NULL DEFAULT '0',
  `eStatus` enum('y','n') NOT NULL DEFAULT 'y'
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `mst_adminrole`
--

INSERT INTO `mst_adminrole` (`iModuleId`, `iSectionId`, `vTitle`, `vPageName`, `vClass`, `vPermissions`, `iSequence`, `eStatus`) VALUES
(1, 1, 'Dashboard', 'dashboard', 'icon-home', 'access', 1, 'y'),
(2, 2, 'Site Settings', 'setting', 'icon-settings', 'access,edit', 1, 'y'),
(3, 2, 'Change Password', 'cpass', 'icon-settings', 'access,edit', 2, 'y'),
(4, 3, 'Users', 'users', 'icon-user', 'access,stats,delete,status,view', 1, 'y'),
(5, 4, 'Questions', 'questions', '', '', 1, 'y'),
(6, 5, 'Exams', 'exams', '', '', 1, 'y'),
(7, 2, 'Manage Profile', 'profile', '', '', 3, 'y');

-- --------------------------------------------------------

--
-- Table structure for table `mst_adminsection`
--

CREATE TABLE `mst_adminsection` (
  `iSectionId` smallint(5) unsigned NOT NULL,
  `vSectionName` varchar(100) NOT NULL,
  `vClass` varchar(50) NOT NULL,
  `iSequence` smallint(5) unsigned NOT NULL DEFAULT '0',
  `eStatus` enum('y','n') NOT NULL DEFAULT 'y'
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `mst_adminsection`
--

INSERT INTO `mst_adminsection` (`iSectionId`, `vSectionName`, `vClass`, `iSequence`, `eStatus`) VALUES
(1, 'Dashboard', 'icon-home', 1, 'y'),
(2, 'General Settings', 'icon-settings', 2, 'y'),
(3, 'Manage Users', 'icon-users', 3, 'y'),
(4, 'Manage Questions', 'fa fa-question-circle', 4, 'y'),
(5, 'Manage Exams', 'fa fa-pencil', 5, 'y');

-- --------------------------------------------------------

--
-- Table structure for table `mst_errorlog`
--

CREATE TABLE `mst_errorlog` (
  `iLogId` bigint(20) unsigned NOT NULL,
  `vType` text NOT NULL,
  `vError` varchar(255) NOT NULL,
  `vDate` datetime NOT NULL,
  `vIpAddress` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `mst_imagethumb`
--

CREATE TABLE `mst_imagethumb` (
  `iThumbId` int(1) unsigned NOT NULL,
  `vFolder` varchar(50) NOT NULL,
  `iHeight` int(1) unsigned NOT NULL,
  `iWidth` int(1) unsigned NOT NULL,
  `vDefaultImage` varchar(100) NOT NULL,
  `vIsactive` enum('y','n') NOT NULL DEFAULT 'y'
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `mst_imagethumb`
--

INSERT INTO `mst_imagethumb` (`iThumbId`, `vFolder`, `iHeight`, `iWidth`, `vDefaultImage`, `vIsactive`) VALUES
(1, 'users', 225, 225, 'default_user_image.png', 'y'),
(2, 'users', 150, 150, 'default_user_image.png', 'y');

-- --------------------------------------------------------

--
-- Table structure for table `mst_modes`
--

CREATE TABLE `mst_modes` (
  `iModeId` tinyint(3) unsigned NOT NULL,
  `vModeName` varchar(25) NOT NULL,
  `eStatus` enum('y','n','d') NOT NULL DEFAULT 'y',
  `dUpdatedDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `mst_modes`
--

INSERT INTO `mst_modes` (`iModeId`, `vModeName`, `eStatus`, `dUpdatedDate`) VALUES
(1, 'Easy', 'y', '2017-01-05 09:04:11'),
(2, 'Medium', 'y', '2017-01-05 09:04:11'),
(3, 'Difficult', 'y', '2017-01-05 09:04:28'),
(4, 'Expert', 'y', '2017-01-05 09:04:28'),
(5, 'Custom', 'y', '2017-01-05 09:04:40');

-- --------------------------------------------------------

--
-- Table structure for table `mst_permissions`
--

CREATE TABLE `mst_permissions` (
  `iPermissionId` tinyint(3) unsigned NOT NULL,
  `vPermission` varchar(100) NOT NULL,
  `eStatus` enum('y','n') NOT NULL DEFAULT 'y'
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `mst_permissions`
--

INSERT INTO `mst_permissions` (`iPermissionId`, `vPermission`, `eStatus`) VALUES
(1, 'access', 'y'),
(2, 'add', 'y'),
(3, 'edit', 'y'),
(4, 'delete', 'y'),
(5, 'status', 'y'),
(6, 'view', 'y'),
(7, 'download', 'y'),
(8, 'print', 'y');

-- --------------------------------------------------------

--
-- Table structure for table `mst_site_settings`
--

CREATE TABLE `mst_site_settings` (
  `iFieldId` int(1) unsigned NOT NULL,
  `vLabel` varchar(100) DEFAULT NULL,
  `vType` enum('text','email','textarea','file','radio','checkbox','select') DEFAULT 'text',
  `vConstant` varchar(50) DEFAULT NULL,
  `vOptions` text NOT NULL,
  `vClass` varchar(100) DEFAULT NULL,
  `eRequired` enum('y','n') NOT NULL DEFAULT 'n',
  `iMaxLength` int(10) unsigned NOT NULL DEFAULT '0',
  `iMinLength` int(10) unsigned NOT NULL DEFAULT '0',
  `vValue` text NOT NULL,
  `vHint` varchar(255) DEFAULT NULL,
  `eEditable` enum('y','n') NOT NULL DEFAULT 'y',
  `dUpdatedDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `mst_site_settings`
--

INSERT INTO `mst_site_settings` (`iFieldId`, `vLabel`, `vType`, `vConstant`, `vOptions`, `vClass`, `eRequired`, `iMaxLength`, `iMinLength`, `vValue`, `vHint`, `eEditable`, `dUpdatedDate`) VALUES
(1, 'Site Name', 'text', 'SITENAME', '', NULL, 'y', 100, 3, 'OutRageous Fantasy Lotto', 'Site name which you want to display', 'y', '2016-10-17 10:39:14'),
(2, 'Site Logo', 'file', 'SITE_LOGO', '', 'img_class', 'n', 0, 0, 'logo.jpg', 'Only jpg, jpeg and png is allowed ', 'n', '2016-10-17 11:51:02'),
(3, 'Admin email', 'email', 'ADMIN_EMAIL', '', 'email_class', 'y', 240, 0, 'chetan.yadav@yudiz.com', NULL, 'y', '2016-10-17 10:39:14'),
(6, 'Under Maintenance', 'radio', 'UNDER_MAINTENANCE', 'yes,no', NULL, 'y', 0, 0, 'no', 'If yes site will show under maintenance page', 'y', '2016-10-17 11:41:02'),
(7, 'Footer Text', 'text', 'FOOTER_TEXT', '', NULL, 'y', 255, 0, '{{YEAR}} © Fantasy Lotto By Yudiz Team.', NULL, 'y', '2016-10-17 10:39:14'),
(8, 'Store Game Log', 'radio', 'STORE_GAME_LOG', '''Yes'',''No''', NULL, 'y', 0, 0, 'Yes', NULL, 'n', '2016-10-19 09:02:59'),
(11, 'Standart Cache Time', 'text', 'STANDARD CACHE TIME', '', NULL, 'y', 0, 0, '3600', NULL, 'n', '2016-10-04 13:00:16'),
(12, 'Active Cache', 'radio', 'ACTIVE_CACHE', 'y,n', NULL, 'y', 0, 0, 'n', NULL, 'n', '2015-11-20 00:21:18'),
(13, 'Active Robot Text', 'radio', 'ACTIVE_ROBOT_TEXT', 'y,n', NULL, 'y', 0, 0, 'n', NULL, 'n', '2016-10-17 08:49:48'),
(14, 'Error log email', 'text', 'ERROR_LOG_EMAIL', '', NULL, 'y', 0, 0, 'chetan.yadav@yudiz.com', NULL, 'n', '2016-10-04 13:00:20'),
(16, 'Live User chunk time', 'text', 'LIVE_CHUNK_TIME', '', NULL, 'y', 0, 0, '300', NULL, 'n', '2016-10-04 13:00:24'),
(17, 'Author', 'text', 'SITE_AUTHOR', '', NULL, 'y', 255, 0, 'Yudiz Solutions Pvt. Ltd.', NULL, 'y', '2016-10-17 10:39:14');

-- --------------------------------------------------------

--
-- Table structure for table `mst_usertype`
--

CREATE TABLE `mst_usertype` (
  `iTypeId` tinyint(3) unsigned NOT NULL,
  `vSysFlag` varchar(25) NOT NULL,
  `vUserType` varchar(25) NOT NULL DEFAULT '',
  `eStatus` enum('y','n') NOT NULL DEFAULT 'y'
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `mst_usertype`
--

INSERT INTO `mst_usertype` (`iTypeId`, `vSysFlag`, `vUserType`, `eStatus`) VALUES
(1, 'super_admin', 'Super Admin', 'y'),
(2, 'user', 'User', 'y');

--
-- Triggers `mst_usertype`
--
DELIMITER $$
CREATE TRIGGER `preventDelete` BEFORE DELETE ON `mst_usertype`
 FOR EACH ROW IF old.iTypeId  > 0 THEN 
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'This record is reserved! You are not allowed to remove it!!';
  END IF
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_answers`
--

CREATE TABLE `tbl_answers` (
  `iAnswerId` bigint(20) unsigned NOT NULL,
  `iQuestionId` bigint(20) unsigned NOT NULL,
  `vAnswer` text NOT NULL,
  `dUpdatedDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_exams`
--

CREATE TABLE `tbl_exams` (
  `iExamId` bigint(20) unsigned NOT NULL,
  `iUserId` bigint(20) unsigned NOT NULL,
  `vTitle` varchar(255) NOT NULL,
  `vDescription` text NOT NULL,
  `eStatus` enum('y','n','d') NOT NULL DEFAULT 'y',
  `dCreatedDate` datetime NOT NULL,
  `dUpdatedDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_exam_participant`
--

CREATE TABLE `tbl_exam_participant` (
  `iParticipantId` bigint(20) unsigned NOT NULL,
  `iScheduleId` bigint(20) unsigned NOT NULL,
  `iUserId` bigint(20) unsigned NOT NULL,
  `iTotalQuestion` mediumint(8) unsigned NOT NULL,
  `iRightAnswers` mediumint(8) unsigned NOT NULL,
  `iWrongAnswers` mediumint(11) NOT NULL,
  `eStatus` enum('y','n') NOT NULL DEFAULT 'y',
  `dCreatedDate` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_exam_schedule`
--

CREATE TABLE `tbl_exam_schedule` (
  `iScheduleId` bigint(20) unsigned NOT NULL,
  `iExamId` bigint(20) unsigned NOT NULL,
  `dExamDate` datetime NOT NULL,
  `iParticipant` bigint(20) unsigned NOT NULL COMMENT 'Winner of exam',
  `iWinnerId` bigint(20) unsigned NOT NULL,
  `dCreatedDate` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_participant_questions`
--

CREATE TABLE `tbl_participant_questions` (
  `iAssignedId` bigint(20) unsigned NOT NULL,
  `iParticipantId` bigint(20) unsigned NOT NULL,
  `iQuestionId` bigint(20) unsigned NOT NULL,
  `iAnswerId` bigint(20) unsigned NOT NULL,
  `eCheck` enum('right','wrong') NOT NULL,
  `eStatus` enum('y','n') NOT NULL DEFAULT 'y',
  `dUpdatedDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_questions`
--

CREATE TABLE `tbl_questions` (
  `iQuestionId` bigint(20) unsigned NOT NULL,
  `vModeName` varchar(25) NOT NULL,
  `eType` enum('MCQ','VSQ') NOT NULL DEFAULT 'MCQ',
  `vQuestion` text NOT NULL,
  `iAnswerId` bigint(20) unsigned NOT NULL,
  `eStatus` enum('y','n','d') NOT NULL DEFAULT 'y',
  `dUpdatedDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_users`
--

CREATE TABLE `tbl_users` (
  `iUserId` bigint(20) unsigned NOT NULL,
  `vUserType` varchar(25) NOT NULL,
  `vFullName` varchar(200) NOT NULL DEFAULT '',
  `vUserName` varchar(100) NOT NULL DEFAULT '',
  `vEmail` varchar(200) NOT NULL DEFAULT '',
  `vPassword` varchar(32) NOT NULL,
  `vCountry` varchar(25) NOT NULL DEFAULT '',
  `vActivationToken` varchar(32) NOT NULL DEFAULT '',
  `eStatus` enum('y','n','d') NOT NULL DEFAULT 'n',
  `dLastActivity` datetime NOT NULL,
  `dCreatedDate` datetime NOT NULL,
  `vIpAddress` varchar(45) NOT NULL DEFAULT ''
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_users`
--

INSERT INTO `tbl_users` (`iUserId`, `vUserType`, `vFullName`, `vUserName`, `vEmail`, `vPassword`, `vCountry`, `vActivationToken`, `eStatus`, `dLastActivity`, `dCreatedDate`, `vIpAddress`) VALUES
(1, 'super_admin', 'Super Admin', 'Super Admin', 'info@fantasylotto.com', 'e10adc3949ba59abbe56e057f20f883e', '', '9139bdad54af269d11ab25ebe067b13e', 'y', '2016-09-01 10:26:24', '2016-09-01 00:00:00', '::1'),
(2, 'user', 'chetan', 'chetan', 'chetan.yadav@yudiz.com', 'e10adc3949ba59abbe56e057f20f883e', '', '', 'y', '2016-09-07 12:08:45', '2016-09-07 12:08:45', '::1'),
(4, 'user', 'harsh', 'harsh', 'harsh@yudiz.com', 'e10adc3949ba59abbe56e057f20f883e', '', '', 'y', '2016-09-07 12:08:45', '2016-09-07 12:08:45', '::1'),
(5, 'user', 'chandu', 'chandu', 'chandu@yudiz.com', 'e10adc3949ba59abbe56e057f20f883e', '', '', 'd', '2016-09-07 12:08:45', '2016-09-07 12:08:45', '::1'),
(6, 'user', 'chigo', 'chigo', 'chigo@yudiz.com', 'e10adc3949ba59abbe56e057f20f883e', '', '', 'd', '2016-09-07 12:08:45', '2016-09-07 12:08:45', '::1'),
(7, 'user', 'fem', 'fem', 'fem@yudiz.com', 'e10adc3949ba59abbe56e057f20f883e', '', '', 'y', '2016-09-07 12:08:45', '2016-09-07 12:08:45', '::1'),
(8, 'user', 'chets', 'chets', 'chets@yudiz.com', 'e10adc3949ba59abbe56e057f20f883e', '', '', 'y', '2016-09-07 12:08:45', '2016-09-07 12:08:45', '::1'),
(9, 'user', 'sudhir', 'sudhir', 'sudhir@yudiz.com', 'e10adc3949ba59abbe56e057f20f883e', '', '', 'n', '2016-09-07 12:08:45', '2016-09-07 12:08:45', '::1'),
(10, 'user', 'shreejit', 'shreejit', 'shreejit@yudiz.com', 'e10adc3949ba59abbe56e057f20f883e', '', '', 'y', '2016-09-07 12:08:45', '2016-09-07 12:08:45', '::1'),
(11, 'user', 'hiten', 'hiten', 'hiten@yudiz.com', 'e10adc3949ba59abbe56e057f20f883e', '', '', 'y', '2016-09-07 12:08:45', '2016-09-07 12:08:45', '::1'),
(12, 'user', 'milan', 'milan', 'milan@yudiz.com', 'e10adc3949ba59abbe56e057f20f883e', '', '', 'y', '2016-09-07 12:08:45', '2016-09-07 12:08:45', '::1'),
(13, 'user', 'sanskrit', 'sanskrit', 'sanskrit@yudiz.com', 'e10adc3949ba59abbe56e057f20f883e', '', '', 'y', '2016-09-07 12:08:45', '2016-09-07 12:08:45', '::1'),
(14, 'user', 'hindi', 'hindi', 'hindi@yudiz.com', 'e10adc3949ba59abbe56e057f20f883e', '', '', 'y', '2016-09-07 12:08:45', '2016-09-07 12:08:45', '::1'),
(16, 'super_admin', 'Admin', 'Admin', 'admin@lotto.com', 'e10adc3949ba59abbe56e057f20f883e', '', '9139bdad54af269d11ab25ebe067b13e', 'y', '2016-09-01 10:26:24', '2016-09-01 00:00:00', '::1');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_user_devices`
--

CREATE TABLE `tbl_user_devices` (
  `iDeviceId` bigint(20) unsigned NOT NULL,
  `iUserId` bigint(20) unsigned NOT NULL,
  `vAuthToken` tinytext NOT NULL,
  `vPushToken` tinytext,
  `eDeviceType` enum('Android','iOS','Window','Desktop') NOT NULL,
  `iBadge` smallint(5) unsigned NOT NULL DEFAULT '0',
  `eSendPush` enum('y','n') NOT NULL DEFAULT 'n',
  `eStatus` enum('y','n') NOT NULL DEFAULT 'y'
) ENGINE=InnoDB AUTO_INCREMENT=103 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_user_devices`
--

INSERT INTO `tbl_user_devices` (`iDeviceId`, `iUserId`, `vAuthToken`, `vPushToken`, `eDeviceType`, `iBadge`, `eSendPush`, `eStatus`) VALUES
(2, 1, 'b04de5eff9877a9e7c1b9119a1b18b65d', '', 'Desktop', 0, 'n', 'y'),
(4, 1, '9549bb88b414350560fd39ebe55289e2', '', 'Desktop', 0, 'n', 'y'),
(5, 1, '628eca6bb65fcaa6b8441f93f1271cd0', '', 'Desktop', 0, 'n', 'y'),
(7, 1, 'df5a945d5530321af9cbd436ebd71bdb', '', 'Desktop', 0, 'n', 'y'),
(8, 1, '09ee7be9b4e1d7106a08e386abdcd4e5', '', 'Desktop', 0, 'n', 'y'),
(11, 1, '66cd1deb76dabf57a6fdb9025aa1128b', '', 'Desktop', 0, 'n', 'y'),
(12, 1, '2d15d8cba9d713de2971a38f242ed05f', '', 'Desktop', 0, 'n', 'y'),
(13, 1, '71ecec47bec5a51110e589f3a2bd7f0c', '', 'Desktop', 0, 'n', 'y'),
(14, 1, '7314a947daca296460546c82f42423a9', '', 'Desktop', 0, 'n', 'y'),
(16, 2, '3817aea3a2b1e3dd20a85064570ffc17', NULL, 'Android', 0, 'n', 'y'),
(17, 1, '929100058f05b63daa6d806890b63f0e', NULL, 'Desktop', 0, 'n', 'y'),
(18, 2, '51748ac65147863e50c0fbaff283b3a6', NULL, 'Android', 0, 'n', 'y'),
(19, 2, '7602f577fd0550aa2843922b64caa684', NULL, 'Android', 0, 'n', 'y'),
(20, 2, '5340341f46f676487a01455b7b531601', NULL, 'Android', 0, 'n', 'y'),
(21, 2, 'fc45471577d0cb48cc3ff64f02a3c907', NULL, 'Android', 0, 'n', 'y'),
(22, 2, '222f60be3839c868aaaa1f266645a4c9', NULL, 'Android', 0, 'n', 'y'),
(23, 2, '1287a4edbc795cdb15faa87f1fe7a33f', NULL, 'Android', 0, 'n', 'y'),
(24, 2, '701f5f8b834829c6e50432864f2d2c7b', NULL, 'Android', 0, 'n', 'y'),
(25, 2, 'be4522bb063419b5873d6fbbaf3d9d48', NULL, 'Android', 0, 'n', 'y'),
(26, 2, '8a3193d484545c579606f1d4039f4b5d', NULL, 'Android', 0, 'n', 'y'),
(28, 2, 'da0b278ea7b6eeeb6d1aaec48f2a5d3b', NULL, 'Android', 0, 'n', 'y'),
(29, 2, 'b4daadaa4cd4a0ef3e92324984a9d71a', NULL, 'Android', 0, 'n', 'y'),
(30, 2, '34ecdba9e44835db7557763813d6a079', NULL, 'Android', 0, 'n', 'y'),
(31, 2, '7e63743b542fc9f3e53b0ebc54e2f374', NULL, 'Android', 0, 'n', 'y'),
(32, 2, 'fd4f3ba1014085a6c3bbaa2494393c16', NULL, 'Android', 0, 'n', 'y'),
(33, 2, '0e86fe987c4ed1e92c1f788c948fbdfe', NULL, 'Android', 0, 'n', 'y'),
(34, 2, 'c27f60424a1cf50cb2fb49dd34d72956', NULL, 'Android', 0, 'n', 'y'),
(35, 2, '56e3d826ae8b038548468c4002ce5e1a', NULL, 'Android', 0, 'n', 'y'),
(36, 2, 'd519c1b1c75686c81d89dae2b046ba85', NULL, 'Android', 0, 'n', 'y'),
(37, 2, 'c785618f51b46112588ed564b645a0bf', NULL, 'Android', 0, 'n', 'y'),
(38, 2, 'bad4e5e69e7ca00e1d4774d55ac9ba1f', NULL, 'Android', 0, 'n', 'y'),
(39, 2, 'cb05a604a4c2c365317e8cba424352c9', NULL, 'Android', 0, 'n', 'y'),
(40, 2, '1514779f576429c5c21360ecff01c35e', NULL, 'Android', 0, 'n', 'y'),
(41, 2, '6da11e12e2e9e0ab033ae2eccdac41a7', NULL, 'Android', 0, 'n', 'y'),
(42, 2, '3ea35a24be7687f7f896447738911bd6', NULL, 'Android', 0, 'n', 'y'),
(43, 2, '1b75eef3a0c4576714c02e1a08a99053', NULL, 'Android', 0, 'n', 'y'),
(44, 2, '699cced678e9cc31430a061753bbccbf', NULL, 'Android', 0, 'n', 'y'),
(45, 2, '4798b3bf5ff437ebe2d13f13c2bf5050', NULL, 'Android', 0, 'n', 'y'),
(46, 2, 'c87da1f9a918b50dcbbec628bacb4373', NULL, 'Android', 0, 'n', 'y'),
(47, 2, '01107fb88d91a190416fffcfa0d08b0e', NULL, 'Android', 0, 'n', 'y'),
(48, 2, 'c8108b418c4d715876b93aa5ff344ac5', NULL, 'Android', 0, 'n', 'y'),
(49, 2, '7105669c72f014a6d33b8376a73410d5', NULL, 'Android', 0, 'n', 'y'),
(50, 2, '0363b8701053e483074cf70726ef3f79', NULL, 'Android', 0, 'n', 'y'),
(51, 2, 'dab7f43d451b29445cc0ba71c3ecb5be', NULL, 'Android', 0, 'n', 'y'),
(52, 2, 'ea65355ef22bae81481a6935f5e3307b', NULL, 'Android', 0, 'n', 'y'),
(53, 2, 'bb9f2b8fd8b1bcf0adbd1d02810c271f', NULL, 'Android', 0, 'n', 'y'),
(54, 2, 'f0ff34acdb7b6c573a61cf46c58ae613', NULL, 'Android', 0, 'n', 'y'),
(55, 2, '462327a93fab79f347ed0400c9a56a44', NULL, 'Android', 0, 'n', 'y'),
(56, 2, '8b7b56daa54c8bc0ac8b01aca1dae911', NULL, 'Android', 0, 'n', 'y'),
(57, 2, '5eb898a6db14c9317182cef58375c2ef', NULL, 'Android', 0, 'n', 'y'),
(58, 2, 'e8e16e00311fb049efcacb78eeef0383', NULL, 'Android', 0, 'n', 'y'),
(59, 2, 'f251bd8842d8d66a5c2abb4d2aa806b2', NULL, 'Android', 0, 'n', 'y'),
(60, 2, '650dd566610949535c645b5a20cbc994', NULL, 'Android', 0, 'n', 'y'),
(61, 2, '2b12491342c68292926913495268ef16', NULL, 'Android', 0, 'n', 'y'),
(62, 2, '9521703a6036950a83eb257419b3e4d4', NULL, 'Android', 0, 'n', 'y'),
(63, 2, '9303a6f0540b2f75349c733ac088ba0c', NULL, 'Android', 0, 'n', 'y'),
(64, 2, '7b7a7c337834e41efd8e399fa3692371', NULL, 'Android', 0, 'n', 'y'),
(65, 2, '21723afecebe20a65e1322a4a0a702d7', NULL, 'Android', 0, 'n', 'y'),
(66, 2, '10642e5d43627f6292bf8ba7dbf510f6', NULL, 'Android', 0, 'n', 'y'),
(67, 2, '10ff153a727149c9e31b693982a1e37b', NULL, 'Android', 0, 'n', 'y'),
(68, 2, '459fe719b67981f656be6f2dc1be2551', NULL, 'Android', 0, 'n', 'y'),
(69, 2, '545a56945f8afe867532ad217e03b32c', NULL, 'Android', 0, 'n', 'y'),
(70, 2, 'cb56dba8ed6aadf5d4994968949bd360', NULL, 'Android', 0, 'n', 'y'),
(71, 2, 'cec254caae8ab4d12b6bcaf5a98f0aa5', NULL, 'Android', 0, 'n', 'y'),
(72, 1, '9744cf238df70ddd2cd325e2cbc45a62', NULL, 'Desktop', 0, 'n', 'y'),
(73, 1, 'e9f84961712b9ee75a7600f39ed89b8a', NULL, 'Desktop', 0, 'n', 'y'),
(76, 2, 'f6c9a80a19d1ce194da6a98967ca1253', NULL, 'Android', 0, 'n', 'y'),
(81, 16, '2c854ed0839c3fe5c6ad0b91f64a3043', NULL, 'Desktop', 0, 'n', 'y'),
(90, 2, '6f9f9c9bbfc92390788d7f6699f32375', NULL, 'Android', 0, 'n', 'y'),
(91, 2, 'b701753bfb51a13d1897a774c15b7c50', NULL, 'Android', 0, 'n', 'y'),
(92, 2, '6fe81f15c07483ebdbe1e28c38558452', NULL, 'Android', 0, 'n', 'y'),
(93, 2, 'b553ea78a4ea3c05daaa285185437b4d', NULL, 'Android', 0, 'n', 'y'),
(94, 2, '66b20202534230317e01d89e7f3a7ae5', NULL, 'Android', 0, 'n', 'y'),
(95, 2, '65bd4ac151826859ec5916d7dbacee17', NULL, 'Android', 0, 'n', 'y'),
(96, 2, '79a74ccc9913b48eb378a370ecf443c5', NULL, 'Android', 0, 'n', 'y'),
(97, 2, 'c13bc16c8645c723914bb23d0c2be6a3', NULL, 'Android', 0, 'n', 'y'),
(98, 2, 'c5af23bb3eb9630473e05ed5581e2794', NULL, 'Android', 0, 'n', 'y'),
(99, 2, 'fbd22b0f7dcc77d8bba90f49fcc2f7b0', NULL, 'Android', 0, 'n', 'y'),
(100, 2, '23e53d7e033578fd0baa4fdcb7cdbae0', NULL, 'Android', 0, 'n', 'y'),
(101, 2, '58a35c3aa863b211b2b4e384d7c50871', NULL, 'Android', 0, 'n', 'y'),
(102, 2, '7db63ca7a9295a236295944a45e18563', NULL, 'Android', 0, 'n', 'y');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_user_permissions`
--

CREATE TABLE `tbl_user_permissions` (
  `iPermissionId` bigint(20) unsigned NOT NULL,
  `iUserId` bigint(20) unsigned NOT NULL,
  `iModuleId` smallint(5) unsigned NOT NULL,
  `vPermissions` text NOT NULL,
  `dUpdatedDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_user_permissions`
--

INSERT INTO `tbl_user_permissions` (`iPermissionId`, `iUserId`, `iModuleId`, `vPermissions`, `dUpdatedDate`) VALUES
(1, 1, 1, 'access', '2016-08-04 22:15:40'),
(2, 1, 2, 'access,edit', '2016-08-04 22:15:48'),
(3, 1, 3, 'access,edit', '2016-08-04 22:15:56'),
(4, 1, 4, 'access,stats,delete,status,view', '2016-09-15 10:12:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `mst_adminrole`
--
ALTER TABLE `mst_adminrole`
  ADD PRIMARY KEY (`iModuleId`),
  ADD KEY `iSectionId` (`iSectionId`);

--
-- Indexes for table `mst_adminsection`
--
ALTER TABLE `mst_adminsection`
  ADD PRIMARY KEY (`iSectionId`);

--
-- Indexes for table `mst_errorlog`
--
ALTER TABLE `mst_errorlog`
  ADD PRIMARY KEY (`iLogId`);

--
-- Indexes for table `mst_imagethumb`
--
ALTER TABLE `mst_imagethumb`
  ADD PRIMARY KEY (`iThumbId`);

--
-- Indexes for table `mst_modes`
--
ALTER TABLE `mst_modes`
  ADD PRIMARY KEY (`iModeId`),
  ADD KEY `vModeName` (`vModeName`);

--
-- Indexes for table `mst_permissions`
--
ALTER TABLE `mst_permissions`
  ADD PRIMARY KEY (`iPermissionId`);

--
-- Indexes for table `mst_site_settings`
--
ALTER TABLE `mst_site_settings`
  ADD PRIMARY KEY (`iFieldId`);

--
-- Indexes for table `mst_usertype`
--
ALTER TABLE `mst_usertype`
  ADD PRIMARY KEY (`iTypeId`),
  ADD KEY `vSysFlag` (`vSysFlag`);

--
-- Indexes for table `tbl_answers`
--
ALTER TABLE `tbl_answers`
  ADD PRIMARY KEY (`iAnswerId`),
  ADD KEY `iQuestionId` (`iQuestionId`);

--
-- Indexes for table `tbl_exams`
--
ALTER TABLE `tbl_exams`
  ADD PRIMARY KEY (`iExamId`),
  ADD KEY `iUserId` (`iUserId`),
  ADD KEY `iUserId_2` (`iUserId`);

--
-- Indexes for table `tbl_exam_participant`
--
ALTER TABLE `tbl_exam_participant`
  ADD PRIMARY KEY (`iParticipantId`),
  ADD KEY `iScheduleId` (`iScheduleId`),
  ADD KEY `iUserId` (`iUserId`),
  ADD KEY `iScheduleId_2` (`iScheduleId`),
  ADD KEY `iUserId_2` (`iUserId`);

--
-- Indexes for table `tbl_exam_schedule`
--
ALTER TABLE `tbl_exam_schedule`
  ADD PRIMARY KEY (`iScheduleId`),
  ADD KEY `iExamId` (`iExamId`),
  ADD KEY `iExamId_2` (`iExamId`);

--
-- Indexes for table `tbl_participant_questions`
--
ALTER TABLE `tbl_participant_questions`
  ADD PRIMARY KEY (`iAssignedId`),
  ADD KEY `iParticipantId` (`iParticipantId`),
  ADD KEY `iQuestionId` (`iQuestionId`),
  ADD KEY `iAnswerId` (`iAnswerId`),
  ADD KEY `iParticipantId_2` (`iParticipantId`),
  ADD KEY `iQuestionId_2` (`iQuestionId`),
  ADD KEY `iAnswerId_2` (`iAnswerId`);

--
-- Indexes for table `tbl_questions`
--
ALTER TABLE `tbl_questions`
  ADD PRIMARY KEY (`iQuestionId`),
  ADD KEY `vMode` (`vModeName`),
  ADD KEY `iAnswerId` (`iAnswerId`);

--
-- Indexes for table `tbl_users`
--
ALTER TABLE `tbl_users`
  ADD PRIMARY KEY (`iUserId`),
  ADD UNIQUE KEY `vUserName` (`vUserName`),
  ADD UNIQUE KEY `vEmail` (`vEmail`),
  ADD KEY `vUserType` (`vUserType`);

--
-- Indexes for table `tbl_user_devices`
--
ALTER TABLE `tbl_user_devices`
  ADD PRIMARY KEY (`iDeviceId`),
  ADD KEY `iUserId` (`iUserId`);

--
-- Indexes for table `tbl_user_permissions`
--
ALTER TABLE `tbl_user_permissions`
  ADD PRIMARY KEY (`iPermissionId`),
  ADD KEY `iUserId` (`iUserId`),
  ADD KEY `iModuleId` (`iModuleId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `mst_adminrole`
--
ALTER TABLE `mst_adminrole`
  MODIFY `iModuleId` smallint(5) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `mst_adminsection`
--
ALTER TABLE `mst_adminsection`
  MODIFY `iSectionId` smallint(5) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `mst_errorlog`
--
ALTER TABLE `mst_errorlog`
  MODIFY `iLogId` bigint(20) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `mst_imagethumb`
--
ALTER TABLE `mst_imagethumb`
  MODIFY `iThumbId` int(1) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `mst_modes`
--
ALTER TABLE `mst_modes`
  MODIFY `iModeId` tinyint(3) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `mst_permissions`
--
ALTER TABLE `mst_permissions`
  MODIFY `iPermissionId` tinyint(3) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT for table `mst_site_settings`
--
ALTER TABLE `mst_site_settings`
  MODIFY `iFieldId` int(1) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=18;
--
-- AUTO_INCREMENT for table `mst_usertype`
--
ALTER TABLE `mst_usertype`
  MODIFY `iTypeId` tinyint(3) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `tbl_answers`
--
ALTER TABLE `tbl_answers`
  MODIFY `iAnswerId` bigint(20) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `tbl_exam_participant`
--
ALTER TABLE `tbl_exam_participant`
  MODIFY `iParticipantId` bigint(20) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `tbl_exam_schedule`
--
ALTER TABLE `tbl_exam_schedule`
  MODIFY `iScheduleId` bigint(20) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `tbl_participant_questions`
--
ALTER TABLE `tbl_participant_questions`
  MODIFY `iAssignedId` bigint(20) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `tbl_questions`
--
ALTER TABLE `tbl_questions`
  MODIFY `iQuestionId` bigint(20) unsigned NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `tbl_users`
--
ALTER TABLE `tbl_users`
  MODIFY `iUserId` bigint(20) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=17;
--
-- AUTO_INCREMENT for table `tbl_user_devices`
--
ALTER TABLE `tbl_user_devices`
  MODIFY `iDeviceId` bigint(20) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=103;
--
-- AUTO_INCREMENT for table `tbl_user_permissions`
--
ALTER TABLE `tbl_user_permissions`
  MODIFY `iPermissionId` bigint(20) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `mst_adminrole`
--
ALTER TABLE `mst_adminrole`
  ADD CONSTRAINT `mst_adminrole_ibfk_1` FOREIGN KEY (`iSectionId`) REFERENCES `mst_adminsection` (`iSectionId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_exams`
--
ALTER TABLE `tbl_exams`
  ADD CONSTRAINT `tbl_exams_ibfk_1` FOREIGN KEY (`iUserId`) REFERENCES `tbl_users` (`iUserId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_exam_participant`
--
ALTER TABLE `tbl_exam_participant`
  ADD CONSTRAINT `tbl_exam_participant_ibfk_1` FOREIGN KEY (`iUserId`) REFERENCES `tbl_users` (`iUserId`),
  ADD CONSTRAINT `tbl_exam_participant_ibfk_2` FOREIGN KEY (`iScheduleId`) REFERENCES `tbl_exam_schedule` (`iScheduleId`);

--
-- Constraints for table `tbl_exam_schedule`
--
ALTER TABLE `tbl_exam_schedule`
  ADD CONSTRAINT `tbl_exam_schedule_ibfk_1` FOREIGN KEY (`iScheduleId`) REFERENCES `tbl_exams` (`iExamId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_participant_questions`
--
ALTER TABLE `tbl_participant_questions`
  ADD CONSTRAINT `tbl_participant_questions_ibfk_1` FOREIGN KEY (`iParticipantId`) REFERENCES `tbl_exam_participant` (`iParticipantId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tbl_participant_questions_ibfk_2` FOREIGN KEY (`iQuestionId`) REFERENCES `tbl_questions` (`iQuestionId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tbl_participant_questions_ibfk_3` FOREIGN KEY (`iAnswerId`) REFERENCES `tbl_answers` (`iAnswerId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_questions`
--
ALTER TABLE `tbl_questions`
  ADD CONSTRAINT `tbl_questions_ibfk_1` FOREIGN KEY (`vModeName`) REFERENCES `mst_modes` (`vModeName`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_user_devices`
--
ALTER TABLE `tbl_user_devices`
  ADD CONSTRAINT `tbl_user_devices_ibfk_1` FOREIGN KEY (`iUserId`) REFERENCES `tbl_users` (`iUserId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tbl_user_permissions`
--
ALTER TABLE `tbl_user_permissions`
  ADD CONSTRAINT `tbl_user_permissions_ibfk_1` FOREIGN KEY (`iUserId`) REFERENCES `tbl_users` (`iUserId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tbl_user_permissions_ibfk_2` FOREIGN KEY (`iModuleId`) REFERENCES `mst_adminrole` (`iModuleId`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
