
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

app.controller('callNumber_Controller', ['$scope', '$location', '$resource','$mdDialog','$window','captcha','donviInfo','$sce','getNumber',
function ($scope, $location, $resource,$mdDialog,$window,captcha,donviInfo,$sce,getNumber) {
    let dataTables_Template=[
    'pages/client/laysotructuyen.html',
    'pages/client/laysotructuyenResult.html'
    ];
    $scope.template=dataTables_Template[0];
 ////////// lấy số trực tuyến/////////////
 let textCaptcha=""
 let selectedOption_Config={}
 $scope.showNumber=false

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
                   alert("Kết nối dữ liệu đơn vị " + OFFICEID + "-" + OFFICENAME + "-" + SERVICENAME+  " không thành công"  )
                     return
                    }
         );
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
                        nameCustomer:Info.ho + Info.ten,
                        addressCustomer:Info.diachi,
                        cmndCustomer:Info.cmnd,
                    }
                    // console.log($scope.showInfo)
                    cancelLoading()
                    $scope.template=dataTables_Template[1];
          } else{
                        alert(result[0].status)

          }
            
            }, function () {
                   alert("Kết nối dữ liệu đơn vị " + OFFICEID + "-" + OFFICENAME +  " không thành công"  )
                     return
                    }
         );
   }

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

////////////////////app controller///////////////////
    }])