-- Event Management System Database Schema
-- Created: June 11, 2026

CREATE DATABASE IF NOT EXISTS event_management;
USE event_management;

-- Create Tables
CREATE TABLE IF NOT EXISTS organizers (
    organizer_id INT PRIMARY KEY,
    organizer_name VARCHAR(100) 
);

CREATE TABLE IF NOT EXISTS events (
    event_id INT PRIMARY KEY,
    event_name VARCHAR(100) ,
    organizer_id INT,
    FOREIGN KEY (organizer_id) REFERENCES organizers(organizer_id)
);

CREATE TABLE IF NOT EXISTS participants (
    participant_id INT PRIMARY KEY,
    participant_name VARCHAR(100) 
);

CREATE TABLE IF NOT EXISTS event_participation (
    event_id INT,
    participant_id INT,
    PRIMARY KEY (event_id, participant_id),
    FOREIGN KEY (event_id) REFERENCES events(event_id),
    FOREIGN KEY (participant_id) REFERENCES participants(participant_id)
);

CREATE TABLE IF NOT EXISTS schedule (
    schedule_id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    FOREIGN KEY (event_id) REFERENCES events(event_id)
);

-- Create Trigger to Prevent Event Time Clashes
DELIMITER $$
CREATE TRIGGER check_time_clashes
BEFORE INSERT ON schedule
FOR EACH ROW
BEGIN
    IF EXISTS (
        SELECT *
        FROM schedule s
        WHERE s.event_date = NEW.event_date
          AND (NEW.start_time < s.end_time AND NEW.end_time > s.start_time)
          AND s.event_id != NEW.event_id
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Event time clash detected!';
    END IF;
END $$
DELIMITER ;

-- Initial Data
INSERT INTO organizers (organizer_id, organizer_name) VALUES
(1, 'Rohit Sharma'),
(2, 'Shraddha Mahesh'),
(3, 'Abhishikt Bhargav'),
(4, 'Anya Forger')
ON DUPLICATE KEY UPDATE organizer_name = VALUES(organizer_name);

INSERT INTO events (event_id, event_name, organizer_id) VALUES
(1, 'Tech Conference', 1),
(2, 'Art Expo', 2),
(3, 'Music Fest', 3),
(4, 'Coding Hackathon', 4)
ON DUPLICATE KEY UPDATE event_name = VALUES(event_name), organizer_id = VALUES(organizer_id);

INSERT INTO participants (participant_id, participant_name) VALUES
(1, 'Reyansh'),
(2, 'Ahaan'),
(3, 'Merry'),
(4, 'Shinchan'),
(5, 'Nobita'),
(6, 'Ash')
ON DUPLICATE KEY UPDATE participant_name = VALUES(participant_name);

INSERT INTO event_participation (event_id, participant_id) VALUES
(1, 1), (1, 2),
(2, 3), (2, 4),
(3, 5), (3, 6),
(4, 1), (4, 3)
ON DUPLICATE KEY UPDATE event_id = VALUES(event_id);

INSERT INTO schedule (schedule_id, event_id, event_date, start_time, end_time) VALUES
(1, 1, '2024-03-20', '10:00:00', '12:00:00'),
(2, 2, '2024-03-21', '14:00:00', '16:00:00'),
(3, 3, '2024-03-22', '18:00:00', '20:00:00'),
(4, 4, '2024-03-23', '09:00:00', '11:00:00')
ON DUPLICATE KEY UPDATE event_id = VALUES(event_id), event_date = VALUES(event_date);
