
var app = angular.module('myApp', ['ngResource','ngSanitize']);
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

app.controller('callNumber_Controller', ['$scope', '$location', '$resource','$window','captcha','donviInfo','$sce','getNumber',
function ($scope, $location, $resource,$window,captcha,donviInfo,$sce,getNumber) {
    
 ////////// lấy số trực tuyến/////////////
 let selectedOption_Config={}
 $scope.showNumber=false
    $scope.getCaptcha = function(){
        captcha.query({ }, function (result) {
               $scope.maCaptcha=$sce.trustAsHtml(result[0].data);
              console.log( result)
                       }, function () {
                           alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web")
                           return
                          }
               );
    }
    $scope.getCaptcha()
    function load_donvi_Config (){
        donviInfo.query({ }, function (result) {
            $scope.donVi_Config =result
            console.log(result)
                     }, function () {
                         alert("Không load được đơn vị cấu hình vui lòng reset lại trình duyệt")
                         return
                        }
             );
       }
       load_donvi_Config();

       $scope.selectdonvi=function (selectedOption){
        if (!selectedOption) return
           ( selectedOption_Config==selectedOption)?null:(
               $scope.officeService_callNumber=[]
             
           );  
               OFFICENAME=selectedOption.OFFICENAME
               OFFICEID =selectedOption.OFFICEID
               selectedOption_Config=selectedOption     
               donviInfo.save({selectedOption}, function (result) {
               $scope.officeService_callNumber = result
                 console.log(result)
                     
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
       getNumber.query({OFFICEID:OFFICEID,SERVICEID:selectedOption.SERVICEID}, function (result) {
        $scope.waitCustomer=result[0].soluongdangcho,
        $scope.avgService=  result[0].AVGSERVETIME    
        
        $scope.showNumber=true
        selectedOption_Config=selectedOption
        console.log(result)
        
                 }, function () {
                   alert("Kết nối dữ liệu đơn vị " + OFFICEID + "-" + OFFICENAME + "-" + selectedOption.SERVICENAME+  " không thành công"  )
                     return
                    }
         );
           
   }


     



    }])