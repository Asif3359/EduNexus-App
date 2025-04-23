-- 1. USERS AND PROFILES
CREATE TABLE Users (
    UserID INT PRIMARY KEY AUTO_INCREMENT,
    FullName VARCHAR(100),
    Email VARCHAR(100) UNIQUE,
    PasswordHash VARCHAR(255),
    Role ENUM('Admin', 'Teacher', 'Student'),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE StudentProfile (
    StudentID INT PRIMARY KEY,
    ProfilePicture TEXT,
    Mobile VARCHAR(15),
    Bio TEXT,
    FOREIGN KEY (StudentID) REFERENCES Users(UserID)
);

CREATE TABLE TeacherProfile (
    TeacherID INT PRIMARY KEY,
    ProfilePicture TEXT,
    Mobile VARCHAR(15),
    Bio TEXT,
    FOREIGN KEY (TeacherID) REFERENCES Users(UserID)
);

-- 2. SKILLS
CREATE TABLE Skills (
    SkillID INT PRIMARY KEY AUTO_INCREMENT,
    SkillName VARCHAR(100) UNIQUE
);

CREATE TABLE UserSkills (
    UserID INT,
    SkillID INT,
    PRIMARY KEY (UserID, SkillID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (SkillID) REFERENCES Skills(SkillID)
);

-- 3. INTERESTS
CREATE TABLE Interests (
    InterestID INT PRIMARY KEY AUTO_INCREMENT,
    InterestName VARCHAR(100) UNIQUE
);

CREATE TABLE UserInterests (
    UserID INT,
    InterestID INT,
    PRIMARY KEY (UserID, InterestID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (InterestID) REFERENCES Interests(InterestID)
);

-- 4. SOCIAL LINKS
CREATE TABLE SocialLinks (
    SocialLinkID INT PRIMARY KEY AUTO_INCREMENT,
    SocailLinks VARCHAR(100) UNIQUE
);

CREATE TABLE UserSocialLinks (
    UserID INT,
    SocialLinkID INT,
    PRIMARY KEY (UserID, SocialLinkID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (SocialLinkID) REFERENCES SocialLinks(SocialLinkID)
);

-- 5. EDUCATIONS
CREATE TABLE Educations (
    EducationID INT PRIMARY KEY AUTO_INCREMENT,
    Degree VARCHAR(100),
    Institution VARCHAR(150),
    Year INT,
    Description TEXT
);

CREATE TABLE UserEducations (
    UserID INT,
    EducationID INT,
    PRIMARY KEY (UserID, EducationID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (EducationID) REFERENCES Educations(EducationID)
);

-- 6. EXPERIENCE
CREATE TABLE Experiences (
    ExperienceID INT PRIMARY KEY AUTO_INCREMENT,
    Organization VARCHAR(150),
    Role VARCHAR(100),
    Duration VARCHAR(100),
    Description TEXT
);

CREATE TABLE UserExperiences (
    UserID INT,
    ExperienceID INT,
    PRIMARY KEY (UserID, ExperienceID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (ExperienceID) REFERENCES Experiences(ExperienceID)
);

-- 7. CERTIFICATIONS
CREATE TABLE Certifications (
    CertificationID INT PRIMARY KEY AUTO_INCREMENT,
    Title VARCHAR(150),
    IssuingOrganization VARCHAR(150),
    IssueDate DATE,
    ExpiryDate DATE,
    CredentialURL TEXT,
    Description TEXT
);

CREATE TABLE UserCertifications (
    UserID INT,
    CertificationID INT,
    PRIMARY KEY (UserID, CertificationID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (CertificationID) REFERENCES Certifications(CertificationID)
);

-- 8. COURSES AND MODULES
CREATE TABLE Courses (
    CourseID INT PRIMARY KEY AUTO_INCREMENT,
    Title VARCHAR(255),
    Description TEXT,
    Price DECIMAL(10,2),
    TeacherID INT,
    CreatedAt TIMESTAMP,
    FOREIGN KEY (TeacherID) REFERENCES Users(UserID)
);

CREATE TABLE Modules (
    ModuleID INT PRIMARY KEY AUTO_INCREMENT,
    CourseID INT,
    Title VARCHAR(255),
    Position INT,
    FOREIGN KEY (CourseID) REFERENCES Courses(CourseID)
);

CREATE TABLE Videos (
    VideoID INT PRIMARY KEY AUTO_INCREMENT,
    ModuleID INT,
    Title VARCHAR(255),
    VideoURL TEXT,
    Position INT,
    FOREIGN KEY (ModuleID) REFERENCES Modules(ModuleID)
);

CREATE TABLE LiveClasses (
    LiveClassID INT PRIMARY KEY AUTO_INCREMENT,
    ModuleID INT,
    Title VARCHAR(255),
    Schedule DATETIME,
    Link TEXT,
    Duration INT,
    FOREIGN KEY (ModuleID) REFERENCES Modules(ModuleID)
);

-- 9. SUBSCRIPTIONS AND ENROLLMENTS
CREATE TABLE Subscriptions (
    SubscriptionID INT PRIMARY KEY AUTO_INCREMENT,
    TeacherID INT,
    PlanName VARCHAR(50),
    Price DECIMAL(10,2),
    StartDate DATETIME,
    EndDate DATETIME,
    FOREIGN KEY (TeacherID) REFERENCES Users(UserID)
);

CREATE TABLE Enrollments (
    EnrollmentID INT PRIMARY KEY AUTO_INCREMENT,
    StudentID INT,
    CourseID INT,
    EnrollDate DATETIME,
    PaidAmount DECIMAL(10,2),
    FOREIGN KEY (StudentID) REFERENCES Users(UserID),
    FOREIGN KEY (CourseID) REFERENCES Courses(CourseID)
);

-- 10. CHAT AND CONNECTIONS
CREATE TABLE Connections (
    ConnectionID INT PRIMARY KEY AUTO_INCREMENT,
    SenderID INT,
    ReceiverID INT,
    Status ENUM('Pending', 'Accepted', 'Rejected'),
    RequestedAt TIMESTAMP,
    FOREIGN KEY (SenderID) REFERENCES Users(UserID),
    FOREIGN KEY (ReceiverID) REFERENCES Users(UserID)
);

CREATE TABLE Messages (
    MessageID INT PRIMARY KEY AUTO_INCREMENT,
    ConnectionID INT,
    SenderID INT,
    Message TEXT,
    SentAt TIMESTAMP,
    FOREIGN KEY (ConnectionID) REFERENCES Connections(ConnectionID),
    FOREIGN KEY (SenderID) REFERENCES Users(UserID)
);

-- 11. RATINGS
CREATE TABLE Ratings (
    RatingID INT PRIMARY KEY AUTO_INCREMENT,
    CourseID INT,
    StudentID INT,
    Rating INT CHECK (Rating BETWEEN 1 AND 5),
    Review TEXT,
    RatedAt TIMESTAMP,
    FOREIGN KEY (CourseID) REFERENCES Courses(CourseID),
    FOREIGN KEY (StudentID) REFERENCES Users(UserID)
);

-- 12. LIVE CLASS HISTORY
CREATE TABLE StudentLiveClassHistory (
    HistoryID INT PRIMARY KEY AUTO_INCREMENT,
    StudentID INT,
    LiveClassID INT,
    JoinTime DATETIME,
    FOREIGN KEY (StudentID) REFERENCES Users(UserID),
    FOREIGN KEY (LiveClassID) REFERENCES LiveClasses(LiveClassID)
);

-- 13. VIDEO WATCH HISTORY
CREATE TABLE StudentVideoWatchHistory (
    HistoryID INT PRIMARY KEY AUTO_INCREMENT,
    StudentID INT,
    VideoID INT,
    WatchedAt DATETIME,
    FOREIGN KEY (StudentID) REFERENCES Users(UserID),
    FOREIGN KEY (VideoID) REFERENCES Videos(VideoID)
);

-- 14. NOTIFICATIONS
CREATE TABLE Notifications (
    NotificationID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT,
    Message TEXT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    IsRead BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- 15. SCHEDULED NOTIFICATIONS
CREATE TABLE ScheduledNotifications (
    ScheduledID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT,
    LiveClassID INT,
    NotifyAt DATETIME,
    IsSent BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (LiveClassID) REFERENCES LiveClasses(LiveClassID)
);
