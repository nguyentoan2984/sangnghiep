
app.factory('phanquyenUser', function ($resource) {
        return $resource('/phanquyenUser/:maUser', {  }, {
            query: { method: 'GET', isArray: true },
            save: { method: 'POST' ,isArray: true},
            update: { method: 'PUT',isArray: true },
            delete: { method: 'DELETE',params: {id: '@id'},isArray: true }
        })
    }); 

app.controller('phanquyenUser_Controller', ['$scope', '$location', '$resource',
'$interval','$mdToast','$mdDialog','$timeout','DTOptionsBuilder',
'DTColumnBuilder','DTColumnDefBuilder','phanquyenUser',
function ($scope, $location, $resource,$interval,$mdToast, $mdDialog, $timeout,DTOptionsBuilder,
DTColumnBuilder,DTColumnDefBuilder,phanquyenUser) {
    $scope.showAlert("processing")
    phanquyenUser.query({}, function (result) {
                // console.log(result)
                if(result[0].control) {
                    cancelLoading()
                    alert("load dịch vụ của user không thành công"  )
                    return
                }  
              cancelLoading()
                // console.log(result)
                $scope.rules=result.pop().arrayRules
                $scope.accounts=result
                // console.log($scope.accounts)
                // console.log($scope.rules)
                   
                                 }, function () {
                                //      cancelLoading()
                                alert("load dịch vụ của user không thành công"  )
                                     return
                                     }
                         );

        $scope.ShowDialog_addUser = function () {
                let rules=  $scope.rules
                 var parentEl = angular.element(document.body);
                 $mdDialog.show({
                     parent: parentEl,
                     // targetEvent: $event,
                     // clickOutsideToClose: true,
                     escapeToClose: true,
                     //   scope: $scope,
                     templateUrl: 'pages/admin/dialogUserAdd.html',
                     locals: {
                        rules
                     },
                     controller: DialogController
                 }).then(function (obj) {
                    // console.log(obj)
                    if (obj === "cancel") return
                    if(!obj.MaQuyen[0]) return alert (" vui lòng thêm quyền hạn cho account")
                  $scope.showAlert("processing")
                    phanquyenUser.save({obj}, function (result) {
                        // console.log(result)
                        if(result[0].control) {
                            cancelLoading()
                            alert(" thêm user không thành công"  )
                            return
                        }  
                      cancelLoading()
                      $scope.showSimpleToast("thêm account thành công")
                        $scope.accounts=result
                        // console.log($scope.accounts)
                                         }, function () {
                                             cancelLoading()
                                        alert(" thêm user không thành công"  )
                                             return
                                             }
                                 );
                     }, function () {  alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web") });
                 // funtion dialog
                 function DialogController($scope, $mdDialog,rules) {
                         $scope.rules=rules
                         let objMaQuyen=[]
                     $scope.closeDialog = function () {
                         $mdDialog.hide("cancel");
                     };
                     $scope.addDialog = function (user) {
                     
                      
                        user.MaQuyen=objMaQuyen
                        $mdDialog.hide(user);
                     }
                     $scope.checkRules=function(checkrule,MaQuyen){
                        let index = objMaQuyen.findIndex(maquyen => maquyen === MaQuyen);
                        if (checkrule) {
                            if(index==-1)
                            objMaQuyen.push(MaQuyen)
                        }
                        else{
                            if(index==-1) return
                            objMaQuyen.splice(index, 1)
                        }
                        // console.log(objMaQuyen)
                    }
                 };
                 // funtion dialog
             } 

             $scope.ShowDialog_confirm = function (index) {
                 let maUser=$scope.accounts[index].MaNV
                var parentEl = angular.element(document.body);
                $mdDialog.show({
                    parent: parentEl,
                    // targetEvent: $event,
                    // clickOutsideToClose: true,
                    escapeToClose: true,
                    //   scope: $scope,
                    templateUrl: 'pages/admin/dialogDelete-confirm.html',
                    locals: {
                       
                    },
                    controller: DialogController
                }).then(function (obj) {
              
                   if (obj === "cancel") return
                   if (obj === "dichvu")
                   {
                    $scope.showAlert("processing")  
                    phanquyenUser.delete({maUser}, function (result) {
                        // console.log(result)
                        if(result[0].control) {
                            cancelLoading()
                            alert(" xoá user không thành công"  )
                            return
                        }  
                      cancelLoading()
                        // $scope.rules=result.pop().arrayRules
                        $scope.accounts=result
                        $scope.showSimpleToast(" xoá account thành công")
                                         }, function () {
                                             cancelLoading()
                                        alert(" xoá user không thành công"  )
                                             return
                                             }
                                 );
                   }
                 
                    }, function () {  alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web") });
                // funtion dialog
                function DialogController($scope, $mdDialog) {
                    $scope.closeDialog = function () {
                        $mdDialog.hide("cancel");
                    };
                    $scope.delete = function (option) {
                        $mdDialog.hide(option);
                    }
                };
                // funtion dialog
            } 

            $scope.ShowDialog_EditUser = function (index) {
                let rules=  $scope.rules
                let userEdit=$scope.accounts[index]
                console.log(userEdit)
                 var parentEl = angular.element(document.body);
                 $mdDialog.show({
                     parent: parentEl,
                     // targetEvent: $event,
                     // clickOutsideToClose: true,
                     escapeToClose: true,
                     //   scope: $scope,
                     templateUrl: 'pages/admin/dialogUserEdit.html',
                     locals: {
                        rules,
                        userEdit
                     },
                     controller: DialogController
                 }).then(function (obj) {
                    // console.log(obj)
                    if (obj === "cancel") return
                    if(!obj.MaQuyen[0]) return alert (" vui lòng thêm quyền hạn cho account")
                    $scope.showAlert("processing")
                    phanquyenUser.update({obj}, function (result) {
                        // console.log(result)
                        if(result[0].control) {
                            cancelLoading()
                            alert(" cập nhật user không thành công"  )
                            return
                        }  
                      cancelLoading()
                        // $scope.rules=result.pop().arrayRules
                        $scope.showSimpleToast(" cập nhật account thành công")
                        $scope.accounts=result
                                         }, function () {
                                             cancelLoading()
                                        alert(" cập nhật user không thành công"  )
                                             return
                                             }
                                 );
                     }, function () {  alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web") });
                 // funtion dialog
                 function DialogController($scope,$mdDialog,rules,userEdit) {
                     
                         $scope.rules=rules
                        //  let objMaQuyen=userEdit.MaQuyen
                            let objMaQuyen=[]
                            for (let num of userEdit.MaQuyen) {
                                objMaQuyen.push(num.MaQuyen)
                            }
                         
                         $scope.user ={
                             MaNV:userEdit.MaNV,
                             ho:userEdit.Ho,
                             ten:userEdit.Ten,
                             username:userEdit.UserName,
                             password:userEdit.PassUser,
                             email:userEdit.Email
                         }
                        
                     $scope.closeDialog = function () {
                         $mdDialog.hide("cancel");
                     };
                     $scope.EditDialog = function (user) {
                       user.MaQuyen=objMaQuyen
                        $mdDialog.hide(user);
                     }
                     $scope.checkRules=function(checkrule,MaQuyen){
                        let index = objMaQuyen.findIndex(maquyen => maquyen === MaQuyen);
                        if (checkrule) {
                            if(index==-1)
                            objMaQuyen.push(MaQuyen)
                        }
                        else{
                            if(index==-1) return
                            objMaQuyen.splice(index, 1)
                        }
                        // console.log(objMaQuyen)
                    }

                    $scope.funtionCheck=function(result){
                        // console.log(result,userEdit.MaQuyen)
                            if(!userEdit.MaQuyen[0].MaQuyen) return
                            for (let num of userEdit.MaQuyen) {
                                if( num.MaQuyen==result)  return true
                            }
                            return false

                    }
                 };
                 // funtion dialog
             } 

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
           
   

}])