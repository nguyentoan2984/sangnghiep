--/*==============================================================*/
--Cau hinh he thong 
--Muc canh bao                                    
/*==============================================================*/

---------------------------------
--- 1. LOAD COMBO DON VI CAU HINH
---------------------------------
GO

SELECT OFFICEID,OFFICENAME,ORDERINDEX  FROM dbo.OFFICE
WHERE  ISACTIVE=1
ORDER BY ORDERINDEX

GO
----THUC HIEN KET NOI DEN SEVER DON VI DUOC CHON

SELECT IPDATABASE,DATABASENAME,USERNAME,PASSWORD  FROM dbo.OFFICE
WHERE  OFFICEID='09CNHCM'    ---GIA TRI OFFICEID DUOC CHON

GO

----LOAD DANH SACH DICH VU DON VI
----COMBO DON VI MAC DINH : CHON DICH VU

SELECT SERVICEID,SERVICENAME FROM dbo.SERVICEINFO
ORDER BY STARTNO

GO




----LOAD GIA TRI CAU HINH HINH THUC CANH BAO CUA DON VI DUOC CHON
----
/*SELECT  WAITTIMEMAX ,       ----THOI GIAN CHO PHUC VU TOI DA
		SERVICETIMEMAX,     ----THOI GIAN PHUC VU TOI DA
		DISCOUNTITIMEMAX    ----THOI GIAN NGHI GIUA HAI SO LIEN TIEP TOI DA
FROM 	dbo.SYSTEMCONFIGSERVICEINFO
WHERE   SERVICEID="CHON DICH VU"    ---CHON DICH VU

GO

----CANH BAO AM THANH
----HINH THUC CANH BAO


SELECT 	OFFICEID,
		BYSOUND,			---CANH BAO AM THANH, MAC DINH LA TRUE
		BYIMG,				---CANH BAO HÌNH ANH, MAC DINH LA TRUE
		IMGNAME				---DOC FILE TU THU MUC ANH ../IMG/IMGWARNING
FROM   dbo.SYSTEMCONFIGWARNING
WHERE   OFFICEID="OFFICEID DUOC CHON"

GO*/



--SELECT*FROM dbo.SYSTEMCONFIGSERVICEINFO
--GO
-----NHAN NUT LUU

-----KIEM TRA DICH VU DUOC CHON
----LOAD GIA TRI CAU HINH HINH THUC CANH BAO CUA DON VI DUOC CHON
----
SELECT  WAITTIMEMAX ,       ----THOI GIAN CHO PHUC VU TOI DA
		SERVICETIMEMAX,     ----THOI GIAN PHUC VU TOI DA
		DISCOUNTITIMEMAX    ----THOI GIAN NGHI GIUA HAI SO LIEN TIEP TOI DA
FROM 	dbo.SYSTEMCONFIGSERVICEINFO
WHERE   SERVICEID=1        ---"CHON DICH VU"    ---CHON DICH VU

GO

---MEU KHONG CO DU LIEU

--assign uniqueidentifier in a variable
BEGIN
DECLARE @ID uniqueidentifier
SET @ID = NEWID()

INSERT INTO dbo.SYSTEMCONFIGSERVICEINFO(ID,OFFICEID,SERVICEID,WAITTIMEMAX,SERVICETIMEMAX,DISCOUNTITIMEMAX,UNITTIME)
----VALUE  ("OFFICEID DUOC CHON", "SERVICEID DUOC CHON","Thời gian chờ tối đa","Thời gian phục vụ tối đa","Thời gian nghỉ giữa 2 số tối đa",1)
----UNITTIME  Đơn vị tính,Mặc định Giây (1) 1: Second; 2: Minute; 3: hour; 4:day
VALUES  (NEWID(),'08CNHCM','1','500','180','120','1')   
END   

GO

SELECT*FROM dbo.SYSTEMCONFIGSERVICEINFO

GO


---NEU CO DU LIEU, CAP NHAT DU LIEU

UPDATE dbo.SYSTEMCONFIGSERVICEINFO SET WAITTIMEMAX='300',SERVICETIMEMAX='100',DISCOUNTITIMEMAX='150'
WHERE  OFFICEID='08CNHCM' AND 	SERVICEID='1'

GO

SELECT*FROM dbo.SYSTEMCONFIGSERVICEINFO

GO

---NEU NHAN NUT AP DUNG CHO TAT CA CAC DICH VU
---THEM MOI HOC CAP NHAT

----CANH BAO AM THANH
----HINH THUC CANH BAO
----LAY DU LIEU TREN DATABASE


SELECT 	OFFICEID,
		BYSOUND,			---CANH BAO AM THANH, MAC DINH LA TRUE
		BYIMG,				---CANH BAO HÌNH ANH, MAC DINH LA TRUE
		IMGNAME				---DOC FILE TU THU MUC ANH ../IMG/IMGWARNING
FROM   dbo.SYSTEMCONFIGWARNING
WHERE   OFFICEID='08CNHCM'           ----"OFFICEID DUOC CHON"

GO

---NHAN NUT AM THANH
---NEU CHUA CO DU LIEU

BEGIN
DECLARE @ID uniqueidentifier
SET @ID = NEWID()

INSERT INTO dbo.SYSTEMCONFIGWARNING(ID,OFFICEID,BYSOUND,BYIMG,IMGNAME,IMGEXTENSION,IMGSIZE,IMGFOLDER)
VALUES(NEWID(),'08CNHCM','1','1','canhbao','jpg','30','.../IMG/IMGWARNIGING')
---VALUES(NEWID(),"TEN OFFICEID","1 OR 0",'1 OR O',TEN....)
END

GO

---NEU CO DU LIEU
---ON(1) OR OFF(0) AM THANH

UPDATE dbo.SYSTEMCONFIGWARNING SET BYSOUND='1'
WHERE  OFFICEID='08CNHCM'

GO

--------------------------------------------------------------------
------DOAN TEST DU LIEU-DOAN NAY KHONG CAN QUAN TAM
SELECT*FROM dbo.SYSTEMCONFIGWARNING
GO

DELETE FROM [dbo].[SYSTEMCONFIGWARNING]
      WHERE OFFICEID='08CNHCM'
GO

BEGIN
DECLARE @ID uniqueidentifier
SET @ID = NEWID()

INSERT INTO dbo.SYSTEMCONFIGWARNING(ID,OFFICEID,BYSOUND,BYIMG,IMGNAME,IMGEXTENSION,IMGSIZE,IMGFOLDER)
VALUES(NEWID(),'08CNHCM','1','1','canhbao','jpg','30','.../IMG/IMGWARNIGING')
---VALUES(NEWID(),"TEN OFFICEID","1 OR 0",'1 OR O',TEN....)
END

UPDATE dbo.SYSTEMCONFIGWARNING SET BYSOUND='1',BYIMG='1',IMGNAME='THONGBAO',IMGEXTENSION='PNG',IMGSIZE='40'
WHERE  OFFICEID='08CNHCM'

GO
------KET THUC TEST
-----------------------------------------------------------------------



----NHAN NUT TAI HINH ANH
----NHAN NUT XOA HINH

---KIEM TRA NEU CHUA DU LIEU, UPDATE HINH ANH
BEGIN
DECLARE @ID uniqueidentifier
SET @ID = NEWID()

INSERT INTO dbo.SYSTEMCONFIGWARNING(ID,OFFICEID,BYSOUND,BYIMG,IMGNAME,IMGEXTENSION,IMGSIZE,IMGFOLDER)
VALUES(NEWID(),'08CNHCM','1','1','canhbao','jpg','30','.../IMG/IMGWARNIGING')
---VALUES(NEWID(),"TEN OFFICEID","1 OR 0",'1 OR O',TEN....)
END

---NEU CO DU LIEU
---UPDATE HINH ANH
UPDATE dbo.SYSTEMCONFIGWARNING SET BYIMG='1',IMGNAME='CANHBAO',IMGEXTENSION='PNG',IMGSIZE='40'
WHERE  OFFICEID='08CNHCM'  ----"OFFICE ID DA CHON"

GO


