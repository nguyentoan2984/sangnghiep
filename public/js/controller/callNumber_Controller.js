app.controller('callNumber_Controller', ['$scope', '$location', '$resource','captcha',
function ($scope, $location, $resource,captcha) {
    $scope.capSo = function(){
        console.log("ok Toàn")

        $scope.donVi_Config = [
            {id: '1', name: 'Option A'},
            {id: '2', name: 'Option B'},
            {id: '3', name: 'Option C'}
          ];

        captcha.query({ }, function (result) {
            
              console.log(result)
               
                       }, function () {
                           alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web")
                           return
                          }
               );
    }
    }])