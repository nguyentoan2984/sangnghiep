--------------------------------------------------------------------------
---1. Thực hiện kết nối server dữ liệu đến đơn vị cần giao dịch được chọn:
--------------------------------------------------------------------------

---LOAD SEVER DON VI
---KET NOI SEVER TONG
GO

SELECT OFFICEID,OFFICENAME,ORDERINDEX  FROM dbo.OFFICE
WHERE  ISACTIVE=1
ORDER BY ORDERINDEX

GO


---KET NOI SEVER DON VI

SELECT IPDATABASE,DATABASENAME,USERNAME,PASSWORD  FROM dbo.OFFICE
WHERE  OFFICEID='08CNHCM'     ---GIA TRI OFFICEID DUOC CHON

GO


---Nếu không kết nối được  hiển thị số khách hàng đang chờ là rỗng, thời gian phục vụ trung bình là rỗng
---Hiển thị cảnh báo “Bạn vui lòng chọn đơn vị khác. Hoặc liên hệ trực tiếp đơn vị để được hỗ trợ.”

--------------------------------------------------------------------------
---2. Load danh sách dịch vụ theo đơn vị được chọn:
--------------------------------------------------------------------------
---LOAD CAC DICH VU
SELECT SERVICEID,SERVICENAME FROM dbo.SERVICEINFO
ORDER BY SERVICEID

--------------------------------------------------------------------------
---3. Thống kê số khách hàng đang chờ và thời gian phục vụ trung bình.
--------------------------------------------------------------------------

---Số khách hàng đang chờ: 
SELECT		COUNT(CUSTOMERNO)
FROM		dbo.CUSTOMERS
WHERE       STATUS = 0
			---AND COUNTERID = NULL 
			AND	SERVICEID='1'
	        AND CONVERT(CHAR(10), TOCOUNTERTIME, 103) = '12/10/2018' 
			
---Thời gian phục vụ trung bình
BEGIN
SELECT		
		ROUND(AVG(DATEDIFF("MINUTE", dbo.CUSTOMERS.SERVINGTIME, dbo.CUSTOMERS.FINISHTIME)), 0) AS AVGSERVETIME	---// HIEN THI "Thoi gian phuc vu trung binh"  cua dv 		
FROM    	dbo.CUSTOMERS
WHERE   	dbo.CUSTOMERS.STATUS = '3' AND dbo.CUSTOMERS.SERVICEID ='1' AND CONVERT(CHAR(10), TOCOUNTERTIME, 103) ='12/10/2018'   ---'NGAY HIEN TAI dd/mm/yyyy'
END

----Hiển thị số khách hàng đang chờ và thời gian phục vụ trung bình.

--------------------------------------------------------------------------
---4. Click Button Đổi mã khác
		---Kết nối API để lấy mã Captcha khác
--------------------------------------------------------------------------


--------------------------------------------------------------------------
---5. Click Button Cấp số
	
--------------------------------------------------------------------------

/*============================================
5.1  Kiểm tra dữ liệu nhập của khách hàng:   
Kiểm tra nếu chưa chọn Đơn vị cần giao dịch 
	hiện thị cảnh báo “Bạn vui lòng chọn đơn vị cần đăng ký giao dịch”
	Focus vào combo Đơn vị cần giao dịch
Kiểm tra nếu Mã xác thực nhập không có giá trị
	hiển thị yêu cầu “Bạn vui lòng nhập mã xác thực” 
	Focus vào text Nhập mã xác thực
Kiểm tra nếu Mã xác thực không đúng 
	hiển thị yêu cầu “Mã xác thực chưa đúng, 
	bạn vui lòng nhập lại”  Focus vào text Nhập mã xác thực.
============================================*/

/*============================================
5.2  Nếu tất cả thoả yêu cầu ---->thực hiện kết nối server của đơn vị được chọn   
o	Dữ liệu kết nối server  lấy từ bảng dbo.OFFICE (IPDATABASE, DATABASENAME, USERNAME, PASSWORD).
	Điều kiện OFFICEID = <giá trị Mã đơn vị cần giao dịch được chọn>
o	Nếu không kết nối được  
	hiển thị thông báo “Số đăng ký đã được cấp hết, bạn vui lòng liên hệ trực tiếp đơn vị cần đăng ký để được hỗ trợ.”
o	Đồng thời ghi Log lỗi hệ thống [dbo].[AbpAuditLogs] 
============================================*/
----KET NOI VOI SERVER TONG DE GHI LOG LOI
SELECT*FROM dbo.AbpAuditLogs

SELECT*FROM dbo.OFFICE
---LAY THONG SO DE GHI LOI
SELECT OFFICENAME
      ,ADDRESS
      ,IPDATABASE
      ,DATABASENAME
      ,USERNAME
      ,PASSWORD
  FROM	dbo.OFFICE
  WHERE	OFFICEID='08CNHCM'
GO

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
           ,'Error: 08CNHCM  Khách hàng kết nối server đăng ký số web không thành công. Thông số đăng nhập [IPDATABASE] : 45.117.171.3 [DATABASENAME]: BQueueDB  [USERNAME]: bqueueuser [PASSWORD]: bqueuepassword.'
			--------<Exception, nvarchar(2000),>
        ---   ,'NULL' ----<ImpersonatorUserId, bigint,>  LAY TU FRAMKWORD
        ---   ,'NULL' ----<ImpersonatorTenantId, int,>   LAY TU FRAMKWORD
           ,'Error: 08CNHCM  Khách hàng kết nối server đăng ký số web không thành công. Thông số đăng nhập [IPDATABASE] : 45.117.171.3 [DATABASENAME]: BQueueDB  [USERNAME]: bqueueuser [PASSWORD]: bqueuepassword.')							
			-----<CustomData, nvarchar(2000),>)<CustomData, nvarchar(2000),>)
GO

/*
	CustomData = “Error:” + “Mã đơn vị giao dịch được chọn” + “Khách hàng kết nối server đăng ký số web không thành công. Thông số đăng nhập [IPDATABASE] :” + “giá trị cột IPDATABASE” + “[DATABASENAME]:” + “giá trị cột DATABASENAME” + “[USERNAME]:” + “giá trị cột USERNAME” + “[PASSWORD]:” + “giá trị cột PASSWORD”.
	Thông số đăng nhập lấy từ bảng dbo.OFFICE các cột IPDATABASE, DATABASENAME, USERNAME, PASSWORD, Điều kiện OFFICEID = <giá trị Mã đơn vị cần giao dịch được chọn>
	Nếu không có dữ liệu thì trả về giá trị Null cho tất cả các thông số.
	Exception = CustomData
	Các cột khác Framkword đã hỗ trợ.

ex: CustomData= Error: 08CNHCM  Khách hàng kết nối server đăng ký số web không thành công. 
			Thông số đăng nhập [IPDATABASE] : 45.117.171.3 [DATABASENAME]:
			BQueueDB  [USERNAME]: bqueueuser [PASSWORD]: bqueuepassword.
*/

/*
o	Kiểm tra nếu không có bất kỳ dịch vụ nào có trong hệ thống  hiển thị cảnh báo 
	“Không tìm thấy thông tin dịch vụ của đơn vị được chọn, bạn vui lòng liên hệ trực tiếp đơn vị cần đăng ký để được hỗ trợ. ” 
	Dữ liệu kiểm tra trong bảng dbo.SERVICEINFO  kết quả là không có già trị trong bảng này.
	Đồng thời ghi Log lỗi hệ thống [dbo].[AbpAuditLogs]  xét:
*/

/*
	CustomData = “Error:” + “Mã đơn vị giao dịch được chọn” + “Khách hàng đăng ký số, hệ thống không tìm thấy dữ liệu dịch vụ trong dbo.SERVICEINFO. Thông số đăng nhập hệ thống [IPDATABASE] :” + “giá trị cột IPDATABASE” + “[DATABASENAME]:” + “giá trị cột DATABASENAME” + “[USERNAME]:” + “giá trị cột USERNAME” + “[PASSWORD]:” + “giá trị cột PASSWORD”
	'Error: 08CNHCM  Khách hàng đăng ký số, hệ thống không tìm thấy dữ liệu dịch vụ trong dbo.SERVICEINFO. Thông số đăng nhập [IPDATABASE] : 45.117.171.3 [DATABASENAME]: BQueueDB  [USERNAME]: bqueueuser [PASSWORD]: bqueuepassword.'
*/

----neu khong co du lieu nao trong he thong

INSERT INTO dbo.AbpAuditLogs
           (
            ExecutionTime
		   ,ExecutionDuration   ---khoang thoi gian thuc hien---lay tu he thong 
           ,Exception
           ,CustomData)
     VALUES
           (GETDATE() ------<ExecutionTime, datetime,>
		   ,'10'   
           ,'Error: 08CNHCM  Khách hàng kết nối server đăng ký số web không thành công. Thông số đăng nhập [IPDATABASE] : 45.117.171.3 [DATABASENAME]: BQueueDB  [USERNAME]: bqueueuser [PASSWORD]: bqueuepassword.'
			--------<Exception, nvarchar(2000),>
           ,'Error: 08CNHCM  Khách hàng kết nối server đăng ký số web không thành công. Thông số đăng nhập [IPDATABASE] : 45.117.171.3 [DATABASENAME]: BQueueDB  [USERNAME]: bqueueuser [PASSWORD]: bqueuepassword.')							
			-----<CustomData, nvarchar(2000),>)<CustomData, nvarchar(2000),>)
GO


/*
Kiểm tra nếu đã hết giờ giao dịch 
Hiển thị cảnh báo “Đã hết giờ giao dịch, bạn vui lòng liên hệ trực tiếp đơn vị cần đăng ký để được hỗ trợ.”
Dữ liệu kiểm tra trong bảng dbo.SERVICEINFO, 
	so sánh Giờ Phút Giây hiện hành hệ thống (Getdate()) 
	nếu lớn hơn cả 2 giờ giao dịch ENDTIME và ENDTIME2 .
*/
---KET NOI VOI SEVER CHI NHANH
BEGIN  
    SELECT STARTNO, ENDNO, ISSUEDNO, STARTTIME, ENDTIME, STARTTIME2, ENDTIME2, RESET
    FROM SERVICEINFO
    WHERE SERVICEID = '1'
END

---number (SmallInt)  bien so dang ky dich vu

SELECT GETDATE() AS t   ---thoi gian hien tai

    IF (t < STARTTIME) or (STARTTIME2 < t) or ( (t > ENDTIME2) and (t < STARTTIME2))then
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
 ----Neu du lieu nao trong sẽ để giá trị là NULL với một số thông số không cần thiết như FACEBOOK


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
           ,ADDRESS
           ,EMAIL
           ,IDENTITYCARD
           ,MOBILEPHONE
           ,FACEBOOK
           ,CUSTOMERNO
           ,SERIAL         -----LAY GIA TRI SERIAL O TREN
           ,SERVINGTIME    ----SELECT DATEADD(MINUTE, 'THOI GIAN CHO', GETDATE()) as 'Ngày giờ hẹn phục vụ'
           ,ISSUEDFROM)    ----ISSUEDFROM = 1 (đăng ký từ WEB)
     VALUES
           (@ID
           ,GETDATE()
           ,'08CNHCM'
           ,'1'
           ,'Le'
           ,'Van A'
           ,'Thich Quang Duc'
           ,'vana@gmail.com'
           ,'12345612290'
           ,'0901234569'
           ,'https://www.facebook.com/vana'
           ,'1007'
           , @SERIAL                   ----<SERIAL, nvarchar(6),>
           ,'2018-10-13 19:40:00'       ----Ngày giờ hẹn phục vụ /tinh toan o tren
           ,'1')                       ----1 dang ky tren web
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
           ,'1'				---<ISSUEDFROM, tinyint,>
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
		 ADDRESS   AS  'Địa chỉ khách hàng',
		 IDENTITYCARD AS 'CMND'
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