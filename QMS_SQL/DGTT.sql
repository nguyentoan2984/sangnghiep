
--------------------------------------------------------------------------
---GIAO DIỆN ĐÁNH GIÁ TRỰC TUYẾN
--------------------------------------------------------------------------
/*============================================
Bước 1, căn cứ vào số SERIAL mà khách hàng nhập
lấy ID phiếu đăng ký yêu cầu cấp số.
============================================*/
/*Kiểm tra nếu Mã Code/serial chưa được nhập  Cảnh báo “Bạn vui lòng nhập mã Code” )*/
SELECT*FROM dbo.REGISTRATIONFORM
GO
SELECT*FROM dbo.REGISTRATIONFORMINFO
GO
---VIET CHI TIET
SELECT	dbo.REGISTRATIONFORM.ID AS REGISTRATIONFORMID		
FROM	dbo.REGISTRATIONFORM
WHERE	dbo.REGISTRATIONFORM.SERIAL='JhdWyH'


SELECT	dbo.REGISTRATIONFORMINFO.CUSTOMERSID AS CUSTOMERSID		
FROM	dbo.REGISTRATIONFORMINFO
WHERE	dbo.REGISTRATIONFORMINFO.REGISTRATIONFORMID='0D7F6D78-741F-94FB-970C-39E8A143AF2F'
GO

---VIET TONG HOP
SELECT	dbo.REGISTRATIONFORM.OFFICEID AS  OFFICEID,
		dbo.REGISTRATIONFORM.ID AS  REGISTRATIONFORMID,
		dbo.REGISTRATIONFORMINFO.CUSTOMERSID AS CUSTOMERSID		
FROM	dbo.REGISTRATIONFORM,dbo.REGISTRATIONFORMINFO
WHERE	dbo.REGISTRATIONFORM.SERIAL='JhdWyH'
AND		dbo.REGISTRATIONFORMINFO.REGISTRATIONFORMID=dbo.REGISTRATIONFORM.ID

----dbo.REGISTRATIONFORM.SERIAL='JhdWyH'--> KET QUA CUSTOMERSID=21592   REGISTRATIONFORMID 0D7F6D78-741F-94FB-970C-39E8A143AF2F
----Nếu không tìm thấy số thứ tự 
----Hiển thị cảnh báo “Mã code (số serial) không đúng, bạn vui lòng nhập lại.” 
----Focus vào Text Mã Code.
/*============================================
Bước 2: Lấy mã nhân viên đã giao dịch (StaffID) khách hàng.
============================================*/
---LAY THONG TIN DON VI
SELECT OFFICENAME AS 'Đơn vị:' 
FROM dbo.OFFICE
WHERE  OFFICEID='08CNHCM'

GO
---KET NOI SEVER DON VI

SELECT IPDATABASE,DATABASENAME,USERNAME,PASSWORD  FROM dbo.OFFICE
WHERE  OFFICEID='08CNHCM'     ---GIA TRI OFFICEID DUOC CHON

GO
---NHAN VIEN GIAO DICH
---Hiển thị Họ và tên của nhân viên đã giao dịch với khách.

SELECT*FROM dbo.CUSTOMERS

SELECT 		dbo.STAFFS.StaffIDOffice AS 'mnv',
			dbo.STAFFS.STAFFID  AS    'staffid',
			dbo.CUSTOMERS.CUSTOMERNO AS 'customerno',
			CONCAT(dbo.STAFFS.StaffIDOffice,'-',dbo.STAFFS.LASTNAME,' ',dbo.STAFFS.FIRSTNAME) AS 'Nhân Viên'
FROM		dbo.STAFFS,dbo.CUSTOMERS			
WHERE		dbo.CUSTOMERS.ID='21592'
			AND dbo.STAFFS.STAFFID=dbo.CUSTOMERS.StaffID

---kq: staffid =51   CUSTOMERNO=1019
/*============================================
9.7.2	Selected 1 tiêu chí đánh giá
•	Kiểm tra nếu đã chọn 1 tiêu chí đầu tiên (hài lòng), thì không được chọn các tiêu chí còn lại.
•	Kiểm tra nếu đã chọn tiêu chí khác tiêu chí đầu tiên (hài lòng) thì không được chọn tiêu chí đầu tiên.

9.7.3	Nhấn nút Đổi mã Captcha khác
•	Kết nối API để lấy mã Captcha khác.
============================================*/
/*============================================
9.7.4	Nhấn nút Gởi đánh giá
o	Insert kết quả đánh giá vào bảng [dbo].[RATINGS]
	VOTETIME lấy chính xác ngày giờ hệ thống.
	BEST = “1 tương đương giá trị tiêu chí đầu tiên được chọn, nếu không chọn tiêu chí này thì để là 0”
	GOOD= “1 tương đương giá trị tiêu chí thứ 2 được chọn, nếu không chọn tiêu chí này thì để là 0”
	AVERAGE= “1 tương đương giá trị tiêu chí thứ 3 được chọn, nếu không chọn tiêu chí này thì để là 0”
	POOR= “1 tương đương giá trị tiêu chí thứ 4 được chọn, nếu không chọn tiêu chí này thì để là 0”
============================================*/
SELECT*FROM dbo.RATINGS
---Insert kết quả đánh giá vào bảng [dbo].[RATINGS]
---kq: staffid =51   CUSTOMERNO=1019

BEGIN
INSERT INTO dbo.RATINGS
           (ID
		   ,VOTETIME
           ,STAFFID
           ,CustomerNo
           ,BEST
           ,GOOD
           ,AVERAGE
           ,POOR
           )
     VALUES
           (@MA_NEXT
		   ,GETDATE()			--<VOTETIME, datetime,>
           ,'51'			--<STAFFID, char(2),>
           ,'1019'			---<CustomerNo, int,>
           ,'1'			---<BEST, smallint,>
           ,'0'			---<GOOD, smallint,>
           ,'0'			---<AVERAGE, smallint,>
           ,'0'			---<POOR, smallint,>
           )

END

----LAY MA SO ID VUA TAO 

SELECT Max(ID) as LastID FROM dbo.RATINGS
----KQ ID =1114


/*
	RATINGSID = “@ID bảng [dbo].[RATINGS] tạo bước trên”
	REGISTRATIONFORMID = “ID của phiếu yêu cầu lấy ở bước trên”
	SERIAL = “Giá trị Text Mã code”
*/

SELECT*FROM dbo.RATINGSINFO

----dbo.REGISTRATIONFORM.SERIAL='JhdWyH'--> KET QUA CUSTOMERSID=21592   REGISTRATIONFORMID 0D7F6D78-741F-94FB-970C-39E8A143AF2F
----Insert dữ liệu bảng [dbo].[RATINGSINFO]

BEGIN
DECLARE @ID uniqueidentifier
SET @ID = NEWID()

INSERT INTO dbo.RATINGSINFO
           (ID
           ,RATINGSID
           ,REGISTRATIONFORMID
           ,SERIAL)
     VALUES
           (@ID														----<ID, uniqueidentifier,>
           ,'1114'														----<RATINGSID, bigint,>
           ,'0D7F6D78-741F-94FB-970C-39E8A143AF2F'					----<REGISTRATIONFORMID, uniqueidentifier,>
           ,'JhdWyH'												-----<SERIAL, nvarchar(6),>
		   )
END
GO
