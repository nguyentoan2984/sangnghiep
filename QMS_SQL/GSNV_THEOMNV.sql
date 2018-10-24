/*============================================*/
---MAN HINH GIAM SAT TRUC TUYEN NHAN VIEN                     
/*============================================*/

---Bước 1: Thực hiện kết nối server đến đơn vị được chọn
GO

BEGIN
SELECT OFFICEID,OFFICENAME,ORDERINDEX  FROM dbo.OFFICE
WHERE  ISACTIVE=1
ORDER BY ORDERINDEX
END

GO
---Thực hiện kết nối server đến đơn vị được chọn

BEGIN
SELECT IPDATABASE,DATABASENAME,USERNAME,PASSWORD  FROM dbo.OFFICE
WHERE  OFFICEID='08CNHCM'     ---GIA TRI OFFICEID DUOC CHON
END

GO

---Nếu không kết nối được 
---Hiển thị thông báo “Kết nối dữ liệu đơn vị” + “Mã – tên đơn vị” + “ không thành công


---Bước 2: Load danh sách  dịch vụ của đơn vị -->combo Dịch vụ

BEGIN
SELECT SERVICEID,SERVICENAME FROM dbo.SERVICEINFO
ORDER BY STARTNO
END

GO


---Buoc 3: Load danh sách nhan vien theo dich vu (staffid) ----> LAY DANH SACH THEO NHAN VIEN
BEGIN 	   
SELECT		dbo.STAFFS.STAFFID AS 'mnv'
FROM		dbo.STAFFS,dbo.COUNTERSERVICE
WHERE       dbo.STAFFS.COUNTERID=dbo.COUNTERSERVICE.COUNTERID
AND			dbo.COUNTERSERVICE.SERVICEID='1'
ORDER BY    dbo.STAFFS.COUNTERID
END

---KQ dbo.STAFFS.STAFFID =51
-------------------------------------------------------------------------------------------
-----------------BANG HIEN THI THONG TIN NHAN VIEN-----------------------------------------
-------------------------------------------------------------------------------------------
---Bước 4: Load danh sách tất cả nhân viên của đơn vị 
------Mã nhân viên, Tên nhân viên, quầy, số đang phục vụ, Thời gian phục vụ hiện tại, 
------Thời gian phục vụ trung bình, Thời gian chờ trung bình, Thời gian nghỉ giữa 2 số liên tiếp

--[dbo].STAFFS

--	STAFFID			Char(2)			NOT NULL,		---KHoá chính
--	StaffIDOffice	Varchar(8)		NOT NULL,		---Mã nhân viên
--	LASTNAME		Nvarchar(30)	NOT NULL,		---Tên
--	FIRSTNAME		Nvarchar(10)	NOT NULL,		---Họ vả tên lót
--	COUNTERID		Tinyint			,		---Quầy ngồi phục vụ
--	STATUS			tinyint			,
--	STATUSTIME		Datetime		,
--	LOGIN			Bit				,
--	StaffIDLog		Char(5)			,
--	CONSTRAINT      PK_STAFFS		PRIMARY KEY (STAFFID)


----1. HIEN THI COT "NHAN VIEN" 
-------LAY MA NHAN VIEN CUA QUAY DUOC CHON

SELECT 		CONCAT(dbo.STAFFS.StaffIDOffice,'-',dbo.STAFFS.LASTNAME,' ',dbo.STAFFS.FIRSTNAME) AS 'Nhân Viên',
			dbo.STAFFS.COUNTERID AS 'Quầy'
FROM		dbo.STAFFS			
WHERE		dbo.STAFFS.STAFFID='51'         --- 'BIEN MNV'     ---'BIEN MNV'  ---THAY LAN LUOT MA NHAN VIEN O LIST TREN

			
----2       HIEN THI "QUAY"
	
----3. 		HIEN THI "SO DANG PHUC VU"
---Số đang phục vụ: Xác định số đang phục vụ bằng cách dựa vào dbo.CUSTOMERS.STATUS = 1 	
---Lay so dang phuc vu cua quay duoc chon


SELECT 		dbo.CUSTOMERS.CUSTOMERNO AS 'Số đang phục vụ'
FROM    	dbo.CUSTOMERS 
WHERE		dbo.CUSTOMERS.STATUS = '1' 
			AND dbo.CUSTOMERS.STAFFID='51'                      ---      'BIEN MNV'  ---'BIEN QUAY'	   ---HIEN THI SO DANG PHUC  VU O QUAY 1
			AND CONVERT(CHAR(10), TOCOUNTERTIME, 103) = '24/10/2018'               ---'NGAY HIEN TAI dd/mm/yyyy'

----KQ dbo.CUSTOMERS.CUSTOMERNO=1003
			
---4. Thời gian phục vụ số hiện tại cot "PHUC VU HIEN TAI"
---   Thời gian hiện tại - CUSTOMERS. SERVINGTIME
------Hien thi thoi gian tinh toan: DATEDIFF("bien",---) bien ="s" hay "Second" tinh bang giay, 'n' hay "m" "Minute" tinh bang phut
------Dang cho hien thi bang giay 
BEGIN 
SELECT      DATEDIFF("SECOND",dbo.CUSTOMERS.SERVINGTIME,GETDATE())   ----GETDATE() ngay gio hien tai (he thong)
FROM		dbo.CUSTOMERS 
WHERE		dbo.CUSTOMERS.CUSTOMERNO ='1003'     ----'SO DANG PHUC VU'					 ---LA SO DANG PHUC VU CUA CUSTOMER O DICH VU TREN
			AND CONVERT(CHAR(10), TOCOUNTERTIME, 103) = '24/10/2018'  ----'NGAY HIEN TAI dd/mm/yyyy'
END

GO

---5. Phục vụ lâu nhất
---Thời gian phục vụ lâu nhất của một nhân viên. Tính từ đầu ngày đến thời điểm giám sát (giờ hiện tại) 

BEGIN
SELECT 	    MAX(DATEDIFF("SECOND", dbo.CUSTOMERS.SERVINGTIME, dbo.CUSTOMERS.FINISHTIME)) AS MAXSERVETIME				---//Thoi gian phuc vu max cua MOT NHAN VIEN 
FROM    	dbo.CUSTOMERS
WHERE   	dbo.CUSTOMERS.STATUS = '3' AND dbo.CUSTOMERS.STAFFID='51' ---'BNV'
			AND CONVERT(CHAR(10), TOCOUNTERTIME, 103) = '24/10/2018'  ---'NGAY HIEN TAI dd/mm/yyyy'
END

-----dbo.CUSTOMERS.STATUS = '3'   NHUNG KHACH HANG DA PHUC VU XONG

SELECT*FROM dbo.CUSTOMERS
WHERE		CONVERT(CHAR(10), TOCOUNTERTIME, 103) = '24/10/2018'
GO
---6-7 . Phục vụ trung bình HIEN COT " PHUC VU TRUNG BINH" VA "CHO TRUNG BINH"
BEGIN
SELECT		
			ROUND(AVG(DATEDIFF("SECOND", dbo.CUSTOMERS.SERVINGTIME, dbo.CUSTOMERS.FINISHTIME)), 0) AS AVGSERVETIME,		---//Thoi gian phuc vu trung binh  cua NV 
			-----THOI GIAN PHUC VU TRUNG BINH
            ROUND(AVG(DATEDIFF("SECOND", dbo.CUSTOMERS.TOCOUNTERTIME, dbo.CUSTOMERS.SERVINGTIME)), 0) AS AVGWAITTIME,	---//Thoi gian cho trung bình cua NV 
			-----CHO HIEN THI VO COT THOI GIAN CHO TRUNG BINH
			MAX(DATEDIFF("SECOND", dbo.CUSTOMERS.SERVINGTIME, dbo.CUSTOMERS.FINISHTIME)) AS MAXSERVETIME				    ---//Thoi gian phuc vu lau nhat cua mot NV
FROM    	dbo.CUSTOMERS
WHERE   	dbo.CUSTOMERS.STATUS = '3' AND dbo.CUSTOMERS.STAFFID='51'		--- 'BIEN MNV' 
			AND CONVERT(CHAR(10), TOCOUNTERTIME, 103) = '24/10/2018'		-----   'NGAY HIEN TAI dd/mm/yyyy'
END



---8 Thời gian nghỉ giữa hai số thứ tự :Thời gian hiện tại - CUSTOMERS.FINISHTIME
----CUSTOMERS.FINISHTIME  lay gia tri CUSTOMERS.FINISHTIME cua khach hang phuc vu sau cung, da phuc vu xong
BEGIN
SELECT		DATEDIFF("SECOND", MAX(dbo.CUSTOMERS.FINISHTIME),GETDATE()) AS 'Thời gian nghỉ'
FROM    	dbo.CUSTOMERS
WHERE   	dbo.CUSTOMERS.STATUS = '3' AND dbo.CUSTOMERS.STAFFID='51'		--- 'BIEN MNV' 
			AND CONVERT(CHAR(10), TOCOUNTERTIME, 103) = '24/10/2018'		-----   'NGAY HIEN TAI dd/mm/yyyy'
END
			
---LAY DU LIEU MUC GIOI HAN DICH VU TU BANG dbo.SYSTEMCONFIGSERVICEINFO
SELECT  WAITTIMEMAX ,       ----THOI GIAN CHO PHUC VU TOI DA
		SERVICETIMEMAX,     ----THOI GIAN PHUC VU TOI DA
		DISCOUNTITIMEMAX    ----THOI GIAN NGHI GIUA HAI SO LIEN TIEP TOI DA
FROM 	dbo.SYSTEMCONFIGSERVICEINFO
WHERE   SERVICEID=1        ---"CHON DICH VU"    ---CHON DICH VU

---- SO SANH "THOI GIAN NGHI GIUA HAI SO LIEN TIEP'>"DISCOUNTITIMEMAX" (DOI SANG DON VI LA GIAY, GIA TRI HIEN TAI LA PHUT) ---> TO VANG CELL ---> NEU CO CHECK "Tim theo vuot gioi han nghi giua hai so lien tiep'
----
---- SO SANH "THOI GIAN PHUC VU HIEN TAI" > SERVICETIMEMAX (DOI SANG DON VI LA GIAY) ---> TO XANH CELL ----> NEU CO CHECK "Tim theo thoi gian phuc vu vuot gioi han'
---- NEU KHONG CHECK BO QUA BUOC SO SANH NAY  
