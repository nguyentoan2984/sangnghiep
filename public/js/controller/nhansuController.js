app.controller('nhansuController', ['$scope', '$location', '$resource', '$mdDialog','$mdToast',
'CuahangInfo', 'UsersCuaHang', 'UserCuaHang','cuaHang','chamcong',
'KhuVuc','arrays_option','Excel','$timeout', 'DTOptionsBuilder',
 'DTColumnBuilder', 'DTColumnDefBuilder','phucapkhoantru','confirmUser','$window','changepasswordQuanly','bhxh','daotao',
function ($scope, $location, $resource, $mdDialog, $mdToast,
    CuahangInfo, UsersCuaHang, UserCuaHang,cuaHang,chamcong,KhuVuc,
    arrays_option,Excel,$timeout,DTOptionsBuilder,
     DTColumnBuilder, DTColumnDefBuilder,phucapkhoantru,confirmUser,$window,changepasswordQuanly,bhxh,daotao) {
   
    let selected_storename="";
    let selected_khuvuc="";
    let selected_nhanvien="";

    let userDn ;
     $scope.init = function(userLogin){           
          userDn = userLogin
         // console.log(userDn)
     };

    $scope.ShowDialog_changepassword = function () {
        var parentEl = angular.element(document.body);
        $mdDialog.show({
            parent: parentEl,
            // targetEvent: $event,
            // clickOutsideToClose: true,
            escapeToClose: true,
            //   scope: $scope,
            templateUrl: 'pages/admin/dialogConfirm-changepassword.html',
            locals: {
             
            },
            controller: DialogController
        }).then(function (obj) {
            if (obj === "cancel") {
            } 
              else
           { changepasswordQuanly.save({obj }, function (result) {
                   
                  if (result[0].control === 'noOk')
                  alert("có lỗi trong quá trình tương tác server hệ thống")    
                     else if( result[0].control=== 'api' )
                         {
                             alert("bạn phải đăng nhập lại hệ thống để tiếp tục")    
                          //    $location.path('/');
                          let landingUrl = "http://" + $window.location.host ;
                          $window.location.href = landingUrl;
                         }  
                             else 
                                 {
                                  $scope.showSimpleToast("thay đổi thành công");
                                 }
                             }, function () {
                                 alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web")
                                 return
                                }
                     );
             }
                
            }, function () {  alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web") });
        // funtion dialog
        function DialogController($scope, $mdDialog,) {
            $scope.closeDialog = function () {
                $mdDialog.hide("cancel");
            };
            $scope.changepassDialog_user = function (confirm) {
   
                let changePass = {
                    user: confirm.user,
                    passwordOld: confirm.passwordOld,
                    passwordNew:confirm.passwordNew
                }
                $mdDialog.hide(changePass);
         
            }
        };
        // funtion dialog
    }    // Dialog     
    
    arrays_option.save({ control:"data_maluong" }, function (result) {
        if(!result[0])    return    $scope.dsmaluong  =""
        if (result[0].control === 'noOk')
            alert("có lỗi trong quá trình tương tác server hệ thống")    
            else if( result[0].control=== 'api' )
                {
                    alert("bạn phải đăng nhập lại hệ thống để tiếp tục")    
                    // $location.path('/');
                    let landingUrl = "http://" + $window.location.host ;
                    $window.location.href = landingUrl;
                }  
            else 
                    {
                        $scope.dsmaluong= result
                    }
  
                }, function () {
                    alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web")
                    return
                   }
        );
        arrays_option.save({ control: "data_tram" }, function (result) {
            if(!result[0])    return      $scope.dstram =""
                if (result[0].control === 'noOk')
                 alert("có lỗi trong quá trình tương tác server hệ thống")    
                    else if( result[0].control=== 'api' )
                        {
                            alert("bạn phải đăng nhập lại hệ thống để tiếp tục")    
                            // $location.path('/');
                            let landingUrl = "http://" + $window.location.host ;
                            $window.location.href = landingUrl;
                        }  
                            else 
                                {
                                  $scope.dstram = result;
                                //   console.log( $scope.dstram )
                                }
                            }, function () {
                                alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web")
                                return
                               }
                    );
    arrays_option.save({ control: "data_madaotao" }, function (result) {
        if(!result[0])    return      $scope.Arraymadaotao =""
            if (result[0].control === 'noOk')
                alert("có lỗi trong quá trình tương tác server hệ thống")    
                else if( result[0].control=== 'api' )
                    {
                        alert("bạn phải đăng nhập lại hệ thống để tiếp tục")    
                        // $location.path('/');
                        let landingUrl = "http://" + $window.location.host ;
                        $window.location.href = landingUrl;
                    }  
                        else 
                            {
                                $scope.Arraymadaotao = result;
                            //   console.log( $scope.dstram )
                            }
                        }, function () {
                            alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web")
                            return
                            }
                );
    arrays_option.save({ control: "data_mabaohiem" }, function (result) {
        if(!result[0])    return      $scope.Arraymabaohiem =""
            if (result[0].control === 'noOk')
                alert("có lỗi trong quá trình tương tác server hệ thống")    
                else if( result[0].control=== 'api' )
                    {
                        alert("bạn phải đăng nhập lại hệ thống để tiếp tục")    
                        // $location.path('/');
                        let landingUrl = "http://" + $window.location.host ;
                        $window.location.href = landingUrl;
                    }  
                        else 
                            {
                                $scope.Arraymabaohiem = result;
                            //   console.log( $scope.dstram )
                            }
                        }, function () {
                            alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web")
                            return
                            }
                );
                arrays_option.save({control:"data_phongban" }, function (result) {
                    if(!result[0])    return  $scope.dsbophan  =""
                    if (result[0].control === 'noOk')
                        alert("có lỗi trong quá trình tương tác server hệ thống")    
                        else if( result[0].control=== 'api' )
                            {
                                alert("bạn phải đăng nhập lại hệ thống để tiếp tục")    
                                // $location.path('/');
                                let landingUrl = "http://" + $window.location.host ;
                                $window.location.href = landingUrl;
                            }  
                        else 
                                {
                                    $scope.dsbophan = result;
                                }
                            }, function () {
                                alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web")
                                return
                               }
                    );    
  
 
    $scope.reloadData = function() {
        $scope.dtOptions.reloadData();
    };


    KhuVuc.query({ }, function (result) {
 
    if(!result[0])    return    $scope.dsKhuVuc   =""
    if (result[0].control === 'noOk')
        alert("có lỗi trong quá trình tương tác server hệ thống")    
        else if( result[0].control=== 'api' )
            {
                alert("bạn phải đăng nhập lại hệ thống để tiếp tục")    
                // $location.path('/');
                let landingUrl = "http://" + $window.location.host ;
                $window.location.href = landingUrl;
            }  
        else 
                {
                    $scope.dsKhuVuc = result;
                }  
    
            }, function () {
                alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web")
                return
               }
    );
    $scope.load_mavung = function(){
        arrays_option.save({ control: "data_mavung" }, function (result) {
            if(!result[0])    return    $scope.dsVung =""
            if (result[0].control === 'noOk')
                alert("có lỗi trong quá trình tương tác server hệ thống")    
                else if( result[0].control=== 'api' )
                    {
                        alert("bạn phải đăng nhập lại hệ thống để tiếp tục")    
                        // $location.path('/');
                        let landingUrl = "http://" + $window.location.host ;
                        $window.location.href = landingUrl;
                    }  
                else 
                        {
                            $scope.dsVung = result
                        }
                    }, function () {
                        alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web")
                        return
                       }
            );
        }

        $scope.load_mavung();




$scope.selectKhuVuc=function(objSelected_KhuVuc){
    if(objSelected_KhuVuc!==undefined){
        selected_khuvuc=objSelected_KhuVuc.makhuvuc      
            cuaHang.query({ makhuvuc: selected_khuvuc}, function (result) {
                if(!result[0])    return     $scope.dsCuahang  =""
                if (result[0].control === 'noOk')
                    alert("có lỗi trong quá trình tương tác server hệ thống")    
                    else if( result[0].control=== 'api' )
                        {
                            alert("bạn phải đăng nhập lại hệ thống để tiếp tục")    
                            // $location.path('/');
                            let landingUrl = "http://" + $window.location.host ;
                            $window.location.href = landingUrl;
                        }  
                    else 
                            {
                                $scope.dsCuahang = result;
                                $scope.reloadData
                                $scope.persons = "";
                            }  
                        }, function () {
                            alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web")
                            return
                           }
                  );
                }
}

$scope.selectKhuVuc_All=function(objSelected_KhuVuc){
if(objSelected_KhuVuc!==undefined){
            cuaHang.query({ makhuvuc: objSelected_KhuVuc.makhuvuc}, function (result) {
              
                if(!result[0])    return     $scope.dsCuahang  =""
                if (result[0].control === 'noOk')
                    alert("có lỗi trong quá trình tương tác server hệ thống")    
                    else if( result[0].control=== 'api' )
                        {
                            alert("bạn phải đăng nhập lại hệ thống để tiếp tục")    
                            // $location.path('/');
                            let landingUrl = "http://" + $window.location.host ;
                            $window.location.href = landingUrl;
                        }  
                    else 
                            {
                                var all={
                                    storename:"All",
                                 }
                                 result.push(all);
                                 $scope.dsCuahang = result;
                                 $scope.persons = "";
                            }  
                        }, function () {
                            alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web")
                            return
                           }
                );
        }
}
 // chọn cửa hàng và load toàn bộ danh sách nhân viên   
    // $scope.objSelected='Danh Sách Cửa Hàng';
    $scope.logout=function(){
        // $location.path('/');
        let landingUrl = "http://" + $window.location.host ;
        $window.location.href = landingUrl;
    }
    $scope.selectCuahang=function(objSelected_cuaHang,obj){
        // console.log(objSelected_cuaHang);
        if(objSelected_cuaHang!==undefined || objSelected_cuaHang === null  ){
                    selected_storename=objSelected_cuaHang.storename;
                    if(! objSelected_cuaHang)  return
                    // console.log(objSelected_cuaHang.storename);
                    UsersCuaHang.query({ storenameId:objSelected_cuaHang.storename }, function (result) {
                        // load lại danh sách nhân vien cho từng cửa hàng khi delete ok
                        $scope.persons = "";
                        $scope.chamCongNv="";
                        if(!result[0])    return    $scope.persons   =""
                        if (result[0].control === 'noOk')
                            alert("có lỗi trong quá trình tương tác server hệ thống")    
                            else if( result[0].control=== 'api' )
                                {
                                    alert("bạn phải đăng nhập lại hệ thống để tiếp tục")    
                                    // $location.path('/');
                                    let landingUrl = "http://" + $window.location.host ;
                                    $window.location.href = landingUrl;
                                }  
                            else 
                                    {
                                        var all={
                                            tennhanvien:"All",
                                            manhanvien:"All",
                                            storename:objSelected_cuaHang.storename
                                        }
                                            if(obj.control==="khoantru")
                                                $scope.persons = result;
                                                else
                                                    {
                                                        result.push(all);
                                                        $scope.persons = result
                                                    }
                                    }  
                                }, function () {
                                    alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web")
                                    return
                                   }
                        );
        }
    }
    $scope.selectNhanvien=function(objSelected_nhanvien){
        selected_nhanvien=objSelected_nhanvien;
    }
//  trang có 2 html datatables ( danh sach nhan vien, danh sách chấm công nhan vien)
    let dataTables_Template=[ 'pages/nhansu/datatables-persons.html',
    'pages/nhansu/datatables-loadCongPersons.html',
    'pages/nhansu/datatables-loadCongAllPerson.html',
    'pages/nhansu/datatables-dsCuahang.html',
    'pages/nhansu/datatables-bhxh.html',
    'pages/nhansu/datatables-datao.html',
    'pages/nhansu/datatables-loadCongVung.html'];

    $scope.template=dataTables_Template[0];
    let current= new Date()
    // console.log(current)
    $scope.date={
        startDate:current,
        endDate:current
    }
    
    $scope.load_dataTables_AllchamCongvung=function(){
        $scope.template=dataTables_Template[6];
        $scope.chamCongNv="";
        $scope.dsCuahang = "";
        $scope.persons = "";
      
    };

    $scope.load_dataTables_khoantru=function(){
        $scope.template=dataTables_Template[5];
        $scope.persons = "";
        $scope.chamCongNv="";
        $scope.dsCuahang = "";
     
    };
    $scope.load_dataTables_bhxh=function(){
        $scope.template=dataTables_Template[4];
        $scope.persons = "";
        $scope.chamCongNv="";
        $scope.dsCuahang = "";
      
     
    };

     $scope.load_dataTables_Cuahang=function(){
        $scope.dsCuahang = "";
        $scope.template=dataTables_Template[3];
     };
     
    $scope.load_dataTables_AllchamCong=function(){
        $scope.template=dataTables_Template[2];
        $scope.chamCongNv="";
        $scope.dsCuahang = "";
        $scope.persons = "";
      
    };
    $scope.load_dataTables_chamCong=function(){
        $scope.template=dataTables_Template[1];
        $scope.chamCongNv="";
        $scope.dsCuahang = "";
        $scope.persons = "";
        $scope.ch=""
      
    };
    $scope.load_dataTables_Persons=function(){
        $scope.template=dataTables_Template[0];
        $scope.persons = "";
        $scope.chamCongNv="";
        $scope.dsCuahang = "";
        arrays_option.save({control:"data_phongban" }, function (result) {
            if(!result[0])    return  $scope.dsbophan  =""
            if (result[0].control === 'noOk')
                alert("có lỗi trong quá trình tương tác server hệ thống")    
                else if( result[0].control=== 'api' )
                    {
                        alert("bạn phải đăng nhập lại hệ thống để tiếp tục")    
                        // $location.path('/');
                        let landingUrl = "http://" + $window.location.host ;
                        $window.location.href = landingUrl;
                    }  
                else 
                        {
                            $scope.dsbophan = result;
                        }
                    }, function () {
                        alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web")
                        return
                       }
            );    
     
    };
    
 // datatables
    $scope.dtOptions_tables = DTOptionsBuilder.newOptions()
        .withPaginationType('full_numbers')
        .withButtons([
            {
                extend: 'colvis',
            },
         
            // 'copy',
            {
                extend: 'copy',
                text: ' Copy',
                title: 'Danh Sach Nhan Viên',
                exportOptions: {
                    columns: ':visible'
                }
            },
            // 'print',
            {
                extend: 'print',
                text: 'Print',
                title: 'Danh Sách Nhân Viên',
                exportOptions: {
                    columns: ':visible'
                }
            },
            // 'excel',
            {
                extend: 'excel',
                text: 'Excel',
                title: 'Danh Sách Nhân Viên',
                exportOptions: {
                    columns: ':visible'
                }
            }
        ])
        .withOption('ordering', false)
        .withOption('bFilter', false)
        .withOption('lengthMenu', [[5, 10, 15, 20, 25, -1], [5, 10, 15, 20, 25, "All"]]);

        $scope.showDialogReport = function($index) {
   let date= new Date($scope.chamCongNv[$index].ngaycapnhat);
    date =moment(date).format('YYYY-MM-DD HH:mm:ss');  
   let someHTML = 
        `<div> <strong> Ngày cập nhật:</strong>  ${date} </div>
        <div> <strong> Người cập nhật:</strong>   ${$scope.chamCongNv[$index].nguoicapnhat} </div>
        <div> <strong> Lý do: </strong>  ${$scope.chamCongNv[$index].ghichu} </div> `;
    var confirm = $mdDialog.confirm()
        .title('Nguyên nhân chỉnh sửa :')
        .htmlContent(someHTML)
        .ariaLabel('Lucky day')
        //   .targetEvent(ev)
         .ok("cancel");
    $mdDialog.show(confirm).then(function() {
  
    });
  };

$scope.showDialogDelete = function ($index) {
    let dsbophan=$scope.dsbophan
       var parentEl = angular.element(document.body);
       $mdDialog.show({
           parent: parentEl,
           // targetEvent: $event,
        //    clickOutsideToClose: true,
           escapeToClose: true,
           //   scope: $scope,
           templateUrl: 'pages/nhansu/dialogNhanvienDelete.html',
           locals: {
            dsbophan
           },
           controller: DialogController
       }).then(function (obj) {
           if (obj === "cancel") {
               alert(" Bạn đã nhập không đúng username và password nên không thể thực hiện việc xoá nhân viên")
           } else if (obj === "ok") {
            UserCuaHang.delete({ manhanvienId: $scope.persons[$index].manhanvien }, function (result) {
                            // load danh sách  nhân vien cho từng cửa hàng
                            if (result[0].control === 'noOk')
                             alert("có lỗi trong quá trình tương tác server hệ thống")    
                                else if( result[0].control=== 'api' )
                                    {
                                        alert("bạn phải đăng nhập lại hệ thống để tiếp tục")    
                                        // $location.path('/');
                                        let landingUrl = "http://" + $window.location.host ;
                                        $window.location.href = landingUrl;
                                    }  
                                        else 
                                            {
                                          $scope.showSimpleToast("xoá thành công");
                                          $scope.load_nhanvien()
                                            }
                                        }, function () {
                                            alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web")
                                            return
                                           }
                                );
           }
       }, function () {  alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web ") }); // dialog.show return  promise
       // funtion dialog
       function DialogController($scope, $mdDialog,dsbophan) {
        $scope.dsbophan=dsbophan
        
           $scope.closeDialog = function () {
               $mdDialog.hide("thoat");
           };
           $scope.DeleteDialog_nhanvien = function (confirm,objSelected_phongban) {
               let quanly = {
                   user: confirm.user,
                   password: confirm.password,
                   bophan: objSelected_phongban.phongban
               }
               confirmUser.save({ quanly }, function (result) {
                   // load danh sách  nhân vien cho từng cửa hàng
                   if (result[0].control === 'Ok') {
                       $mdDialog.hide("ok");
                   }
                   else {
                       $mdDialog.hide("cancel");
                   }
                       }, function () {
                               alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web")
                               $mdDialog.hide("");
                           }
               );
             
           };
       }
       // funtion dialog
   } 


  $scope.showDialogEdit = function ($index) {
    let  dsmaluong =   $scope.dsmaluong
    let Arraymadaotao= $scope.Arraymadaotao
    let Arraymabaohiem= $scope.Arraymabaohiem
    var updateNhanvien= $scope.persons[$index];
      var parentEl = angular.element(document.body);
    $mdDialog.show({
        parent: parentEl,
        // targetEvent: $event,
        // clickOutsideToClose: true,
        escapeToClose: true,
        //   scope: $scope,
        templateUrl:'pages/nhansu/dialogNhanvienEdit.html',
        locals: {
        $index,
        updateNhanvien,
        dsmaluong,
        Arraymadaotao,
        Arraymabaohiem
        },
        controller: DialogController
    }).then(function (obj) {
      
        if (obj === "cancel") {
            } else
                {
                    obj.nhanvien.ngaylamviec=obj.ngaylamviec;
                    obj.nhanvien.ngaycap=obj.ngaycap;
                    obj.nhanvien.ngaysinhchuho=obj.ngaysinhchuho;
                    UserCuaHang.update({ manhanvienId: $scope.persons[$index].manhanvien,obj }, function (result) {
                        // load danh sách  nhân vien cho từng cửa hàng
                        if(!result[0])    return        $scope.persons =""
                        if (result[0].control === 'noOk')
                         alert("có lỗi trong quá trình tương tác server hệ thống")    
                            else if( result[0].control=== 'api' )
                                {
                                    alert("bạn phải đăng nhập lại hệ thống để tiếp tục")    
                                    // $location.path('/');
                                    let landingUrl = "http://" + $window.location.host ;
                                    $window.location.href = landingUrl;
                                }  
                                    else 
                                        {
                                            $scope.showSimpleToast("cập nhật thành công");
                                            $scope.load_nhanvien()
                                        }
                                    }, function () {
                                        alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web")
                                        return
                                       }
                            );
                }
            }, function () {  alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web") });
 // funtion dialog
    function DialogController($scope, $mdDialog, updateNhanvien, dsmaluong,Arraymadaotao,Arraymabaohiem) {
        $scope.Arraymaluong = dsmaluong
        $scope.Arraymabaohiem = Arraymabaohiem
        $scope.Arraymadaotao = Arraymadaotao
       let formatDate_ngaylamviec = new Date(updateNhanvien.ngaylamviec);
       let formatDate_ngaycap = new Date(updateNhanvien.ngaycap);
       let formatDate_ngaysinhchuho = new Date(updateNhanvien.ngaysinhchuho);
       
   
    //   console.log(formatDate);
      $scope.nhanvien={
            cuahang:updateNhanvien.storename,
            ten:updateNhanvien.tennhanvien,
            gioitinh:updateNhanvien.gioitinh,
            diachitamtru:updateNhanvien.diachitamtru,
            diachithuongtru:updateNhanvien.diachithuongtru,
            dienthoai:updateNhanvien.dienthoai,
            email:updateNhanvien.email,
            taikhoan:updateNhanvien.taikhoan,
            ngaylamviec:formatDate_ngaylamviec,
            maluong:updateNhanvien.maluong,
            mabaohiem:updateNhanvien.mabaohiem,
            madaotao:updateNhanvien.madaotao,
            calamviec:updateNhanvien.calamviec,
            cmnd:updateNhanvien.cmnd,
            ngaycap:formatDate_ngaycap,
            noicap:updateNhanvien.noicap,
            vitri:updateNhanvien.vitri,
            tenchuho:updateNhanvien.chuho,
            ngaysinhchuho:formatDate_ngaysinhchuho,
            gioitinhchuho:updateNhanvien.gioitinhchuho,
        };
        $scope.closeDialog = function () {
            $mdDialog.hide("cancel");           
             };
        $scope.updateDialog = function (nhanvien) {
            let   ngaylamviec = moment(nhanvien.ngaylamviec).format('YYYY-MM-DD');
            let   ngaycap = moment(nhanvien.ngaycap).format('YYYY-MM-DD');
            let   ngaysinhchuho = moment(nhanvien.ngaysinhchuho).format('YYYY-MM-DD');
           
           $mdDialog.hide({nhanvien,ngaylamviec,ngaycap,ngaysinhchuho});
        };
    }
       // funtion dialog
}    // Dialog 

    $scope.showDialogAdd = function () {
         let dsmaluong =   $scope.dsmaluong
         let Arraymadaotao= $scope.Arraymadaotao
         let Arraymabaohiem= $scope.Arraymabaohiem
        var parentEl = angular.element(document.body);
        $mdDialog.show({
            parent: parentEl,
            // targetEvent: $event,
            // clickOutsideToClose: true,
            escapeToClose: true,
            //   scope: $scope,
            templateUrl:'pages/nhansu/dialogNhanvienAdd.html',
            locals: {
                dsmaluong,
                Arraymadaotao,
                Arraymabaohiem
            },
            controller: DialogController
        }).then(function (obj) {
            if (obj === "cancel") {
                } else
                    {
                        obj.nhanvien.ngaylamviec=obj.format_current_Date_ngaylamviec
                        obj.nhanvien.ngaycap=obj.format_current_Date_ngaycap
                    if(!obj.nhanvien.tenchuho) obj.nhanvien.tenchuho=null
                    if(!obj.nhanvien.gioitinhchuho) obj.nhanvien.gioitinhchuho=null
                    if(obj.nhanvien.ngaysinhchuho)
                      { let format_current_Date_ngaysinhchuho = moment(obj.nhanvien.ngaysinhchuho).format('YYYY-MM-DD');
                       obj.nhanvien.ngaysinhchuho=format_current_Date_ngaysinhchuho}
                        else
                         obj.nhanvien.ngaysinhchuho=null
                        console.log(obj);
                        UsersCuaHang.save({ storenameId: selected_storename, obj}, function (result) {
                            if(!result[0])    return        $scope.persons =""
                            if (result[0].control === 'noOk')
                             alert("có lỗi trong quá trình tương tác server hệ thống")    
                                else if( result[0].control=== 'api' )
                                    {
                                        alert("bạn phải đăng nhập lại hệ thống để tiếp tục")    
                                        // $location.path('/');
                                        let landingUrl = "http://" + $window.location.host ;
                                        $window.location.href = landingUrl;
                                    }  
                                        else 
                                            {
                                          $scope.showSimpleToast("thêm thành công");
                                          $scope.load_nhanvien()
                                            }
                                        }, function () {
                                            alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web")
                                            return
                                           }
                                );
                    }
                }, function () {  alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web") });
     // funtion dialog
        function DialogController($scope, $mdDialog, dsmaluong,Arraymadaotao,Arraymabaohiem) {
            $scope.Arraymadaotao = Arraymadaotao
            $scope.Arraymabaohiem = Arraymabaohiem
            $scope.Arraymaluong = dsmaluong
            // $scope.calamvien=
            $scope.closeDialog = function () {
                $mdDialog.hide("cancel");           
                 };
            $scope.addDialog = function (nhanvien) {
                let   format_current_Date_ngaylamviec = moment($scope.nhanvien.ngaylamviec).format('YYYY-MM-DD');
                let   format_current_Date_ngaycap = moment($scope.nhanvien.ngaycap).format('YYYY-MM-DD');
                $mdDialog.hide({nhanvien,format_current_Date_ngaylamviec,format_current_Date_ngaycap});
            };
        }
           // funtion dialog
    }    // Dialog 
    // Dialog 
    $scope.load_nhanvien = function () {
       
        UsersCuaHang.query({ storenameId:selected_storename }, function (result) {
                if(!result[0])    return        $scope.persons =""
                if (result[0].control === 'noOk')
                 alert("có lỗi trong quá trình tương tác server hệ thống")    
                    else if( result[0].control=== 'api' )
                        {
                            alert("bạn phải đăng nhập lại hệ thống để tiếp tục")    
                            // $location.path('/');
                            let landingUrl = "http://" + $window.location.host ;
                            $window.location.href = landingUrl;
                        }  
                            else 
                                {
                                    var all={
                                        tennhanvien:"All",
                                        manhanvien:"All",
                                    }
                                    result.push(all);
                              $scope.persons = result;
                              $scope.reloadData
                                }
                            }, function () {
                                alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web")
                                return
                               }
                    );
    };

    

    $scope.showDialogAdd_chamCong = function () {
            let dsCuahang_addCong=$scope.dsCuahang;
            let addCong_objSelected ={
                tennhanvien:selected_nhanvien.tennhanvien ,
                manhanvien:selected_nhanvien.manhanvien ,
                storename:selected_nhanvien.storename
                // ten:$scope.objSelected
            }
        var parentEl = angular.element(document.body);
        $mdDialog.show({
            parent: parentEl,
            // targetEvent: $event,
            // clickOutsideToClose: true,
            escapeToClose: true,
            //   scope: $scope,
            templateUrl:'pages/nhansu/dialogChamcongAdd.html',
            locals: {
            addCong_objSelected,
            dsCuahang_addCong
            },
            controller: DialogController
        }).then(function (obj) {
            if (obj === "cancel") {
                } else
                    {
                        let nguoicapnhat=userDn
                        obj.nhanvien.Addcongtimein=obj.timein;
                        obj.nhanvien.Addcongtimeout=obj.timeout;
                        obj.nhanvien.AddDate=obj.date;
                        // console.log(obj.nhanvien);
                        chamcong.save({obj,nguoicapnhat}, function (result) {
                            // load danh sách  nhân vien cho từng cửa hàng
                            if (result[0].control === 'noOk')
                            alert("có lỗi trong quá trình tương tác server hệ thống")    
                               else if( result[0].control=== 'api' )
                                   {
                                       alert("bạn phải đăng nhập lại hệ thống để tiếp tục")    
                                    //    $location.path('/');
                                    let landingUrl = "http://" + $window.location.host ;
                                    $window.location.href = landingUrl;
                                   }  
                                       else 
                                           {
                                            
                                            $scope.showSimpleToast("thêm thành công");
                                           }
                                       }, function () {
                                           alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web")
                                           return
                                          }
                               );
                    }
                }, function () {  alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web") });
     // funtion dialog
        function DialogController($scope, $mdDialog, addCong_objSelected,dsCuahang_addCong) {
        //   console.log(addCong_objSelected)
          let timein= new Date(0,0,0,"04","30","00") ;
          let timeout= new Date(0,0,0,"09","30","00") ;
          let datetime =new Date();
          $scope.dsCuahang_addCong=dsCuahang_addCong
          $scope.nhanvien={
                manhanvien:addCong_objSelected.manhanvien,
                storename:addCong_objSelected.storename,
                tennhanvien:addCong_objSelected.tennhanvien,
                Addcongtimein:timein,
                Addcongtimeout:timeout,
                AddDate:datetime
              
            };
            $scope.closeDialog = function () {
                $mdDialog.hide("cancel");           
                 };
            $scope.addCongDialog = function (nhanvien) {
                let   timein = moment(nhanvien.Addcongtimein).format("HH:mm:ss");
                let   timeout = moment(nhanvien.Addcongtimeout).format("HH:mm:ss");
                let   date = moment(nhanvien.AddDate).format('YYYY-MM-DD');
                $mdDialog.hide({nhanvien,timein,timeout,date});
            };
        }
           // funtion dialog
    }    // Dialog 
    // Dialog 
    $scope.showDialogEditCong = function ($index) {
        var updateNhanvien= $scope.chamCongNv[$index];
        var parentEl = angular.element(document.body);
        let nguoicapnhat=userDn
      $mdDialog.show({
          parent: parentEl,
          // targetEvent: $event,
        //   clickOutsideToClose: true,
          escapeToClose: true,
          //   scope: $scope,
          templateUrl:'pages/nhansu/dialogEditCong.html',
          locals: {
          $index,
          updateNhanvien,nguoicapnhat
          },
          controller: DialogController
      }).then(function (obj) {
    
          if (obj === "cancel") {
              } else
                  {
                      chamcong.update({ obj }, function (result) {
                          // load danh sách  nhân vien cho từng cửa hàng
                        //   console.log(result);
                        if (result[0].control === 'noOk')
                        alert("có lỗi trong quá trình tương tác server hệ thống")    
                           else if( result[0].control=== 'api' )
                               {
                                   alert("bạn phải đăng nhập lại hệ thống để tiếp tục")    
                                //    $location.path('/');
                                let landingUrl = "http://" + $window.location.host ;
                                $window.location.href = landingUrl;
                               }  
                                   else 
                                       {
                                        $scope.showSimpleToast("cập nhật thành công");
                                        $scope.chamCongNv[$index].timein=obj.format_current_timein
                                        $scope.chamCongNv[$index].timeout=obj.format_current_timeout
                                      
                                       }
                                   }, function () {
                                       alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web")
                                       return
                                      }
                           );
                  }
                }, function () {  alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web") });
   // funtion dialog
      function DialogController($scope, $mdDialog, updateNhanvien, UsersCuaHang,nguoicapnhat) {
            var part_timein =updateNhanvien.timein.split(":");
            var part_timeout =updateNhanvien.timeout.split(":");
            
         $scope.cong={
            timein: new Date(0,0,0,part_timein[0],part_timein[1],part_timein[2]) ,
            timeout:new Date(0,0,0,part_timeout[0],part_timeout[1],part_timeout[2])
          };
        
          $scope.closeDialog = function () {
              $mdDialog.hide("cancel");           
               };
          $scope.updateDialogCong = function (cong) {
            let   format_current_timein = moment(cong.timein).format("HH:mm:ss");
            let   format_current_timeout = moment(cong.timeout).format("HH:mm:ss");
            if(format_current_timein>format_current_timeout)
          {
                alert("Thời gian vào không được lớn hơn thời gian ra")
          }
          else{
            updateNhanvien.ghichu=cong.lydo
            updateNhanvien.nguoicapnhat=nguoicapnhat
            $mdDialog.hide({updateNhanvien,format_current_timein,format_current_timeout});
          }
           
          };
      }
    }

    $scope.showDialog_EditCuahang = function ($index) {
        var updateCuahang= $scope.dsCuahang[$index];
        let dsKhuVuc=$scope.dsKhuVuc;
        let dstram= $scope.dstram
        var parentEl = angular.element(document.body);
      $mdDialog.show({
          parent: parentEl,
          // targetEvent: $event,
        //   clickOutsideToClose: true,
          escapeToClose: true,
          //   scope: $scope,
          templateUrl:'pages/nhansu/dialogCuahangEdit.html',
          locals: {
          $index,
          updateCuahang,
          dsKhuVuc,
          dstram
          },
          controller: DialogController
      }).then(function (obj) {
          if (obj === "cancel") {
              } else
                  {
                      CuahangInfo.update({obj }, function (result) {
                         
                        if (result[0].control === 'noOk')
                        alert("có lỗi trong quá trình tương tác server hệ thống")    
                           else if( result[0].control=== 'api' )
                               {
                                   alert("bạn phải đăng nhập lại hệ thống để tiếp tục")    
                                //    $location.path('/');
                                let landingUrl = "http://" + $window.location.host ;
                                $window.location.href = landingUrl;
                               }  
                                   else 
                                       {
                                        cuaHang.query({ makhuvuc: selected_khuvuc}, function (result) {
                                            if(!result[0])    return     $scope.dsCuahang  =""
                                            if (result[0].control === 'noOk')
                                                alert("có lỗi trong quá trình tương tác server hệ thống")    
                                                else if( result[0].control=== 'api' )
                                                    {
                                                        alert("bạn phải đăng nhập lại hệ thống để tiếp tục")    
                                                        // $location.path('/');
                                                        let landingUrl = "http://" + $window.location.host ;
                                                        $window.location.href = landingUrl;
                                                    }  
                                                else 
                                                        {
                                                            $scope.dsCuahang = result;
                                                            $scope.reloadData
                                                            $scope.persons = "";
                                                        }  
                                                    }, function () {
                                                        alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web")
                                                        return
                                                       }
                                              );
                                        $scope.showSimpleToast("cập nhật thành công");
                                       }
                                   }, function () {
                                       alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web")
                                       return
                                      }
                           );
                      
                  }
                }, function () {  alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web") });
   // funtion dialog
      function DialogController($scope, $mdDialog, updateCuahang,dsKhuVuc,dstram) {
        //   console.log(dsKhuVuc);
          $scope.dsKhuVuc=dsKhuVuc;
          $scope.dstram=dstram;
        $scope.cuahang={
            diachi:updateCuahang.diachi,
            makhuvuc:updateCuahang.makhuvuc,
            storename:updateCuahang.storename,
            tentram:updateCuahang.tentram,
            dienthoai:Number(updateCuahang.dienthoai),
            quyenquanly:updateCuahang.quyenquanly,
        };
          $scope.closeDialog = function () {
              $mdDialog.hide("cancel");           
               };
          $scope.updateDialog_EditCuahang = function (cuahang) {
              $mdDialog.hide({cuahang});
          };
      }
         // funtion dialog
  }    // Dialog 
    // toast
    $scope.showSimpleToast = function(string) {
        $mdToast.show(
          $mdToast.simple()
            .textContent(string)
            .position('bottom right' )
            .hideDelay(3000)
        );
      };
    // toast
   $scope.loadCong=function(date,objSelected_nhanvien){
    let   format_current_startDate = moment(date.startDate).format('YYYY-MM-DD');  
    let   format_current_endDate = moment(date.endDate).format('YYYY-MM-DD');  
    UserCuaHang.save({ manhanvienId: objSelected_nhanvien.manhanvien,objSelected_nhanvien,format_current_startDate,format_current_endDate },
        function (result) {
            // load danh sách chấm cong nhân vien cho từng cửa hàng
        //     var json = angular.toJson(result);
        //    var toan = angular.fromJson(json);
        if(!result[0])    return        $scope.chamCongNv =""
        if (result[0].control === 'noOk')
        alert("có lỗi trong quá trình tương tác server hệ thống")    
           else if( result[0].control=== 'api' )
               {
                   alert("bạn phải đăng nhập lại hệ thống để tiếp tục")    
                //    $location.path('/');
                let landingUrl = "http://" + $window.location.host ;
                $window.location.href = landingUrl;
               }  
                   else 
                       {
                        $scope.chamCongNv=result;
                       }
                   }, function () {
                       alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web")
                       return
                      }
           );
      
   }

    $scope.loadCong_nhanVien = function (date,objSelected_nhanvien) {
     if(objSelected_nhanvien==null || date==null ||date.startDate==null || date.endDate==null  ) 
      alert("Bạn chưa nhập đầy đủ thông tin để tìm kiếm")
    else{
     
        if(date.endDate >= date.startDate)
            {
                      $scope.loadCong(date,objSelected_nhanvien)
            }
        else{
           alert("Bạn Chọn Khung Thời Gian Không Chính Xác")
        }
    }
}

  $scope.loadCong_AllnhanVien = function (date,objSelected_cuaHang,objSelected_KhuVuc) {
    //   console.log(objSelected_cuaHang);
    if(objSelected_cuaHang==null || date==null  || date.endDate==null  ) 
        {
            alert("Bạn chưa nhập đầy đủ thông tin để tìm kiếm")   
        }
  
        else{
           
                if (objSelected_cuaHang.storename !== "All")
                
                        {  
                                let objSelected ={
                                    manhanvien: "All_congCuahang",
                                    storename:objSelected_cuaHang.storename
                                }    
                                // $scope.showcolumn=false;
                                $scope.loadCong(date,objSelected)
                         
                        }
                        else{
                            let objSelected ={
                                    manhanvien: "All_congKhuvuc",
                                    storename:"All_congKhuvuc",
                                    makhuvuc:objSelected_KhuVuc.makhuvuc
                                }   
                             
                                $scope.loadCong(date,objSelected) 
                             
                            }
            }
    
     }
     
     $scope.loadCong_Allvung = function (date,objSelected_Vung) {
        //   console.log(objSelected_cuaHang);
        if(objSelected_Vung==null || date==null  || date.endDate==null  ) 
            {
                alert("Bạn chưa nhập đầy đủ thông tin để tìm kiếm")   
            }
      
            else{
    
                    let objSelected ={
                        manhanvien: "All_cong_vung_cuahang",
                        mavung:objSelected_Vung.mavung
                    }    
                    // $scope.showcolumn=false;
                    $scope.loadCong(date,objSelected)
                }
        
         }

    
    $scope.showDialogAdd_pc_kt = function ($index) {
        let updatecongNv= $scope.chamCongNv[$index];
        let thangpc=$scope.date.endDate
        var parentEl = angular.element(document.body);
      $mdDialog.show({
          parent: parentEl,
          // targetEvent: $event,
        //   clickOutsideToClose: true,
          escapeToClose: true,
          //   scope: $scope,
          templateUrl:'pages/nhansu/dialogPhucapKhoantru.html',
          locals: {
            updatecongNv,
            thangpc
          },
          controller: DialogController
      }).then(function (obj) {
          if (obj === "cancel") {
              } else
                  {
                     console.log(obj)
                     phucapkhoantru.save({ obj}, function (result) {
                        
                            if (result[0].control === 'noOk')
                                alert("có lỗi trong quá trình tương tác server hệ thống")    
                                else if( result[0].control=== 'api' )
                                    {
                                        alert("bạn phải đăng nhập lại hệ thống để tiếp tục")    
                                        // $location.path('/');
                                        let landingUrl = "http://" + $window.location.host ;
                                        $window.location.href = landingUrl;
                                    }  
                                else 
                                        {
                                            $scope.showSimpleToast("Thêm thành công");
                                        }
                      
                                    }, function () {
                                        alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web")
                                        return
                                       }
                            );
                                  
                      
                  }
                }, function () {  alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web") });
   // funtion dialog
      function DialogController($scope, $mdDialog,updatecongNv,thangpc) {
      $scope.phucap_khoantru=updatecongNv
     
        $scope.phucap_khoantru={
           pcdienthoai: Number(updatecongNv.pc_dienthoai),
           pctrachnhiem:Number(updatecongNv.pc_trachnhiem),
           pcchuyencan:Number(updatecongNv.chuyencan),
           pcthuong:Number(updatecongNv.thuong),
           phat:Number(updatecongNv.phat),
           trukhac:Number(updatecongNv.trukhac),
        //    bhnt:Number(updatecongNv.trubhnt),
           congdoan:Number(updatecongNv.congdoan),
           thang:thangpc,
           storename:updatecongNv.storename,
           manhanvien:Number(updatecongNv.manhanvien)
           
        };
          $scope.closeDialog = function () {
              $mdDialog.hide("cancel");           
               };
          $scope.addDialog_phucap_khoantru = function (phucap_khoantru) {
              $mdDialog.hide({phucap_khoantru});
          };
      }
    }

    $scope.showDialogEdit_bhxh = function ($index) {
        let updatebhxh= $scope.Arraymabaohiem[$index];
        let parentEl = angular.element(document.body);
      $mdDialog.show({
          parent: parentEl,
          // targetEvent: $event,
        //   clickOutsideToClose: true,
          escapeToClose: true,
          //   scope: $scope,
          templateUrl:'pages/nhansu/dialogEdit-bhxh.html',
          locals: {
          $index,
          updatebhxh
          },
          controller: DialogController
      }).then(function (obj) {
          if (obj === "cancel") {
              } else
                  {
                      bhxh.update({obj }, function (result) {
                         
                        if (result[0].control === 'noOk')
                        alert("có lỗi trong quá trình tương tác server hệ thống")    
                           else if( result[0].control=== 'api' )
                               {
                                   alert("bạn phải đăng nhập lại hệ thống để tiếp tục")    
                                //    $location.path('/');
                                let landingUrl = "http://" + $window.location.host ;
                                $window.location.href = landingUrl;
                               }  
                                   else 
                                       {
                                        arrays_option.save({ control: "data_mabaohiem" }, function (result) {
                                            if(!result[0])    return      $scope.Arraymabaohiem =""
                                                if (result[0].control === 'noOk')
                                                    alert("có lỗi trong quá trình tương tác server hệ thống")    
                                                    else if( result[0].control=== 'api' )
                                                        {
                                                            alert("bạn phải đăng nhập lại hệ thống để tiếp tục")    
                                                            // $location.path('/');
                                                            let landingUrl = "http://" + $window.location.host ;
                                                            $window.location.href = landingUrl;
                                                        }  
                                                            else 
                                                                {
                                                                    $scope.Arraymabaohiem = result;
                                                                    $scope.reloadData
                                                                }
                                                            }, function () {
                                                                alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web")
                                                                return
                                                                }
                                                    );
                                        $scope.showSimpleToast("cập nhật thành công");
                                       }
                                   }, function () {
                                       alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web")
                                       return
                                      }
                           );
                  }
                }, function () {  alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web") });
   // funtion dialog
      function DialogController($scope, $mdDialog, updatebhxh) {
        //   console.log(dsKhuVuc);
        $scope.bhxh={
            mabaohiem:updatebhxh.mabaohiem,
            luongbaohiem:Number (updatebhxh.luongbaohiem),
            trubaohiem:Number(updatebhxh.trubaohiem),
            ghichu:updatebhxh.ghichu,
           
        };
          $scope.closeDialog = function () {
              $mdDialog.hide("cancel");           
               };
          $scope.updateDialog_EditBhxh = function (bhxh) {
              $mdDialog.hide({bhxh});
          };
      }
    }
    $scope.showDialogDelete_bhxh = function ($index) {
        let updatebhxh= $scope.Arraymabaohiem[$index];
        let dsbophan=$scope.dsbophan
           var parentEl = angular.element(document.body);
           $mdDialog.show({
               parent: parentEl,
               // targetEvent: $event,
            //    clickOutsideToClose: true,
               escapeToClose: true,
               //   scope: $scope,
               templateUrl: 'pages/nhansu/dialogDelete-bhxh.html',
               locals: {
                dsbophan
               },
               controller: DialogController
           }).then(function (obj) {
               if (obj === "cancel") {
                   alert(" Bạn đã nhập không đúng username và password nên không thể thực hiện việc xoá nhân viên")
               } else if (obj === "ok") {
                bhxh.delete({ mabaohiem: $scope.Arraymabaohiem[$index].mabaohiem }, function (result) {
                                // load danh sách  nhân vien cho từng cửa hàng
                                if (result[0].control === 'noOk')
                                 alert("có lỗi trong quá trình tương tác server hệ thống")    
                                    else if( result[0].control=== 'api' )
                                        {
                                            alert("bạn phải đăng nhập lại hệ thống để tiếp tục")    
                                            // $location.path('/');
                                            let landingUrl = "http://" + $window.location.host ;
                                            $window.location.href = landingUrl;
                                        }  
                                            else 
                                                {
                                              $scope.showSimpleToast("xoá thành công");
                                              arrays_option.save({ control: "data_mabaohiem" }, function (result) {
                                                if(!result[0])    return      $scope.Arraymabaohiem =""
                                                    if (result[0].control === 'noOk')
                                                        alert("có lỗi trong quá trình tương tác server hệ thống")    
                                                        else if( result[0].control=== 'api' )
                                                            {
                                                                alert("bạn phải đăng nhập lại hệ thống để tiếp tục")    
                                                                // $location.path('/');
                                                                let landingUrl = "http://" + $window.location.host ;
                                                                $window.location.href = landingUrl;
                                                            }  
                                                                else 
                                                                    {
                                                                        $scope.Arraymabaohiem = result;
                                                                        $scope.reloadData
                                                                    }
                                                                }, function () {
                                                                    alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web")
                                                                    return
                                                                    }
                                                        );
                                                }
                                            }, function () {
                                                alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web")
                                                return
                                               }
                                    );
               }
           }, function () {  alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web ") }); // dialog.show return  promise
           // funtion dialog
           function DialogController($scope, $mdDialog,dsbophan) {
            $scope.dsbophan=dsbophan
            
               $scope.closeDialog = function () {
                   $mdDialog.hide("thoat");
               };
               $scope.DeleteDialog_nhanvien = function (confirm,objSelected_phongban) {
                   let quanly = {
                       user: confirm.user,
                       password: confirm.password,
                       bophan: objSelected_phongban.phongban
                   }
                   confirmUser.save({ quanly }, function (result) {
                       // load danh sách  nhân vien cho từng cửa hàng
                       if (result[0].control === 'Ok') {
                           $mdDialog.hide("ok");
                       }
                       else {
                           $mdDialog.hide("cancel");
                       }
                           }, function () {
                                   alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web")
                                   $mdDialog.hide("");
                               }
                   );
                 
               };
           }
           // funtion dialog
       } 
       $scope.showDialogAdd_bhxh = function ($index) {
        var parentEl = angular.element(document.body);
      $mdDialog.show({
          parent: parentEl,
          // targetEvent: $event,
        //   clickOutsideToClose: true,
          escapeToClose: true,
          //   scope: $scope,
          templateUrl:'pages/nhansu/dialogAdd-bhxh.html',
          locals: {
          },
          controller: DialogController
      }).then(function (obj) {
          if (obj === "cancel") {
              } else
                  {
                     console.log(obj)
                     bhxh.save({ obj}, function (result) {
                        
                            if (result[0].control === 'noOk')
                                alert("có lỗi trong quá trình tương tác server hệ thống")    
                                else if( result[0].control=== 'api' )
                                    {
                                        alert("bạn phải đăng nhập lại hệ thống để tiếp tục")    
                                        // $location.path('/');
                                        let landingUrl = "http://" + $window.location.host ;
                                        $window.location.href = landingUrl;
                                    }  
                                else 
                                        {
                                            $scope.showSimpleToast("Thêm thành công");
                                            arrays_option.save({ control: "data_mabaohiem" }, function (result) {
                                                if(!result[0])    return      $scope.Arraymabaohiem =""
                                                    if (result[0].control === 'noOk')
                                                        alert("có lỗi trong quá trình tương tác server hệ thống")    
                                                        else if( result[0].control=== 'api' )
                                                            {
                                                                alert("bạn phải đăng nhập lại hệ thống để tiếp tục")    
                                                                // $location.path('/');
                                                                let landingUrl = "http://" + $window.location.host ;
                                                                $window.location.href = landingUrl;
                                                            }  
                                                                else 
                                                                    {
                                                                        $scope.Arraymabaohiem = result;
                                                                        $scope.reloadData
                                                                    }
                                                                }, function () {
                                                                    alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web")
                                                                    return
                                                                    }
                                                        );
                                        }
                      
                                    }, function () {
                                        alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web")
                                        return
                                       }
                            );
                  }
                }, function () {  alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web") });
   // funtion dialog
      function DialogController($scope, $mdDialog,) {
     
          $scope.closeDialog = function () {
              $mdDialog.hide("cancel");           
               };
          $scope.addDialog_bhxh = function (bhxh) {
              $mdDialog.hide({bhxh});
          };
      }
    }
    $scope.showDialogAdd_daotao = function ($index) {
        var parentEl = angular.element(document.body);
      $mdDialog.show({
          parent: parentEl,
          // targetEvent: $event,
        //   clickOutsideToClose: true,
          escapeToClose: true,
          //   scope: $scope,
          templateUrl:'pages/nhansu/dialogAdd-daotao.html',
          locals: {
          },
          controller: DialogController
      }).then(function (obj) {
          if (obj === "cancel") {
              } else
                  {
                     daotao.save({ obj}, function (result) {
                        
                            if (result[0].control === 'noOk')
                                alert("có lỗi trong quá trình tương tác server hệ thống")    
                                else if( result[0].control=== 'api' )
                                    {
                                        alert("bạn phải đăng nhập lại hệ thống để tiếp tục")    
                                        // $location.path('/');
                                        let landingUrl = "http://" + $window.location.host ;
                                        $window.location.href = landingUrl;
                                    }  
                                else 
                                        {
                                            $scope.showSimpleToast("Thêm thành công");
                                            arrays_option.save({ control: "data_madaotao" }, function (result) {
                                                if(!result[0])    return      $scope.Arraymadaotao =""
                                                    if (result[0].control === 'noOk')
                                                        alert("có lỗi trong quá trình tương tác server hệ thống")    
                                                        else if( result[0].control=== 'api' )
                                                            {
                                                                alert("bạn phải đăng nhập lại hệ thống để tiếp tục")    
                                                                // $location.path('/');
                                                                let landingUrl = "http://" + $window.location.host ;
                                                                $window.location.href = landingUrl;
                                                            }  
                                                                else 
                                                                    {
                                                                        $scope.Arraymadaotao = result;
                                                                        $scope.reloadData
                                                                    }
                                                                }, function () {
                                                                    alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web")
                                                                    return
                                                                    }
                                                        );
                                        }
                      
                                    }, function () {
                                        alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web")
                                        return
                                       }
                            );
                  }
                }, function () {  alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web") });
   // funtion dialog
      function DialogController($scope, $mdDialog,) {
     
          $scope.closeDialog = function () {
              $mdDialog.hide("cancel");           
               };
          $scope.addDialog_daotao = function (daotao) {
              $mdDialog.hide({daotao});
          };
      }
    }

    $scope.showDialogDelete_daotao = function ($index) {
        let updatedaotao= $scope.Arraymadaotao[$index];
        let dsbophan=$scope.dsbophan
           var parentEl = angular.element(document.body);
           $mdDialog.show({
               parent: parentEl,
               // targetEvent: $event,
            //    clickOutsideToClose: true,
               escapeToClose: true,
               //   scope: $scope,
               templateUrl: 'pages/nhansu/dialogDelete-daotao.html',
               locals: {
                dsbophan
               },
               controller: DialogController
           }).then(function (obj) {
               if (obj === "cancel") {
                   alert(" Bạn đã nhập không đúng username và password nên không thể thực hiện việc xoá nhân viên")
               } else if (obj === "ok") {
                daotao.delete({ madaotao: $scope.Arraymadaotao[$index].madaotao }, function (result) {
                                // load danh sách  nhân vien cho từng cửa hàng
                                if (result[0].control === 'noOk')
                                 alert("có lỗi trong quá trình tương tác server hệ thống")    
                                    else if( result[0].control=== 'api' )
                                        {
                                            alert("bạn phải đăng nhập lại hệ thống để tiếp tục")    
                                            // $location.path('/');
                                            let landingUrl = "http://" + $window.location.host ;
                                            $window.location.href = landingUrl;
                                        }  
                                            else 
                                                {
                                              $scope.showSimpleToast("xoá thành công");
                                              arrays_option.save({ control: "data_madaotao" }, function (result) {
                                                if(!result[0])    return      $scope.Arraymadaotao =""
                                                    if (result[0].control === 'noOk')
                                                        alert("có lỗi trong quá trình tương tác server hệ thống")    
                                                        else if( result[0].control=== 'api' )
                                                            {
                                                                alert("bạn phải đăng nhập lại hệ thống để tiếp tục")    
                                                                // $location.path('/');
                                                                let landingUrl = "http://" + $window.location.host ;
                                                                $window.location.href = landingUrl;
                                                            }  
                                                                else 
                                                                    {
                                                                        $scope.Arraymadaotao = result;
                                                                        $scope.reloadData
                                                                    }
                                                                }, function () {
                                                                    alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web")
                                                                    return
                                                                    }
                                                        );
                                                }
                                            }, function () {
                                                alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web")
                                                return
                                               }
                                    );
               }
           }, function () {  alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web ") }); // dialog.show return  promise
           // funtion dialog
           function DialogController($scope, $mdDialog,dsbophan) {
            $scope.dsbophan=dsbophan
            
               $scope.closeDialog = function () {
                   $mdDialog.hide("thoat");
               };
               $scope.DeleteDialog_nhanvien = function (confirm,objSelected_phongban) {
                   let quanly = {
                       user: confirm.user,
                       password: confirm.password,
                       bophan: objSelected_phongban.phongban
                   }
                   confirmUser.save({ quanly }, function (result) {
                       // load danh sách  nhân vien cho từng cửa hàng
                       if (result[0].control === 'Ok') {
                           $mdDialog.hide("ok");
                       }
                       else {
                           $mdDialog.hide("cancel");
                       }
                           }, function () {
                                   alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web")
                                   $mdDialog.hide("");
                               }
                   );
                 
               };
           }
           // funtion dialog
       } 
       $scope.showDialogEdit_daotao = function ($index) {
        let updatedaotao= $scope.Arraymadaotao[$index];
        let parentEl = angular.element(document.body);
      $mdDialog.show({
          parent: parentEl,
          // targetEvent: $event,
        //   clickOutsideToClose: true,
          escapeToClose: true,
          //   scope: $scope,
          templateUrl:'pages/nhansu/dialogEdit-daotao.html',
          locals: {
          $index,
          updatedaotao
          },
          controller: DialogController
      }).then(function (obj) {
          if (obj === "cancel") {
              } else
                  {
                    
                      daotao.update({obj }, function (result) {
                         
                        if (result[0].control === 'noOk')
                        alert("có lỗi trong quá trình tương tác server hệ thống")    
                           else if( result[0].control=== 'api' )
                               {
                                   alert("bạn phải đăng nhập lại hệ thống để tiếp tục")    
                                //    $location.path('/');
                                let landingUrl = "http://" + $window.location.host ;
                                $window.location.href = landingUrl;
                               }  
                                   else 
                                       {
                                        arrays_option.save({ control: "data_madaotao" }, function (result) {
                                            if(!result[0])    return      $scope.Arraymadaotao =""
                                                if (result[0].control === 'noOk')
                                                    alert("có lỗi trong quá trình tương tác server hệ thống")    
                                                    else if( result[0].control=== 'api' )
                                                        {
                                                            alert("bạn phải đăng nhập lại hệ thống để tiếp tục")    
                                                            // $location.path('/');
                                                            let landingUrl = "http://" + $window.location.host ;
                                                            $window.location.href = landingUrl;
                                                        }  
                                                            else 
                                                                {
                                                                    $scope.Arraymadaotao = result;
                                                                    $scope.reloadData
                                                                }
                                                            }, function () {
                                                                alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web")
                                                                return
                                                                }
                                                    );
                                        $scope.showSimpleToast("cập nhật thành công");
                                       }
                                   }, function () {
                                       alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web")
                                       return
                                      }
                           );
                  }
                }, function () {  alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web") });
   // funtion dialog
      function DialogController($scope, $mdDialog, updatedaotao) {
        //   console.log(dsKhuVuc);
        $scope.daotao={
            madaotao:updatedaotao.madaotao,
            luongdaotao:Number (updatedaotao.luongdaotao),
            ghichu:updatedaotao.ghichu,
           
        };
          $scope.closeDialog = function () {
              $mdDialog.hide("cancel");           
               };
          $scope.updateDialog_Editdaotao = function (daotao) {
               $mdDialog.hide({daotao});
          };
      }
    }
   
         $scope.exportToExcel=function(tableId){ // ex: '#my-table'
            $scope.remove=true;
          
         var exportHref=Excel.tableToExcel(tableId,'sheetchamcong');
         $timeout(function(){location.href=exportHref;},100); // trigger download
     }
     
}])
// config route