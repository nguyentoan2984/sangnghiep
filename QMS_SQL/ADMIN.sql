
CREATE TABLE dbo.ADMINS(
	ID     			bigint IDENTITY(1,1) NOT NULL,
	MaNV   			varchar(4) NULL,
	Ho 				nvarchar(30) NULL,
	Ten 			nvarchar(10) NULL,
	UserName 		nvarchar(30) NULL,
	PassUser    	nvarchar(30) NULL,
	Quyen	 		varchar(100) NOT NULL,
    CONSTRAINT PK_ADMIN PRIMARY KEY(ID)
 )
 
 GO
 
 CREATE TABLE dbo.GROUPADMIN(
    ID     			bigint IDENTITY(1,1) NOT NULL,
	MaQuyen			varchar(4) NOT NULL,
	ChucNang		nvarchar(30) NULL,
	GhiChu			nvarchar(200) NULL,
    CONSTRAINT PK_GROUPADMIN PRIMARY KEY (ID)
 )

 GO
 
 ---- TAO MA QUYEN TRONG GROUP ADMIN
CREATE FUNCTION AUTO_MAQUYEN()
RETURNS VARCHAR(4)
AS
BEGIN
	DECLARE @MQ VARCHAR(4)
	IF (SELECT COUNT(MaQuyen) FROM  dbo.GROUPADMIN) = 0
		SET @MQ = '0'
	ELSE
		SELECT @MQ = MAX(RIGHT(MaQuyen, 2)) FROM  dbo.GROUPADMIN
		SELECT @MQ = CASE
			WHEN @MQ >= 0 and @MQ < 9 THEN 'MQ0' + CONVERT(CHAR, CONVERT(INT, @MQ) + 1)
			WHEN @MQ >= 9 THEN 'MQ' + CONVERT(CHAR, CONVERT(INT, @MQ) + 1)
		END
	RETURN @MQ
END

GO
SELECT dbo.AUTO_MAQUYEN ()
GO

---- TAO MA NV TRONG ADMIN

CREATE FUNCTION AUTO_MANV()
RETURNS VARCHAR(4)
AS
BEGIN
	DECLARE @NV VARCHAR(4)
	IF (SELECT COUNT(MaNV) FROM  dbo.ADMINS) = 0
		SET @NV = '0'
	ELSE
		SELECT @NV = MAX(MaNV) FROM  dbo.ADMINS
		SELECT @NV = CASE
			WHEN @NV >= 0 and @NV < 9 THEN '0' + CONVERT(CHAR, CONVERT(INT, @NV) + 1)
			WHEN @NV >= 9 THEN CONVERT(CHAR, CONVERT(INT, @NV) + 1)
		END
	RETURN @NV
END

SELECT dbo.AUTO_MANV ()
GO


/*============================================*/
---CAU HINH PHAN NHOM QUYEN
/*============================================*/
--------
----INSERT
INSERT INTO dbo.GROUPADMIN
           (MaQuyen
           ,ChucNang
           ,GhiChu)
     VALUES
           (dbo.AUTO_MAQUYEN ()	                                                  ---<MaQuyen, varchar(4),>
           ,'Giám sát'				                                              ---<ChucNang, nvarchar(30),>
           ,'Quyền được xem giám sát phục vụ Mở màn hình Giám sát trực tuyến')    ---<GhiChu, nvarchar(200),>)
GO

----XEM
SELECT*FROM  dbo.GROUPADMIN
GO
---XOA

DELETE FROM dbo.GROUPADMIN
      WHERE MaQuyen ='MQ04'
GO

--UPDARE
UPDATE dbo.GROUPADMIN
   SET ChucNang ='Giam sat'							---<ChucNang, nvarchar(30),>
      ,GhiChu =	'Quyen duoc xem giam sat dich vu, Mo man hinh giam sat truc tuyen'							---<GhiChu, nvarchar(200),>
 WHERE MaQuyen ='MQ04'
GO


/*============================================*/
---ADD USER QUAN TRI
/*============================================*/
-----truoc khi update nho check username
SELECT  count(dbo.ADMINS.UserName) as checkusername
FROM	dbo.ADMINS
WHERE dbo.ADMINS.UserName='nguyentoan1'
GO
-----neu checkusername=0 cho thuc hien lenh update
-----neu checkusername #0 thong bao username bi trung, dat username khac
---- TAO MA QUYEN TRONG GROUP ADMIN
INSERT INTO dbo.ADMINS
           (MaNV
           ,Ho
           ,Ten
           ,UserName
           ,PassUser
           ,Quyen)
     VALUES
           (dbo.AUTO_MANV ()	---<MaNV, varchar(15),>   
           ,'Nguyen'			---<Ho, nvarchar(30),>
           ,'Toan'				---<Ten, nvarchar(10),>
           ,'nguyentoan'		---<UserName, nvarchar(30),>
           ,'123456'			---<PassUser, nvarchar(30),>
           ,'{'+'MQ02'+','+'MQ03'+'}')				---<MaQuyen, varchar(4),>) LOAD TRONG dbo.GROUPADMIN


---XEM 
SELECT*FROM ADMINS
GO
---DELETE

DELETE FROM dbo.ADMINS
      WHERE MaNV='01'
GO

---UPDATE
---username va MaNV khong dc update

UPDATE dbo.ADMINS
   SET Ho =	'Nguyen Thien'						----<Ho, nvarchar(30),>
      ,Ten ='Toan'						-----<Ten, nvarchar(10),>
      ,PassUser ='12345678'					----<PassUser, nvarchar(30),>
      ,Quyen ='{'+'MQ02'+','+'MQ03'+'}'					----<MaQuyen, varchar(4),>
 WHERE MaNV='01'
GO

----Dua vao ma quyen de phan quyen cho user
----Bang groupadmin tao bang chuan, khong cho user chinh sua
----admin add user va phan quyen

---XEM 
SELECT*FROM ADMINS
GO

SELECT MaNV,Username,
	   CONCAT(Ho,' ',Ten) As 'Ho Ten',
	   Quyen
FROM   dbo.ADMINS
WHERE  Username ='nguyentoan'