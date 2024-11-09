CREATE TABLE `audit_logs` (
  `id` int(100) NOT NULL AUTO_INCREMENT,
  `userId` varchar(100) NOT NULL,
  `action` varchar(100) NOT NULL,
  `timestamp` datetime NOT NULL DEFAULT current_timestamp(),
  `details` varchar(100) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `audit_logs` VALUES (1, '1', 'create', '2024-11-07 06:00:00', 'Usuario creado: gerardo dre', '2024-11-07 06:00:00');
INSERT INTO `audit_logs` VALUES (2, '4', 'create', '2024-11-07 06:00:00', 'Queja creada: carretera dañada en suchiapa', '2024-11-07 06:00:00');
INSERT INTO `audit_logs` VALUES (3, '4', 'delete', '2024-11-07 06:00:00', 'Queja eliminada: carretera dañada en suchiapa', '2024-11-07 06:00:00');
INSERT INTO `audit_logs` VALUES (4, '3', 'delete', '2024-11-07 06:00:00', 'Queja eliminada: carretera dañada en suchiapa', '2024-11-07 06:00:00');
INSERT INTO `audit_logs` VALUES (5, '3', 'delete', '2024-11-07 06:00:00', 'Queja eliminada: carretera dañada en suchiapa', '2024-11-07 06:00:00');


CREATE TABLE `payments` (
  `id` int(100) NOT NULL AUTO_INCREMENT,
  `payment_id` int(100) NOT NULL,
  `status_detail` varchar(100) NOT NULL,
  `currency_id` int(100) NOT NULL,
  `total_paid_amount` int(100) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `payments` VALUES (1, 2147483647, 'accredited', 0, 100, '2024-11-05 06:00:00');
INSERT INTO `payments` VALUES (2, 2147483647, 'accredited', 0, 100, '2024-11-05 06:00:00');
INSERT INTO `payments` VALUES (3, 2147483647, 'accredited', 0, 100, '2024-11-05 06:00:00');


CREATE TABLE `quejas` (
  `id` int(100) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `description` varchar(100) NOT NULL,
  `category` varchar(100) NOT NULL,
  `status` varchar(100) NOT NULL,
  `dateCreated` datetime NOT NULL DEFAULT current_timestamp(),
  `filePath` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `quejas` VALUES (1, 'esta sucia la calle', 'desde hace 3 semanas', 'alumbrado', 'Pendiente', '2024-11-05 06:00:00', '');
INSERT INTO `quejas` VALUES (2, 'daño en la carretera', 'desde hace 3 semanas', 'Baches', 'Pendiente', '2024-11-05 06:00:00', '');
INSERT INTO `quejas` VALUES (4, 'carretera dañada en suchiapa', 'desde hace 3 semanas', 'Baches', 'Pendiente', '2024-11-07 06:00:00', '');


CREATE TABLE `usuarios` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `contrasena` varchar(100) NOT NULL,
  `telefono` int(100) NOT NULL,
  `codigo_verificacion` varchar(100) NOT NULL,
  `fecha_operacion` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `usuarios` VALUES (1, 'gerardo dre', 'cristianamo@gmail.com', '123456709', 2147483647, '4caaa7', '2024-11-07 06:00:00');


