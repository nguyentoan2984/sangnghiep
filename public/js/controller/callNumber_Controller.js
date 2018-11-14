
var app = angular.module('myApp', ['ngMaterial','ngResource','ui.utils','ngSanitize']);
//////////////////////////////////////////////////////////////

app.factory('captcha', function ($resource) {
    return $resource('/captcha', {  }, {
        query: { method: 'GET', isArray: true },
        save: { method: 'POST' ,isArray: true},
        update: { method: 'PUT',isArray: true },
        delete: { method: 'DELETE',params: {id: '@id'},isArray: true }
    })
});
app.factory('donviInfo', function ($resource) {
    return $resource('/donviInfo', {  }, {
        query: { method: 'GET', isArray: true },
        save: { method: 'POST' ,isArray: true},
        update: { method: 'PUT',isArray: true },
        delete: { method: 'DELETE',params: {id: '@id'},isArray: true }
    })
});
app.factory('getNumber', function ($resource) {
    return $resource('/getNumber/:OFFICEID/:SERVICEID', {  }, {
        query: { method: 'GET', isArray: true },
        save: { method: 'POST' ,isArray: true},
        update: { method: 'PUT',isArray: true },
        delete: { method: 'DELETE',params: {id: '@id'},isArray: true }
    })
});
app.factory('sendNumber', function ($resource) {
    return $resource('/sendNumber', {  }, {
        save: { method: 'POST' ,isArray: true},
      
    })
});
app.factory('rating', function ($resource) {
    return $resource('/rating/:code', {  }, {
        query: { method: 'GET', isArray: true },
        save: { method: 'POST' ,isArray: true},
      
    })
});


app.controller('callNumber_Controller', ['$scope', '$location', '$resource','$mdDialog','$mdToast','$window','captcha','donviInfo','$sce','getNumber','sendNumber','rating',
function ($scope, $location, $resource,$mdDialog,$mdToast,$window,captcha,donviInfo,$sce,getNumber,sendNumber,rating) {
    let dataTables_Template=[
    'pages/client/laysotructuyen.html',
    'pages/client/laysotructuyenResult.html',
    'pages/client/danhgiatructuyen.html',
    ];
    $scope.template=dataTables_Template[2];

    $scope.laysotructuyen=function(){
        $scope.template=dataTables_Template[0];
    }
    $scope.danhgiatructuyen=function(){
        $scope.showDiv=false
        $scope.template=dataTables_Template[2];
    }
 ////////// lấy số trực tuyến/////////////
 let textCaptcha=""
 let selectedOption_Config={}
 $scope.showNumber=false
 let printpdf={}

    $scope.getCaptcha = function(){
        captcha.query({ }, function (result) {
               $scope.maCaptcha=$sce.trustAsHtml(result[0].data);
               textCaptcha=result[0].text
                       }, function () {
                           alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web")
                           return
                          }
               );
    }
    $scope.getCaptcha()

    function load_donvi_Config (){
        donviInfo.query({ }, function (result) {
            if(result[0].control) return    alert("Không load được đơn vị cấu hình vui lòng reset lại trình duyệt")
            $scope.donVi_Config =result
          
                     }, function () {
                         alert("Không load được đơn vị cấu hình vui lòng reset lại trình duyệt")
                         return
                        }
             );
       }
       load_donvi_Config();

       $scope.selectdonvi=function (selectedOption){
        if (!selectedOption) return
        //    ( selectedOption_Config==selectedOption)? null :(
        //        $scope.officeService_callNumber=[]
             
        //    );  
        if (selectedOption_Config==selectedOption) return
               OFFICENAME=selectedOption.OFFICENAME
               OFFICEID =selectedOption.OFFICEID
               ADDRESS =selectedOption.ADDRESS
               selectedOption_Config=selectedOption     
               donviInfo.save({selectedOption}, function (result) {
              if(result[0].control) return   alert("Kết nối dữ liệu đơn vị " + OFFICEID + "-" + OFFICENAME + " không thành công"  )
                $scope.officeService_callNumber = result
                     
                                   }, function () {
                                       alert("Kết nối dữ liệu đơn vị " + OFFICEID + "-" + OFFICENAME + " không thành công"  )
                                       return
                                       }
                           );
            
      }
   ///////////////// goi số dịch vụ//////////////////
   $scope.selectServiceNumber=function (selectedOption){
       if (!selectedOption) return
       ( selectedOption_Config==selectedOption)?null:(
           $scope.waitCustomer="",
           $scope.avgService="",
           $scope.showNumber=false
       );  
       $scope.showAlert ("Loading...")
       getNumber.query({OFFICEID:OFFICEID,SERVICEID:selectedOption.SERVICEID}, function (result) {
        if(result[0].control) return     alert("Kết nối dữ liệu đơn vị " + OFFICEID + "-" + OFFICENAME + "-" + selectedOption.SERVICENAME+  " không thành công"  )
     
        $scope.waitCustomer=result[0].soluongdangcho,
        $scope.avgService=  result[0].AVGSERVETIME    
        $scope.timeGiaodich= result[0].timeGiaodich
        $scope.showNumber=true
        selectedOption_Config=selectedOption
        SERVICEID=selectedOption.SERVICEID
        SERVICENAME=selectedOption.SERVICENAME
        cancelLoading()
        // console.log(result)
                 }, function () {
                    cancelLoading()
                   alert("Kết nối dữ liệu đơn vị " + OFFICEID + "-" + OFFICENAME + "-" + SERVICENAME+  " không thành công"  )
                     return
                    }
         );
   }
   $scope.reset=function(){
   let landingUrl = "http://" + $window.location.host ;
   $window.location.href = landingUrl;
   }

   $scope.capSo=function(Info){
       if(!Info || Info.valueCaptcha==null || Info.valueCaptcha==undefined) return alert(" Bạn vui lòng chọn mã xác thực")
       if(Info.valueCaptcha!==textCaptcha) return alert(" Bạn nhập không đúng mã xác thực")
       $scope.selectServiceNumber(selectedOption_Config)
       Info.timeGiaodich= $scope.timeGiaodich
       $scope.showAlert ("Loading...")
       getNumber.save({OFFICEID:OFFICEID,SERVICEID:SERVICEID,INFOCUSTOMERS:Info}, function (result) {
        if(result[0].control) return     alert("Kết nối dữ liệu đơn vị " + OFFICEID + "-" + OFFICENAME + "-" + SERVICENAME+  " không thành công"  )       
          if( result[0].status=="ok")
          {
                  
                    $scope.showInfo={
                        number:result[0].number,
                        status:result[0].status,
                        serial:result[0].serial,
                        timeGiaodich:$scope.timeGiaodich,
                        diachiGiaodich:ADDRESS,
                        diemGiaodich: OFFICENAME,
                        nameCustomer:Info.ho + " " + Info.ten,
                        addressCustomer:Info.diachi,
                        cmndCustomer:Info.cmnd,
                    }
                    printpdf=$scope.showInfo
                    // console.log($scope.showInfo)
                    cancelLoading()
                    $scope.template=dataTables_Template[1];
          } else{
                        alert(result[0].status)
                        cancelLoading()

          }
            
            }, function () {
                cancelLoading()
                   alert("Kết nối dữ liệu đơn vị " + OFFICEID + "-" + OFFICENAME +  " không thành công"  )
                     return
                    }
         );
   }
/////////////////////gui email///////////
$scope.ShowDialog_sendmail = function (html) {
   let resultInfo= $scope.showInfo
  
    var parentEl = angular.element(document.body);
    $mdDialog.show({
        parent: parentEl,
        // targetEvent: $event,
        // clickOutsideToClose: true,
        escapeToClose: true,
        //   scope: $scope,
        templateUrl: html,
        locals: {
            resultInfo
        },
        controller: DialogController
    }).then(function (obj) {
        if (obj === "cancel") {
        } 
          else
       { 
        $scope.showAlert("processing")
        sendNumber.save(obj, function (result) {
            
              if (result[0].control === 'noOk')
                    {  cancelLoading()
                    alert("có lỗi trong quá trình tương tác server hệ thống")   } 
                 else if( result[0].control=== 'api' )
                     {
                      let landingUrl = "http://" + $window.location.host ;
                      $window.location.href = landingUrl;
                     }  
                         else 
                             {
                              cancelLoading()
                              $scope.showSimpleToast("gửi email thành công");
                             }
                         }, function () {
                             cancelLoading()
                             alert("đường truyền mạng có lỗi vui lòng kiểm tra và nhập lại email")
                             return
                            }
                 );
         }
            
        }, function () {  alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web") });
    // funtion dialog
    function DialogController($scope, $mdDialog,resultInfo) {
        $scope.closeDialog = function () {
            $mdDialog.hide("cancel");
        };
        $scope.send = function (option) {
            let obj={
                control:option,
                Info:resultInfo
            }
         
            $mdDialog.hide({obj});
     
        }
    };
    // funtion dialog
}    // Dialog     


$scope.showSimpleToast = function(string) {
    $mdToast.show(
      $mdToast.simple()
        .textContent(string)
        .position('bottom right' )
        .hideDelay(3000)
        .toastClass(string)
      
    );
  };


   $scope.showAlert = function(ev) {
    $mdDialog.show({
      template: '<md-dialog id="plz_wait" style="box-shadow:none">' +
        '<md-dialog-content layout="row" layout-margin layout-padding layout-align="center center" aria-label="wait">' +
        '<md-progress-circular md-mode="indeterminate" md-diameter="50"></md-progress-circular>' +
        ev +'...' +
        '</md-dialog-content>' +
        '</md-dialog>',
      parent: angular.element(document.body),
      clickOutsideToClose: false,
      fullscreen: false,
      escapeToClose: false
    });
  };
  function cancelLoading(){
    $mdDialog.cancel();
}

$scope.printDocument = function(){

var doc = new jsPDF();
doc.addFont('tahoma.ttf', 'tahoma', 'normal');

doc.setFont('tahoma');
// doc.setFontSize(40);
// doc.setFont("helvetica");

doc.setTextColor(0, 0, 255);
doc.setFontSize(20);
doc.text(25, 50, 'Kết quả đăng ký cấp số trực tuyến của quý khách');
doc.setTextColor(100);
doc.setFontSize(14);
doc.text(30, 60, 'Số phiếu thứ tự: '+ printpdf.number);
doc.setFontSize(14);
doc.text(30, 70,'Số serial xác thực: '+ printpdf.serial);
doc.setFontSize(14);
doc.text(30, 80,'Giao dịch dự kiến lúc: '+ printpdf.timeGiaodich);
doc.setFontSize(14);
doc.text(30, 90,'Điểm giao dịch: '+ printpdf.diemGiaodich);
doc.setFontSize(14);
doc.text(30, 100,'Địa chỉ giao dịch: '+ printpdf.diachiGiaodich);
doc.setFontSize(14);
doc.text(30, 110,'Họ & tên khách hàng: '+ printpdf.nameCustomer);
doc.setFontSize(14);
doc.text(30, 120,'Địa chỉ khách hàng: '+ printpdf.addressCustomer);
doc.setFontSize(14);
doc.text(30, 130,'CMND: '+ printpdf.cmndCustomer);
doc.save('ketqua.pdf');

  }
////////////////////danh gia truc tuyen/////////
 let objRating={}  
 $scope.showDiv=false
$scope.change=function(){
    $scope.showDiv=false
} 
$scope.reset_danhgia=function(){
    $scope.showDiv=false
    $scope.Info={
        code:null,
        valueCaptcha:null

    }
    
}

$scope.getinfoRating=function(Info){
    if(!Info || Info.code==null || Info.code==undefined) return alert(" Bạn vui lòng nhập mã code/serial")
    $scope.showAlert("processing")
    rating.query({code:Info.code}, function (result) {
          if (result[0].control === 'noOk')
                {  cancelLoading()
                alert("có lỗi trong quá trình tương tác server hệ thống hoặc mã code/serial không tồn tại")   } 
             else if( result[0].control=== 'api' )
                 {
                  let landingUrl = "http://" + $window.location.host ;
                  $window.location.href = landingUrl;
                 }  
                     else 
                         {
                         console.log(result)
                          objRating=result[0]
                          $scope.showDiv=true
                          $scope.donviRating=result[0].donvi   
                          $scope.nhanvienRating=result[0].nhanvien
                          $scope.showtieuchi=result[0].Assess
                          cancelLoading()
                          $scope.showSimpleToast("load thành công");
                         }
                     }, function () {
                        cancelLoading()
                         alert("đường truyền mạng có lỗi vui lòng kiểm tra và nhập lại mã xác thực")
                         return
                        }
             );
}

$scope.checkRating = function(index) {
    if(index==1) 
    {objRating.BEST="0",objRating.GOOD="1",objRating.AVERAGE="0",objRating.POOR="0"}
    if(index==2) 
    {objRating.BEST="1",objRating.GOOD="0",objRating.AVERAGE="0",objRating.POOR="0"}
    if(index==3) 
    {objRating.BEST="0",objRating.GOOD="0",objRating.AVERAGE="1",objRating.POOR="0"}
    if(index==4) 
    {objRating.BEST="0",objRating.GOOD="0",objRating.AVERAGE="0",objRating.POOR="1"}
    
}

$scope.danhgia=function(Info){
    if(!Info || Info.valueCaptcha==null || Info.valueCaptcha==undefined) return alert(" Bạn vui lòng nhập mã xác thực")
    if(Info.valueCaptcha!==textCaptcha) return alert(" Bạn nhập không đúng mã xác thực")
    $scope.showAlert("processing")
    rating.save(objRating, function (result) {
        if (result[0].control === 'noOk')
              {  cancelLoading()
              alert("có lỗi trong quá trình tương tác server hệ thống ")   } 
           else if( result[0].control=== 'api' )
               {
                let landingUrl = "http://" + $window.location.host ;
                $window.location.href = landingUrl;
               }  
                   else 
                       {
                        cancelLoading()
                        $scope.showSimpleToast("đánh giá thành công");
                       }
                   }, function () {
                        cancelLoading()
                       alert("đường truyền mạng có lỗi vui lòng kiểm tra và nhập lại mã xác thực")
                       return
                      }
           );
}

////////////////////app controller///////////////////
    }])