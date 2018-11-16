
CREATE TABLE dbo.ADMINS(
	ID     			bigint IDENTITY(1,1) NOT NULL,
	MaNV   			varchar(4) NULL,
	Ho 				nvarchar(30) NULL,
	Ten 			nvarchar(10) NULL,
	UserName 		nvarchar(30) NULL,
	PassUser    	nvarchar(30) NULL
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
 ----TAO BANG PHAN QUYEN USER
CREATE TABLE dbo.ADMINROLES(
    ID     			bigint IDENTITY(1,1) NOT NULL,
	MaNV			varchar(4) NOT NULL,
	MaQuyen		    nvarchar(4) NULL,
    CONSTRAINT PK_ADMINROLES PRIMARY KEY (ID)
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
           ,N'Giám sát'				                                              ---<ChucNang, nvarchar(30),>
           ,N'Quyền được xem giám sát phục vụ Mở màn hình Giám sát trực tuyến')    ---<GhiChu, nvarchar(200),>)
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
   SET ChucNang =N'Giam sat'							---<ChucNang, nvarchar(30),>
      ,GhiChu =	N'Quyen duoc xem giam sat dich vu, Mo man hinh giam sat truc tuyen'							---<GhiChu, nvarchar(200),>
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
           ,PassUser)
     VALUES
           (dbo.AUTO_MANV ()	---<MaNV, varchar(15),>   
           ,N'Nguyen'			---<Ho, nvarchar(30),>
           ,N'Toan'				---<Ten, nvarchar(10),>
           ,'nguyentoan'		---<UserName, nvarchar(30),>
           ,'123456'			---<PassUser, nvarchar(30),>
           )				---<MaQuyen, varchar(4),>) LOAD TRONG dbo.GROUPADMIN


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
   SET Ho =	N'Nguyen Thien'						----<Ho, nvarchar(30),>
      ,Ten =N'Toan'						-----<Ten, nvarchar(10),>
      ,PassUser ='12345678'					----<PassUser, nvarchar(30),>
 WHERE MaNV='01'
GO

----Dua vao ma quyen de phan quyen cho user
----Bang groupadmin tao bang chuan, khong cho user chinh sua
----admin add user va phan quyen

---XEM 
SELECT*FROM ADMINS
GO

SELECT MaNV,Username,
	   CONCAT(Ho,' ',Ten) As 'Ho Ten'
FROM   dbo.ADMINS
WHERE  Username ='nguyentoan'


-----ADD QUYEN USER
-----TRUOC KHI ADD QUYEN USER XOA QUYEN CU, UPDATE QUYEN MOI
BEGIN
DELETE FROM dbo.ADMINROLES
      WHERE MaNV='01'
INSERT INTO dbo.ADMINROLES
           (MaNV
           ,MaQuyen)
     VALUES ('01','MQ02'),
			('01','MQ03')
END

----XEM QUYEN NHAN VIEN

SELECT dbo.ADMINS.MaNV,dbo.ADMINS.Username,
	   CONCAT(dbo.ADMINS.Ho,' ',dbo.ADMINS.Ten) As 'Ho Ten',
	   dbo.ADMINROLES.MaQuyen
FROM   dbo.ADMINS,dbo.ADMINROLES
WHERE  dbo.ADMINS.MaNV=dbo.ADMINROLES.MaNV
AND    dbo.ADMINS.MaNV ='01'

---XEM MA QUYEN CUA MaNV ='01'
SELECT 
	   dbo.ADMINROLES.MaQuyen
FROM   dbo.ADMINS,dbo.ADMINROLES
WHERE  dbo.ADMINS.MaNV=dbo.ADMINROLES.MaNV
AND    dbo.ADMINS.MaNV ='01'