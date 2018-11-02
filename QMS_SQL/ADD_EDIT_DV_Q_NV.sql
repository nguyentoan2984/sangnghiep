/*============================================*/
---SERVICEINFO
---BANG DICH VU
/*============================================*/
---TAO CHUC NANG MA TU DONG

---INSERT
---TAO MA DICH VU
BEGIN
	DECLARE @ID tinyint
	IF (SELECT COUNT(SERVICEID) FROM dbo.SERVICEINFO) = 0
		SET @ID = '0'
	ELSE
		SELECT @ID = MAX(SERVICEID) FROM dbo.SERVICEINFO
		SELECT @ID = @ID+1

	SELECT @ID AS serviceid
---SVcode='ma chi nhanh' + serviceid
END



INSERT INTO dbo.SERVICEINFO
           (SERVICEID
           ,SVcode
           ,SERVICENAME
           ,STARTNO
           ,ENDNO
           ,STARTTIME
           ,ENDTIME
           ,STARTTIME2
           ,ENDTIME2
           ,CURRENTNO
           ,ISSUEDNO
           ,COPIES
           ,MAXTIME
           ,RESET
           ,CONTI
		   )
     VALUES
           ('7'				---<SERVICEID, tinyint,>   ---TINH TOAN O TREN LA GIA TRI @ID
           ,'08CNHCM7'				---<SVcode, varchar(15),> ---TINH TOAN O TREN SVcode='ma chi nhanh' + serviceid
           ,'Đổi tiền'				---<SERVICENAME, nvarchar(80),>
           ,'7001'				---<STARTNO, smallint,>
           ,'7999'				---<ENDNO, smallint,>
           ,'07:30:00'				---<STARTTIME, datetime,>
           ,'12:00:00'				---<ENDTIME, datetime,>
           ,'13:00:00'				---<STARTTIME2, datetime,>
           ,'23:00:00'				---<ENDTIME2, datetime,>
           ,NULL				---<CURRENTNO, smallint,>
           ,NULL				---<ISSUEDNO, smallint,>
           ,'1'				---<COPIES, tinyint,>
           ,'100'				---<MAXTIME, tinyint,>
           ,'1'				---<RESET, bit,>
           ,'0'				---<CONTI, tinyint,>
		   )
GO
---xem
SELECT*FROM dbo.SERVICEINFO
GO
---XOA
DELETE FROM dbo.SERVICEINFO
      WHERE SERVICEID='7'
GO
---update

UPDATE dbo.SERVICEINFO
   SET SERVICENAME='Doi Tien' 			--- <SERVICENAME, nvarchar(80),>
      ,STARTNO='7001'					--- <STARTNO, smallint,>
      ,ENDNO='7999'						--- <ENDNO, smallint,>
      ,STARTTIME='07:30:00'				--- <STARTTIME, datetime,>
      ,ENDTIME='12:00:00'				--- <ENDTIME, datetime,>
      ,STARTTIME2='13:00:00'			--- <STARTTIME2, datetime,>
      ,ENDTIME2='23:00:00'				--- <ENDTIME2, datetime,>
      ,CURRENTNO=NULL					--- <CURRENTNO, smallint,>
      ,ISSUEDNO=NULL					--- <ISSUEDNO, smallint,>
      ,COPIES='1'						--- <COPIES, tinyint,>
      ,MAXTIME='100'					--- <MAXTIME, tinyint,>
      ,RESET='1'						--- <RESET, bit,>
      ,CONTI='0'							--- <CONTI, tinyint,>
 WHERE SERVICEID='07'
GO

/*============================================*/
---COUNTERSERVICE
---BANG QUAY
/*============================================*/
---INSERT
USE [BQDB]
GO

INSERT INTO dbo.COUNTERSERVICE
           (COUNTERID
           ,SERVICEID
			)
     VALUES
           ('10'				---<COUNTERID, tinyint,>
           ,'6'				---<SERVICEID, tinyint,>  ---LIST TRONG BANG dbo.SERVICEINFO
			)
GO
---XEM
SELECT*FROM dbo.COUNTERSERVICE
GO
--DELETE
DELETE FROM dbo.COUNTERSERVICE
      WHERE COUNTERID='10'
GO
---UPDATE

UPDATE dbo.COUNTERSERVICE
   SET SERVICEID ='5'			---<SERVICEID, tinyint,>
WHERE COUNTERID='10'
GO


/*============================================*/
---NHAN VIEN                     
/*============================================*/
BEGIN
	DECLARE @ID VARCHAR(5)
	IF (SELECT COUNT(STAFFID) FROM dbo.STAFFS) = 0
		SET @ID = '0'
	ELSE
		SELECT @ID = MAX(STAFFID) FROM dbo.STAFFS
		SELECT @ID = CASE
			WHEN @ID >= 0 and @ID < 9 THEN '0' + CONVERT(CHAR, CONVERT(INT, @ID) + 1)
			WHEN @ID >= 9 THEN CONVERT(CHAR, CONVERT(INT, @ID) + 1)
		END
END
SELECT @ID AS staffid

----INSERT NHAN VIEN
INSERT INTO dbo.STAFFS
           (STAFFID
		   ,StaffIDOffice
           ,LASTNAME
           ,FIRSTNAME
           ,COUNTERID
           ,STATUS
           ,STATUSTIME
           ,LOGIN
           ,StaffIDLog)
     VALUES
           (@ID						---STAFFID, char(2   gia tri staffid tinh toan o tren
		   ,'157010'				---StaffIDOffice, varchar(8),>
           ,'Nguyễn thị'			---<LASTNAME, nvarchar(30),>
           ,'Loan'					---<FIRSTNAME, nvarchar(10),>
           ,'10'					----<COUNTERID, tinyint,>  ---CHON TRONG LIST COUNTER BANG dbo.COUNTERSERVICE
           ,'0'						----<STATUS, tinyint,>
           ,GETDATE()				----<STATUSTIME, datetime,>
           ,'0'						----<LOGIN, bit,>
           ,'NULL')					---<StaffIDLog, char(5),>)
GO
---XEM THONG TIN TOAN BO NHAN VIEN
SELECT*FROM STAFFS

GO
----XOA NHAN VIEN
DELETE FROM dbo.STAFFS
      WHERE STAFFID='60'
GO
---UPDATE NHAM VIEN
UPDATE dbo.STAFFS
   SET StaffIDOffice ='157010'		---<StaffIDOffice, varchar(8),>
      ,LASTNAME ='Nguyễn thị'			---<LASTNAME, nvarchar(30),>
      ,FIRSTNAME ='Loan'			---<FIRSTNAME, nvarchar(10),>
      ,COUNTERID ='11'			---<COUNTERID, tinyint,>
      ,STATUS ='1'				---<STATUS, tinyint,>
								----,STATUSTIME =	GETDATE()				---<STATUSTIME, datetime,>
      ,LOGIN ='1'				---<LOGIN, bit,>
      ,StaffIDLog ='NULL'			---<StaffIDLog, char(5),>
WHERE STAFFID='60'

GO
