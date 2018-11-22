

USE [BQDB]
GO

SELECT [OFFICEID]
      ,[OFFICENAME]
      ,[ADDRESS]
      ,[PHONE]
      ,[FAX]
      ,[LOGO]
      ,[ORDERINDEX]
      ,[IPDATABASE]
      ,[DATABASENAME]
      ,[USERNAME]
      ,[PASSWORD]
      ,[RUNTIME]
      ,[ISACTIVE]
  FROM [dbo].[OFFICE]
GO


----INSERT
----TRUOC KHI INSERT CHECK OFFICEID NEU TRUNG YEU CAU NHAP LAI
SELECT COUNT(dbo.OFFICE.OFFICEID) AS check_id
FROM   dbo.OFFICE
WHERE  dbo.OFFICE.OFFICEID ='11CNHCM'
 ----NEU =0 CHO PHEP INSERT
 --- NEU =1 YEU CAU NHAP LAI

INSERT INTO dbo.OFFICE
           (OFFICEID
           ,OFFICENAME
           ,ADDRESS
           ,PHONE
           ,FAX
           ,LOGO
           ,ORDERINDEX
           ,IPDATABASE
           ,DATABASENAME
           ,USERNAME
           ,PASSWORD
           ,RUNTIME
           ,ISACTIVE)
     VALUES
           ('10CNHCM'								---<OFFICEID, varchar(15),>
           ,'PGD Phu Nhuan'								---<OFFICENAME, nvarchar(150),>
           ,'123 Phan Dang Luu'								---<ADDRESS, nvarchar(200),>
           ,'0808080808'								---<PHONE, nvarchar(100),>
           ,'0812345678'								---<FAX, nvarchar(100),>
           ,NULL								---<LOGO, image,>
           ,'2'								----<ORDERINDEX, int,>
           ,'45.117.171.3'								----<IPDATABASE, varchar(50),>
           ,'BQueueDB3'								----<DATABASENAME, nvarchar(50),>
           ,'bqueueuser3'								----<USERNAME, nvarchar(50),>
           ,'bqueue3password'								----<PASSWORD, nvarchar(120),>
           ,'2018-08-20 16:00:00.000'								-----<RUNTIME, datetime,>
           ,'1'	)								-----<ISACTIVE, bit,>)
GO

SELECT*FROM dbo.OFFICE

GO

DELETE FROM dbo.OFFICE
      WHERE OFFICEID='10CNHCM'
GO

---UPDATE
USE [BQDB]
GO

UPDATE dbo.OFFICE
   SET OFFICENAME = 'PGD Phu Nhuan'
      ,ADDRESS = '123 Phan Dang Luu'	
      ,PHONE ='0808080808'
      ,FAX = '0812345678'
      ,LOGO= NULL
      ,ORDERINDEX ='3' 
      ,IPDATABASE = '45.117.171.3'
      ,DATABASENAME = 'BQueueDB3'	
      ,USERNAME = 'bqueueuser3'
      ,PASSWORD = 'bqueue3password'	
      ,RUNTIME = NULL
      ,ISACTIVE = '1'
	WHERE OFFICEID='10CNHCM'


GO



