
var app = angular.module('myApp', ['ngResource','ngSanitize']);
//////////////////////////////////////////////////////////////

app.factory('captcha', function ($resource) {
    return $resource('/captcha/:storename', {  }, {
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





app.controller('callNumber_Controller', ['$scope', '$location', '$resource','$window','captcha','donviInfo','$sce',
function ($scope, $location, $resource,$window,captcha,donviInfo,$sce) {
    
    $window.orientation=1

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



    }])