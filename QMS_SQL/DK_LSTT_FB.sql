---CHATBOT

---NHAN TIN NHAN TU FACE NEU CO DANG KY DAT SO
---LOAD SEVER DON VI
---KET NOI SEVER TONG
---GUI LEN FACEBOOK CAC DON VI DE USER CHON
GO

SELECT OFFICEID,OFFICENAME,ORDERINDEX  FROM dbo.OFFICE
WHERE  ISACTIVE=1
ORDER BY ORDERINDEX

GO
---Nếu không kết nối được  hiển thị số khách hàng đang chờ là rỗng, thời gian phục vụ trung bình là rỗng
---Hiển thị cảnh báo “Bạn vui lòng chọn đơn vị khác. Hoặc liên hệ trực tiếp đơn vị để được hỗ trợ.”


---NEU USER CHON DON VI, GUI TIEP DICH VU CAU DON VI DO CHO USER CHON
SELECT SERVICEID,
       SVcode,     ----Ma nay la ma Ma_DonVi
	   SERVICENAME ----Ten dich vu 
FROM dbo.SERVICEINFO
ORDER BY SERVICEID


------phan tich bang (xem duoi)
/*
	Xử lý cú pháp theo cấu trúc khách hàng cung cấp.
	Cấu trúc tin nhắn đọc từ bảng dbo.SYSTEMCONFIGSMSYM
	Mặc định nếu không có dữ liệu cung cấp  xử lý theo cú pháp mặc định của hệ thống là [DKCS][Ma_DonVi][Ho_TenKH]
*/
 ----khi user gui ten dich vu: sever gui --(SVcode ==Ma_DonVi) va cu phap dang ky cho user

/*============================================
    Dùng hàm API của Facebook nhận tin nhắn từ người 
	gởi vào tài khoản Facebook nhận đăng ký cấp số:
============================================*/
USE [BQDB]
GO

SELECT ID
      ,EMAILPUBLIC
      ,EMAILPUBLICPASSWORD
      ,SWICHBOARD
      ,SMS
      ,SMSEXAMPLE
      ,FACEBOOK
      ,FBMESSAGE
      ,DATEACTIVE
      ,ISACTIVE
  FROM dbo.SYSTEMCONFIGSMSYM
GO
----	Điều kiện lấy 1 giá trị cột FACEBOOK, còn sử dụng (ISACTIVE =1)  
--------và có ngày áp dụng gần ngày hiện hành nhất (DATEACTIVE >= Getdate())
SELECT		FACEBOOK AS N'Cấu trúc tin nhắn'
FROM		dbo.SYSTEMCONFIGSMSYM
WHERE		ISACTIVE='1' 
 ----Mặc định nếu không có dữ liệu cung cấp  xử lý theo 
 --cú pháp mặc định của hệ thống là [DKCS][Ma_DonVi][Ho_TenKH]

---vi du cu phap dang ky [DKCS][08CNHCM1][Le Van A]
---phan tich ra: don vi =08CNHCM ,DICH VU =1, FIRSTNAME = Le Van    LASTNAME = A

--------------------------------------------------------------------------
----1 Căn cứ [Mã_Đơn vị]  thực hiện kết nối server của đơn vị được chọn 
--------------------------------------------------------------------------
---KET NOI SEVER DON VI

SELECT IPDATABASE,DATABASENAME,USERNAME,PASSWORD  FROM dbo.OFFICE
WHERE  OFFICEID='08CNHCM'     ---GIA TRI OFFICEID DUOC CHON

GO


---	Nếu không kết nối được:
---	Insert Log lỗi hệ thống [dbo].[AbpAuditLogs]  xét:

INSERT INTO dbo.AbpAuditLogs
           (---TenantId
           --,UserId--
           ServiceName
           ,MethodName
           ,Parameters
           ,ExecutionTime
           ,ExecutionDuration
           ,ClientIpAddress
        ---   ,ClientName
           ,BrowserInfo
           ,Exception
        ---   ,ImpersonatorUserId
        ---   ,ImpersonatorTenantId
           ,CustomData)
     VALUES
           (---'NULL'	--------<TenantId, int,>      
          --- ,'NULL',	--------<UserId, bigint,>
           'triluatsoft.tls.Web.Controllers.HomeController' -----<ServiceName, nvarchar(256),> LAY TU FRAMKWORD
           ,'Index'  ------<MethodName, nvarchar(256),> LAY TU FRAMKWORD
           ,'{}'   --------<Parameters, nvarchar(1024),> LAY TU FRAMKWORD
           ,GETDATE() ------<ExecutionTime, datetime,>
           ,'30'  ------<ExecutionDuration, int,>  LAY TU FRAMKWORD
           ,'1.55.176.116'  -------------<ClientIpAddress, nvarchar(64),>  LAY TU FRAMKWORD
        ---   ,'NULL'  ------------<ClientName, nvarchar(128),>  LAY TU FRAMKWORD
           ,'Chrome / 68.0 / Unknown'   ------------<BrowserInfo, nvarchar(256),>  LAY TU FRAMKWORD
           ,'Error: 08CNHCM  Xử lý kết nối server đăng ký số bằng Facebook” + “tên Facebook gởi tin đăng ký”+ “không thành công. Thông số đăng nhập [IPDATABASE] : 45.117.171.3 [DATABASENAME]: BQueueDB  [USERNAME]: bqueueuser [PASSWORD]: bqueuepassword.'
			--------<Exception, nvarchar(2000),>
        ---   ,'NULL' ----<ImpersonatorUserId, bigint,>  LAY TU FRAMKWORD
        ---   ,'NULL' ----<ImpersonatorTenantId, int,>   LAY TU FRAMKWORD
           ,'Error: 08CNHCM  Xử lý kết nối server đăng ký số bằng Facebook” + “tên Facebook gởi tin đăng ký”+ “không thành công. Thông số đăng nhập [IPDATABASE] : 45.117.171.3 [DATABASENAME]: BQueueDB  [USERNAME]: bqueueuser [PASSWORD]: bqueuepassword.')							
			-----<CustomData, nvarchar(2000),>)<CustomData, nvarchar(2000),>)
GO


/*  GUI THONG TIN DEN FACEBOOK NGUOI DANG KY
“Không tìm thấy thông tin dịch vụ của đơn vị được chọn,
bạn vui lòng liên hệ trực tiếp đơn vị cần đăng ký để được hỗ trợ. ”, 

*/
--------------------------------------------------------------------------
---2. Load danh sách dịch vụ theo đơn vị được chọn:
--------------------------------------------------------------------------
---LOAD DICH VU DANG KY

---KET NOI VOI SEVER CHI NHANH
BEGIN  
    SELECT STARTNO, ENDNO, ISSUEDNO, STARTTIME, ENDTIME, STARTTIME2, ENDTIME2, RESET
    FROM SERVICEINFO
    WHERE SERVICEID = '1'
END


---NEU KIEN TRA KHONG CO DU LIEU trong bảng dbo.SERVICEINFO 
/*	
		Insert Log lỗi hệ thống [dbo].[AbpAuditLogs]  xét:
*/
INSERT INTO dbo.AbpAuditLogs
           (---TenantId
           --,UserId--
           ServiceName
           ,MethodName
           ,Parameters
           ,ExecutionTime
           ,ExecutionDuration
           ,ClientIpAddress
        ---   ,ClientName
           ,BrowserInfo
           ,Exception
        ---   ,ImpersonatorUserId
        ---   ,ImpersonatorTenantId
           ,CustomData)
     VALUES
           (---'NULL'	--------<TenantId, int,>      
          --- ,'NULL',	--------<UserId, bigint,>
           'triluatsoft.tls.Web.Controllers.HomeController' -----<ServiceName, nvarchar(256),> LAY TU FRAMKWORD
           ,'Index'  ------<MethodName, nvarchar(256),> LAY TU FRAMKWORD
           ,'{}'   --------<Parameters, nvarchar(1024),> LAY TU FRAMKWORD
           ,GETDATE() ------<ExecutionTime, datetime,>
           ,'30'  ------<ExecutionDuration, int,>  LAY TU FRAMKWORD
           ,'1.55.176.116'  -------------<ClientIpAddress, nvarchar(64),>  LAY TU FRAMKWORD
        ---   ,'NULL'  ------------<ClientName, nvarchar(128),>  LAY TU FRAMKWORD
           ,'Chrome / 68.0 / Unknown'   ------------<BrowserInfo, nvarchar(256),>  LAY TU FRAMKWORD
           ,'Error: Khách hàng đăng ký số, hệ thống không tìm thấy dữ liệu dịch vụ trong dbo.SERVICEINFO. Thông số đăng nhập [IPDATABASE] : 45.117.171.3 [DATABASENAME]: BQueueDB  [USERNAME]: bqueueuser [PASSWORD]: bqueuepassword.'
			--------<Exception, nvarchar(2000),>
        ---   ,'NULL' ----<ImpersonatorUserId, bigint,>  LAY TU FRAMKWORD
        ---   ,'NULL' ----<ImpersonatorTenantId, int,>   LAY TU FRAMKWORD
           ,'Error: Khách hàng đăng ký số, hệ thống không tìm thấy dữ liệu dịch vụ trong dbo.SERVICEINFO. Thông số đăng nhập [IPDATABASE] : 45.117.171.3 [DATABASENAME]: BQueueDB  [USERNAME]: bqueueuser [PASSWORD]: bqueuepassword.')							
			-----<CustomData, nvarchar(2000),>)<CustomData, nvarchar(2000),>)
GO

-------GUI THONG TIN FACEBOOK NGUOI DUNG NOI DUNG------------------------------
----“Không tìm thấy thông tin dịch vụ của đơn vị được chọn, 
----bạn vui lòng liên hệ trực tiếp đơn vị cần đăng ký để được hỗ trợ. ”, 
----------------------------------------------------------------------------------


/*
Kiểm tra nếu đã hết giờ giao dịch 
Hiển thị cảnh báo “Đã hết giờ giao dịch, bạn vui lòng liên hệ trực tiếp đơn vị cần đăng ký để được hỗ trợ.”
Dữ liệu kiểm tra trong bảng dbo.SERVICEINFO, 
	so sánh Giờ Phút Giây hiện hành hệ thống (Getdate()) 
	nếu lớn hơn cả 2 giờ giao dịch ENDTIME và ENDTIME2 .
*/

---number (SmallInt)  bien so dang ky dich vu

SELECT GETDATE() AS t   ---thoi gian hien tai

    IF (t < STARTTIME) or (ENDTIME2 < t) or ( (t > ENDTIME) and (t < STARTTIME2))then
      number = 0     ---- Ngoai gio giao dich (out of time)
	  ----Hiển thị cảnh báo “Đã hết giờ giao dịch, bạn vui lòng liên hệ trực tiếp đơn vị cần đăng ký để được hỗ trợ.
    ELSE BEGIN -----valid time  ----trong gio giao dich
      number = ISSUEDNO + 1;

/*
o	Kiểm tra số được cấp cuối cùng đã vượt số quy định
	cảnh báo “Số đăng ký đã được cấp hết, bạn vui lòng liên hệ trực tiếp đơn vị cần đăng ký để được hỗ trợ.” 
*/


 if number < STARTNO then			    -------nếu số thứ tự nhỏ hơn số bắt đầu dịch vụ
		 number = STARTNO				----reset lai so thu tu
 else if number > ENDNO then		    
        -----Thông báo ngung cap so thu tu
		-----Cảnh báo “Số đăng ký đã được cấp hết, bạn vui lòng liên hệ trực tiếp đơn vị cần đăng ký để được hỗ trợ


--------------------------------------------------------------------------
---6. Lưu dữ liệu cấp số thứ tự khách hàng
	
--------------------------------------------------------------------------
---Insert dữ liệu đăng ký khách hàng cung cấp vào bảng dbo.REGISTRATIONFORM

 ----Insert dữ liệu bảng dbo.REGISTRATIONFORM
 /*
		Số thứ tự cung cấp khách hàng: CUSTOMERNO = MAX(ISSUEDNO) + 1 (Phát sinh theo công thức khách hàng cung cấp)
		Số Serial phát sinh ngẫu nhiên và không được trùng lặp : SERIAL
		SERVINGTIME: ngày lấy theo ngày hiện tại ( GETDATE()), giờ (lấy từ khách hàng cung cấp)
		ISSUEDFROM = 1 (đăng ký từ WEB)
		OFFICEID = “ID của đơn vị đăng ký”
		SERIAL = Cấp phát tự sinh, không trùng lặp
		Và các cột khác, số liệu tượng tự trên mục mô tả giao diện.

 */
---SELECT*FROM REGISTRATIONFORM
---GO
---DELETE FROM REGISTRATIONFORM
---WHERE  dieu kien


--------------------------------------------------------------------------------------------------------------
 ----Insert
 ----Neu du lieu nao trong sẽ để giá trị là NULL với một số thông số không cần thiết


 ----Tinh 'Ngày giờ hẹn phục vụ'
		----Khoang thoi gian cho hen phuc vu (don vi la phut)= Số khách hàng đang chờ*Thời gian phục vụ trung bình 
		----SELECT DATEADD(MINUTE, 'Khoang thoi gian cho hen phuc vu', GETDATE()) as 'Ngày giờ hẹn phục vụ' =SERVINGTIME 

SELECT DATEADD(MINUTE, 10, GETDATE()) as 'Ngày giờ hẹn phục vụ'    --gia su thoi gian cho la 10 phut

------KET NOI VOI SEVER TONG DE INSER THONG TIN KHACH HANG
BEGIN
---------------------------------
------SERIAL = Cấp phát tự sinh, không trùng lặp
DECLARE @SERIAL VARCHAR(6)
SET     @SERIAL=LEFT(NEWID(),6)
WHILE   (EXISTS(SELECT SERIAL FROM dbo.REGISTRATIONFORM WHERE SERIAL =@SERIAL))
BEGIN    SET @SERIAL=LEFT(NEWID(),6)
END
SELECT  @SERIAL  AS 'SERIAL'
--------------------------------------
DECLARE @ID uniqueidentifier
SET @ID = NEWID()

INSERT INTO dbo.REGISTRATIONFORM
           (ID
           ,DATE
           ,OFFICEID
           ,SERVICEID
           ,FIRSTNAME
           ,LASTNAME
           ---,ADDRESS
          --- ,EMAIL
           ---,IDENTITYCARD
           ---,MOBILEPHONE
           ,FACEBOOK       -----LINK FACEBOOK CUA KHACH HANG
           ,CUSTOMERNO
           ,SERIAL         -----LAY GIA TRI SERIAL O TREN
           ,SERVINGTIME    ----SELECT DATEADD(MINUTE, 'THOI GIAN CHO', GETDATE()) as 'Ngày giờ hẹn phục vụ'
           ,ISSUEDFROM)    ----ISSUEDFROM = 3 (đăng ký từ Facebook)
     VALUES
           (@ID
           ,GETDATE()
           ,'08CNHCM'
           ,'1'
           ,'Le Van'      ---TACH HO TEN TU CU PHAP KHACH HANG GUI
           ,'A'
          --- ,NULL
          --- ,NULL       
          --- ,NULL        
          --- ,NULL		
           ,'https://www.facebook.com/vana'
           ,'1007'
           , @SERIAL                   ----<SERIAL, nvarchar(6),>
           ,'2018-10-13 19:40:00'       ----Ngày giờ hẹn phục vụ /tinh toan o tren
           ,'3')                       ----3 dang ky tren FACEBOOK
END


SELECT*FROM dbo.REGISTRATIONFORM




/*
Insert dữ liệu bảng dbo.CUSTOMERS
		CUSTOMERNO = số thứ tự đã cấp
		STATUS = 0 ( trạng thái chờ phục vụ)
*/

INSERT INTO dbo.CUSTOMERS
           (CUSTOMERNO
           ,SERVICEID
           ,COUNTERID
           ,StaffID
           ,TOCOUNTERTIME
           ,SERVINGTIME
           ,FINISHTIME
           ,STATUS
           ,ISSUEDFROM
           ---,ReportStatus
		   )
     VALUES
           ('1007'			---<CUSTOMERNO, smallint,>
           ,'1'				---<SERVICEID, tinyint,>
           ,NULL			---<COUNTERID, tinyint,>
           ,NULL			---<StaffID, char(2),>
           ,GETDATE()		---<TOCOUNTERTIME, datetime,>
           ,NULL			---<SERVINGTIME, datetime,>
           ,NULL			---<FINISHTIME, datetime,>
           ,'0'				---<STATUS, tinyint,>
           ,'3'				---<ISSUEDFROM, tinyint,>   dang ky tu facebook
           ---,NULL			---<ReportStatus, tinyint,>
		   )
GO

----VIET LAI NGAN GON, HAI LENH INSERT LA TUONG DUONG

INSERT INTO dbo.CUSTOMERS (CUSTOMERNO,SERVICEID,TOCOUNTERTIME,STATUS,ISSUEDFROM)
VALUES      ('1007','1',GETDATE(),'0','1') 


DELETE FROM dbo.CUSTOMERS
WHERE		CONVERT(CHAR(10), TOCOUNTERTIME, 103) ='14/10/2018'

SELECT*FROM dbo.CUSTOMERS
WHERE       CONVERT(CHAR(10), TOCOUNTERTIME, 103) ='14/10/2018'


/*
	Insert dữ liệu bảng dbo.REGISTRATIONFORMINFO
	REGISTRATIONFORMID = “giá trị dbo.REGISTRATIONFORM.ID ”
	CUSTOMERSID = “giá trị dbo.CUSTOMERS.ID”
*/

---LAY SO ID CUA KHACH HANG VUA TDANG KY TRONG REGISTRATIONFORM
SELECT*FROM dbo.CUSTOMERS   ---DUNG DE KIEM TRA DU LIEU
GO
SELECT*FROM dbo.REGISTRATIONFORM  ---DUNG DE KIEM TRA DU LIEU
SELECT*FROM dbo.REGISTRATIONFORMINFO   ---DUNG DE KIEM TRA DU LIEU
-----LAY SO REGISTRATIONFORMID TU BANG dbo.REGISTRATIONFORM cua khach hang vua dang ky
----DU LIEU LAAY TU DATABASE TONG 'BQBD'
SELECT ID AS REGISTRATIONFORMID
FROM		 dbo.REGISTRATIONFORM
WHERE		 OFFICEID='08CNHCM'
AND			 CONVERT(CHAR(10),DATE, 103) = '14/10/2018'   ---NGAY HIEN TAI
AND			 CUSTOMERNO ='1007'    -----so phieu khach hang vua dang ky


-----Lay so CUSTOMERSID        tu bang dbo.CUSTOMERS        cua khach Hang vua dang ky
-----DU LIEU LAY TU DATABASE CHI NHANH
SELECT ID AS CUSTOMERSID
FROM		 dbo.CUSTOMERS
WHERE		 CUSTOMERNO ='1007'    -----so phieu khach hang vua dang ky
AND			 CONVERT(CHAR(10), TOCOUNTERTIME, 103) = '14/10/2018'   ---NGAY HIEN TAI

BEGIN
DECLARE @ID uniqueidentifier
SET @ID = NEWID()
INSERT INTO dbo.REGISTRATIONFORMINFO
           (ID
           ,REGISTRATIONFORMID
           ,CUSTOMERSID)
     VALUES
           (NEWID()				---<ID, uniqueidentifier,>
           ,'5ABAEC80-5A55-48FA-8183-9CC79DB5CD1D'			---<REGISTRATIONFORMID, uniqueidentifier,>
           ,'21624')			---<CUSTOMERSID, int,>)
END

/*
	Update dữ liệu bảng dbo. SERVICEINFO
	ISSUEDNO = <Số thứ tự cung cấp cho khách hàng>
	Điều kiệu: SERVICEID = “ID dịch vụ mà khách hàng chọn cấp số”
*/
----SEVER CHI NHANH
SELECT*FROM dbo.SERVICEINFO

UPDATE dbo.SERVICEINFO 
SET    ISSUEDNO='1007'     ---<Số thứ tự cung cấp cho khách hàng>
WHERE  SERVICEID='1'


/*
o	Insert dữ liệu bảng dbo.YMLOG
*/


INSERT INTO dbo.YMLOG
           (YMTIME
           ,YID
           ,MESSAGE)
     VALUES
           (GETDATE()					---thoi gian nhan tin nhan
           ,'1234544656757'					---id facebook cua nguoi nhan tin
           ,'[DKCS][08CNHCM1][Le Van A]')		---Noi dung tin nhan
GO




--------------------------------------------------------------------------
---7. Hiển thị giao diện kết quả đăng ký cấp số, viết hàm API truyền tham số Form:
------@REGISTRATIONFORM = < REGISTRATIONFORM.ID> vừa insert được.
--------------------------------------------------------------------------

----------------------------------------------------------------------------------------------------------------------------
----------------------------######################################################------------------------------------------

--------------------------------------------------------------------------
------GIAO DIEN DANG KY CAP SO TRUC TUYEN
/*
•	Thông tin kết quả số thứ tự đăng ký của khách hàng:
o	Lấy kết quả đăng ký số thứ tự của khách hàng.
o	Dữ liệu lấy từ bảng dbo.REGISTRATIONFORM
o	Điều kiện ID = @REGISTRATIONFORM <tham số Form>
o	Hiển thị kết quả đăng ký cấp số.
*/
--------------------------------------------------------------------------
---KET NOI SEVER CHI NHANH

SELECT   CUSTOMERNO			AS 'Số phiếu thứ tự',
         SERIAL				AS 'Số serial xác thực',
		 SERVINGTIME		AS 'Giao dịch dự kiến lúc',		
		 CONCAT(FIRSTNAME,' ',LASTNAME,' ') AS 'Họ & Tên KH',
		 ---ADDRESS   AS  'Địa chỉ khách hàng',
		 ---IDENTITYCARD AS 'CMND'
FROM     dbo.REGISTRATIONFORM
WHERE    ID= '5ABAEC80-5A55-48FA-8183-9CC79DB5CD1D'    ---

---KETNOI VOI SEVER TONG


BEGIN
SELECT	OFFICENAME AS 'Điểm giao dịch',
		ADDRESS AS    'Địa chỉ giao dịch'
FROM	dbo.OFFICE
WHERE	OFFICEID='08CNHCM'     ---GIA TRI OFFICEID DUOC CHON
END


----LAY THONG TIN TREN DE CHO HIEN THI RA FORM DANG KY