﻿--/*==============================================================*/
--Cau hinh he thong 
--Cau hinh nhan vien                                     
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
WHERE  OFFICEID='08CNHCM'     ---GIA TRI OFFICEID DUOC CHON

GO

----LOAD DANH SACH DICH VU DON VI
----COMBO DON VI MAC DINH : CHON DICH VU

SELECT SERVICEID,SERVICENAME FROM dbo.SERVICEINFO
ORDER BY STARTNO

GO

---LOAD DANH SACH QUAY DON VI---COMBO QUAY

SELECT COUNTERID FROM dbo.COUNTERSERVICE   ---HIEN THI COUNTERID 
GROUP BY COUNTERID
ORDER BY COUNTERID

GO

---LOAD DANH SACH NHAN VIEN CUA DON VI --> GIRD 1

SELECT COUNTERID AS QUAY,CONCAT(StaffIDOffice,' ',LASTNAME,' ',FIRSTNAME) AS 'HO VA TEN'
FROM   dbo.STAFFS
ORDER BY StaffIDOffice

GO
---------------------------------
--- 2. CHOM COMBO DICH VU
---------------------------------

---LOAD DANH SACH QUAY CUA DICH VU DUOC CHON

SELECT COUNTERID FROM dbo.COUNTERSERVICE   	---HIEN THI COUNTERID
WHERE  SERVICEID=1 	---DICH VU DC CHON
GROUP BY COUNTERID
ORDER BY COUNTERID

GO

---LOAD DANH SACH NHAN VIEN THEO DICH VU DUOC CHON

SELECT a.COUNTERID AS 'QUAY',(a.StaffIDOffice + " " + a.LASTNAME + " " + a.FIRSTNAME) AS 'HO VA TEN'
FROM   dbo.STAFFS a,dbo.COUNTERSERVICE b
WHERE  a.COUNTERID = b.COUNTERID AND b.SERVICEID="DICH VU DUOC CHON"
ORDER BY COUNTERID,StaffIDOffice

GO

SELECT a.COUNTERID AS 'QUAY',CONCAT(a.StaffIDOffice,' ',a.LASTNAME,' ',a.FIRSTNAME) AS 'HO VA TEN'
FROM   dbo.STAFFS a,dbo.COUNTERSERVICE b
WHERE  a.COUNTERID = b.COUNTERID AND b.SERVICEID=1            ----"DICH VU DUOC CHON"
ORDER BY a.COUNTERID,a.StaffIDOffice

GO



---------------------------------
--- 3. CHOM COMBO QUAY
---------------------------------

---HIEN THI TREN GRID1

SELECT COUNTERID AS 'QUAY',(StaffIDOffice + " " + LASTNAME + " " + FIRSTNAME) AS 'HO VA TEN'
FROM   dbo.STAFFS
WHERE  COUNTERID <> "ID CUA QUAY DUOC CHON"
ORDER BY COUNTERID,StaffIDOffice

GO

SELECT COUNTERID AS QUAY,CONCAT(StaffIDOffice,' ',LASTNAME,' ',FIRSTNAME) AS 'HO VA TEN'
FROM   dbo.STAFFS
WHERE  COUNTERID <> 1       ---"ID CUA QUAY DUOC CHON"
ORDER BY COUNTERID,StaffIDOffice

GO

---HIEN THI TREN GRID2

SELECT COUNTERID AS QUAY,CONCAT(StaffIDOffice,' ',LASTNAME,' ',FIRSTNAME) AS 'HO VA TEN'
FROM   dbo.STAFFS
WHERE  COUNTERID = 1       ---"ID CUA QUAY DUOC CHON"
ORDER BY COUNTERID,StaffIDOffice

GO

---------------------------------
--- 4. TIM MA HOAC TEN NHAN VIEN
---------------------------------

---HIEN THI TREN GRID1
---TIM NHAN VIEN 'Thanh Hiền'

SELECT COUNTERID AS QUAY,CONCAT(StaffIDOffice,' ',LASTNAME,' ',FIRSTNAME) AS 'HO TEN'
FROM   dbo.STAFFS
WHERE  COUNTERID <> 1       ---"ID CUA QUAY DUOC CHON"
AND    CONCAT(StaffIDOffice,' ',LASTNAME,' ',FIRSTNAME) LIKE N'%thanh%hiền%' ----TEXTBOX : TIM TREN TEXT TIM MA
ORDER BY COUNTERID,StaffIDOffice

GO



---HIEN THI TREN GRID2 
---TIM MA NHAN VIEN 155001

SELECT COUNTERID AS QUAY,CONCAT(StaffIDOffice,' ',LASTNAME,' ',FIRSTNAME) AS 'HO TEN'
FROM   dbo.STAFFS
WHERE  COUNTERID = 1       ---"ID CUA QUAY DUOC CHON"
AND    CONCAT(StaffIDOffice,' ',LASTNAME,' ',FIRSTNAME) LIKE N'%155001%' ----TEXTBOX : TIM TREN TEXT TIM MA
ORDER BY COUNTERID,StaffIDOffice

GO


---------------------------------
--- 5. CHECK VA UNCHECK 
---------------------------------
--SELECT*FROM dbo.STAFFS
--GO
---CAP NHAT KHI NHAN NUT >>
---VD CHUYEN NHAN VIEN OANH-51 TU 1 SANG QUAY 2

UPDATE dbo.STAFFS SET COUNTERID=2        ---"ID QUAY DUOC CHON" 
WHERE  STAFFID = 51                        ---"ID NHAN VIEN DUOC CHON O GRID1"

GO

---CAP NHAT KHI NHAN NUT <<

UPDATE dbo.STAFFS SET COUNTERID= 0 
WHERE  STAFFID ="ID NHAN VIEN DUOC CHON O GRID1"

GO

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
--WHERE   SERVICEID=1        ---"CHON DICH VU"    ---CHON DICH VU

GO

---MEU KHONG CO DU LIEU

INSERT INTO dbo.SYSTEMCONFIGSERVICEINFO(OFFICEID,SERVICEID,WAITTIMEMAX,SERVICETIMEMAX,DISCOUNTITIMEMAX,UNITTIME)
VALUES  ('08CNHCM','1','500','180','120','1')      
----VALUE  ("OFFICEID DUOC CHON", "SERVICEID DUOC CHON","Thời gian chờ tối đa","Thời gian phục vụ tối đa","Thời gian nghỉ giữa 2 số tối đa",1)
----UNITTIME  Đơn vị tính,Mặc định Giây (1) 1: Second; 2: Minute; 3: hour; 4:day

GO


---NEU CO DU LIEU, CAP NHAT DU LIEU

UPDATE dbo.SYSTEMCONFIGSERVICEINFO SET WAITTIMEMAX="",SERVICETIMEMAX="",DISCOUNTITIMEMAX=""
WHERE  OFFICEID="" AND 	SERVICEID=""

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
SELECT*FROM dbo.SYSTEMCONFIGWARNING


INSERT INTO dbo.SYSTEMCONFIGWARNING(ID,OFFICEID,BYSOUND)
VALUES(1,'08CNHCM',1)
---VALUES("TEN OFFICEID","1 OR 0")
GO

---NEU CO DU LIEU

UPDATE dbo.SYSTEMCONFIGWARNING SET BYSOUND="1 OR 0"
WHERE  OFFICEID="OFFICE ID DA CHON"

GO

----NHAN NUT TAI HINH ANH
----NHAN NUT XOA HINH

---UPDATE HINH ANH
UPDATE dbo.SYSTEMCONFIGWARNING SET BYIMG="1 OR 0",IMGNAME="TEN ANH"
WHERE  OFFICEID="OFFICE ID DA CHON"

GO
