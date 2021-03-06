var app = angular.module('myApp', ['ngMaterial','ngResource','ui.utils','datatables','ngSanitize']);
//////////////////////////////////////////////////////////////

app.factory('donviInfo', function ($resource) {
    return $resource('/donviInfo', {  }, {
        query: { method: 'GET', isArray: true },
        save: { method: 'POST' ,isArray: true},
        update: { method: 'PUT',isArray: true },
        delete: { method: 'DELETE',params: {id: '@id'},isArray: true }
    })
});
app.factory('counter', function ($resource) {
    return $resource('/counter', {  }, {
        query: { method: 'GET', isArray: true },
        save: { method: 'POST' ,isArray: true},
        update: { method: 'PUT',isArray: true },
        delete: { method: 'DELETE',params: {id: '@id'},isArray: true }
    })
});
app.factory('staffs', function ($resource) {
    return $resource('/staffs', {  }, {
        query: { method: 'GET', isArray: true },
        save: { method: 'POST' ,isArray: true},
        update: { method: 'PUT',isArray: true },
        delete: { method: 'DELETE',params: {id: '@id'},isArray: true }
    })
});
app.factory('staff', function ($resource) {
    return $resource('/staff/:OFFICEID/:COUNTERID/:nhanvienDelete/', {  }, {
        query: { method: 'GET', isArray: true },
        save: { method: 'POST' ,isArray: true},
        update: { method: 'PUT',isArray: true },
        delete: { method: 'DELETE',params: {id: '@id'},isArray: true }
    })
});
app.factory('giamsatDichvu', function ($resource) {
    return $resource('/giamsatDichvu', {  }, {
        query: { method: 'GET', isArray: true },
        save: { method: 'POST' ,isArray: true},
        update: { method: 'PUT',isArray: true },
        delete: { method: 'DELETE',params: {id: '@id'},isArray: true }
    })
});
app.factory('giamsatNhanvien', function ($resource) {
    return $resource('/giamsatNhanvien', {  }, {
        query: { method: 'GET', isArray: true },
        save: { method: 'POST' ,isArray: true},
        update: { method: 'PUT',isArray: true },
        delete: { method: 'DELETE',params: {id: '@id'},isArray: true }
    })
});
app.factory('canhbao', function ($resource) {
    return $resource('/canhbao', {  }, {
        query: { method: 'GET', isArray: true },
        save: { method: 'POST' ,isArray: true},
        update: { method: 'PUT',isArray: true },
        delete: { method: 'DELETE',params: {id: '@id'},isArray: true }
    })
});
app.factory('checkboxWarning', function ($resource) {
    return $resource('/checkboxWarning', {  }, {
        save: { method: 'POST' ,isArray: true},
        update: { method: 'PUT',isArray: true },
    })
});
app.factory('crudDichvu', function ($resource) {
    return $resource('/crudDichvu/:OFFICEID/:serviceidDelete', {  }, {
        query: { method: 'GET', isArray: true },
        save: { method: 'POST' ,isArray: true},
        update: { method: 'PUT',isArray: true },
        delete: { method: 'DELETE',params: {id: '@id'},isArray: true }
    })
});
app.factory('crudDonvi', function ($resource) {
    return $resource('/crudDonvi/:officeidDelete/', {  }, {
        query: { method: 'GET', isArray: true },
        save: { method: 'POST' ,isArray: true},
        update: { method: 'PUT',isArray: true },
        delete: { method: 'DELETE',params: {id: '@id'},isArray: true }
    })
});
app.factory('getRules', function ($resource) {
    return $resource('/getRules/:maNV/', {  }, {
        save: { method: 'POST',isArray: true },
    })
});

app.controller('admin_Controller', ['$scope', '$location', '$resource','$interval','$mdToast','$mdDialog','$timeout','donviInfo',
'counter','staffs','DTOptionsBuilder',
'DTColumnBuilder','DTColumnDefBuilder',
'giamsatDichvu','giamsatNhanvien','canhbao','checkboxWarning','crudDichvu','getRules','crudDonvi','staff','$window',
function ($scope, $location, $resource,$interval,$mdToast, $mdDialog, $timeout,donviInfo,counter,staffs,DTOptionsBuilder,
DTColumnBuilder,DTColumnDefBuilder,giamsatDichvu,giamsatNhanvien,canhbao,checkboxWarning,crudDichvu,getRules,crudDonvi,staff,$window) {
// datatables

// MQ01 quyen giam sat nhan vien rule1
// MQ02 quyen giam sat dich vu rule2
// MQ03 quyen cau hinh nhan vien rule3
// MQ04 quyen cấu hình mức cảnh báo rule4
// MQ05 quyen cấu hình account ( full quyen) 
// MQ06 quyen cấu hình dich vu rule6
// MQ07 quyen cấu hình donvi rule7


$scope.arrayRules={
    rule1:false,
    rule2:false,
    rule3:false,
    rule4:false,
    rule5:false,
    rule6:false,
    rule7:false
}



function reloadDatatable () {
    $scope.dtOptions.reloadData();
};

$scope.dtOptions_tables = DTOptionsBuilder.newOptions()
.withPaginationType('full_numbers',false)
.withOption('ordering', false)
.withOption('bFilter', true)
.withOption('bInfo',false)
.withOption('paging', true)
.withOption('lengthMenu', [[5, 10, 15, 20, 25, -1], [5, 10, 15, 20, 25, "All"]]);


let dataTables_Template=[
'pages/admin/datatables-cauhinhNhanvien.html',
'pages/admin/datatables-giamsatNhanvien.html',
'pages/admin/datatables-giamsatDichvu.html',
'pages/admin/datatables-cauhinhMuccanhbao.html',
'pages/admin/datatables-cauhinhDichvu.html',
'pages/admin/datatables-phanquyenUser.html',
'pages/admin/datatables-empty.html',
'pages/admin/datatables-cauhinhDonvi.html',


];


// $scope.template=dataTables_Template[6];

$scope.load_datatables_cauhinhAccount = function(){
    timer.stop();
    $scope.template=dataTables_Template[5];
};

$scope.load_datatables_cauhinhDonvi = function(){
    timer.stop();
    $scope.template=dataTables_Template[7];
    $scope.showAlert("Loading")
    crudDonvi.query({}, function (result) {
      
        if(result[0].control) {
            cancelLoading()
            alert("load danh sách các đơn vị không thành công"  )
            return
        }  
      cancelLoading()
      $scope.donvifullInfo = result
           
                         }, function () {
                             cancelLoading()
                             alert("load danh sách các đơn vị không thành công"  )
                             return
                             }
                 );


};
$scope.load_datatables_cauhinhDichvu = function(){
    timer.stop();
    $scope.template=dataTables_Template[4];
};
$scope.load_datatables_cauhinhNhanvien = function(){
    $scope.officeService_Config=[]
    timer.stop();
    $scope.staffs_grid1=[]
    $scope.staffs_grid2=[]
    $scope.template=dataTables_Template[0];
};
$scope.load_datatables_giamsathNhanvien = function(){
   
    timer.stop();
    autoload_service=null
    $scope.warningShowNhanvien=false
    $scope.liststaffsService = []
    $scope.listServiceStaffs = []
    $scope.listCounter=[]
    $scope.template=dataTables_Template[1];
   
};
$scope.load_datatables_giamsathDichvu = function(){
   
    timer.stop();
    autoload_service=null
    $scope.warningShow=false
    $scope.listmonitorService = []
    $scope.listService = result=[]
    $scope.template=dataTables_Template[2];
};
$scope.load_datatables_cauhinhMuccanhbao = function(){
    $scope.officeService_Config=[]
    timer.stop();
    $scope.waning_Info={}
    $scope.template=dataTables_Template[3];
};

$scope.signout = function(maNV){  
    let landingUrl = "http://" + $window.location.host +"/admin"  ;
    $window.location.href = landingUrl;
}
$scope.init = function(maNV){    
    if(maNV=="9999") 
   {
  
        $scope.arrayRules={
        rule1:true,
        rule2:true,
        rule3:true,
        rule4:true,
        rule5:true,
        rule6:true,
        rule7:true
    }
    $scope.template=dataTables_Template[7];
    return
}
    

    getRules.save({maNV}, function (result) {
        if(result[0].control) {
            cancelLoading()
            alert("lỗi không load được mã quyền" )
            return
        }  
            for ( let num of result )   {
               if(num.MaQuyen=="MQ01") {$scope.arrayRules.rule1=true, $scope.template=dataTables_Template[1]}
               if(num.MaQuyen=="MQ02"){ $scope.arrayRules.rule2=true,$scope.template=dataTables_Template[2]}
               if(num.MaQuyen=="MQ03") {$scope.arrayRules.rule3=true,$scope.template=dataTables_Template[0]}
               if(num.MaQuyen=="MQ04") {$scope.arrayRules.rule4=true,$scope.template=dataTables_Template[3]}
               if(num.MaQuyen=="MQ05") {$scope.arrayRules.rule5=true,$scope.template=dataTables_Template[5]}
               if(num.MaQuyen=="MQ06") {$scope.arrayRules.rule6=true,$scope.template=dataTables_Template[4]}
               if(num.MaQuyen=="MQ07") {$scope.arrayRules.rule7=true,$scope.template=dataTables_Template[7]}
            }
            // $scope.template=dataTables_Template[6]

                         }, function () {
                            alert("lỗi hệ thông" )
                             return
                             }
                 );
   
};


/////////////////// crud dich vu////////////////////////////
let selectoption_crudDichvu={}
$scope.servicefullInfo=[]
$scope.show_crudService=false

$scope.select_crudService=function (selectedOption){
    $scope.show_crudService=false
    if (!selectedOption) return
       ( selectoption_crudDichvu==selectedOption)?null:(
           $scope.servicefullInfo=[]
       );  
           OFFICENAME=selectedOption.OFFICENAME
           OFFICEID =selectedOption.OFFICEID
           selectoption_crudDichvu=selectedOption    
            $scope.showAlert("Loading")
           crudDichvu.query({OFFICEID}, function (result) {
                // console.log(result)
                if(result[0].control) {
                    cancelLoading()
                    alert("load dịch vụ của  " + OFFICEID + "-" + OFFICENAME + " không thành công"  )
                    return
                }  
              cancelLoading()
              $scope.servicefullInfo = result
                   
                                 }, function () {
                                     cancelLoading()
                                     alert("load dịch vu của" + OFFICEID + "-" + OFFICENAME + " không thành công"  )
                                     return
                                     }
                         );
        
  }
  $scope.action=function(option,label,index){
    $scope.show_crudService=true
    $scope.labelName=label
 if( option=="Dichvu"){
                if(label==="Add")
                {
                    $scope.Infoservice={
                        STARTTIME:"07:30:00",
                        ENDTIME:"12:00:00",
                        STARTTIME2:"13:30:00",
                        ENDTIME2: "23:00:00",
                        RESET:false
                    }
                }
            
                if(label==="Edit")
                {
                    $scope.Infoservice={
                        SERVICEID:$scope.servicefullInfo[index].SERVICEID,
                        SERVICENAME:$scope.servicefullInfo[index].SERVICENAME,
                        STARTNO:$scope.servicefullInfo[index].STARTNO,
                        ENDNO:$scope.servicefullInfo[index].ENDNO,
                        STARTTIME:$scope.servicefullInfo[index].STARTTIME,
                        ENDTIME: $scope.servicefullInfo[index].ENDTIME,
                        STARTTIME2:$scope.servicefullInfo[index].STARTTIME2,
                        ENDTIME2: $scope.servicefullInfo[index].ENDTIME2,
                        COPIES:$scope.servicefullInfo[index].COPIES,
                        MAXTIME:$scope.servicefullInfo[index].MAXTIME,
                        RESET:$scope.servicefullInfo[index].RESET,
                        CONTI:$scope.servicefullInfo[index].CONTI,
                    
                    }

                }
            }
if( option=="Donvi"){
    let dateNow =new Date();
    
         dateNow = moment(dateNow).format('YYYY-MM-DD HH:MM:SS'); 
        
    $scope.Infodonvi={
     RUNTIME:dateNow,
     ISACTIVE:true
    }


    if(label==="Edit")
    {
        $scope.Infodonvi={
            OFFICEID:$scope.donvifullInfo[index].OFFICEID,
            OFFICENAME:$scope.donvifullInfo[index].OFFICENAME,
            ADDRESS:$scope.donvifullInfo[index].ADDRESS,
            PHONE:$scope.donvifullInfo[index].PHONE,
            FAX:$scope.donvifullInfo[index].FAX,
            ORDERINDEX: $scope.donvifullInfo[index].ORDERINDEX,
            IPDATABASE:$scope.donvifullInfo[index].IPDATABASE,
            DATABASENAME: $scope.donvifullInfo[index].DATABASENAME,
            USERNAME:$scope.donvifullInfo[index].USERNAME,
            PASSWORD:$scope.donvifullInfo[index].PASSWORD,
            RUNTIME:$scope.donvifullInfo[index].RUNTIME,
            ISACTIVE:$scope.donvifullInfo[index].ISACTIVE,
            LOGO:$scope.donvifullInfo[index].LOGO,
            
        }

    }            

} 
  
   
}
  
$scope.actionObj=function(option,InfoObj){
if(option=="Dichvu")
        {
            if( $scope.labelName==="Add") {
                addService(InfoObj)
            }
            if( $scope.labelName==="Edit") {
                editService(InfoObj)
            }
        }
if(option=="Donvi")
{
    if( $scope.labelName==="Add") {
        addDonvi(InfoObj)
    }
    if( $scope.labelName==="Edit") {
        editDonvi(InfoObj)
    }
}
    

}

function addService (Infoservice){
    $scope.showAlert("processing")
        crudDichvu.save({Infoservice,OFFICEID}, function (result) {
        
            if(result[0].control) {
                cancelLoading()
                alert("thêm dịch vụ cho " + OFFICEID + "-" + OFFICENAME + " không thành công"  )
                return
            }  
          cancelLoading()
          $scope.showSimpleToast("thêm dịch vụ thành công")
          $scope.show_crudService=false
        //   reloadDatatable()
          $scope.servicefullInfo=result
          
               
                             }, function () {
                                 cancelLoading()
                                 alert("Kết nối dữ liệu đơn vị " + OFFICEID + "-" + OFFICENAME + " không thành công"  )
                                 return
                                 }
                     );
  }
  function editService (Infoservice){
    $scope.showAlert("processing")
    crudDichvu.update({Infoservice,OFFICEID}, function (result) {
       
        if(result[0].control) {
            cancelLoading()
            alert("sửa dịch vụ cho " + OFFICEID + "-" + OFFICENAME + " không thành công"  )
            return
        }  
      cancelLoading()
      $scope.showSimpleToast("sửa dịch vụ thành công")
      $scope.show_crudService=false
    //   reloadDatatable()
      $scope.servicefullInfo=result
    
           
                         }, function () {
                             cancelLoading()
                             alert("Kết nối dữ liệu đơn vị " + OFFICEID + "-" + OFFICENAME + " không thành công"  )
                             return
                             }
                 );
}
function deleteService (index){
    $scope.showAlert("processing")
      let serviceidDelete=$scope.servicefullInfo[index].SERVICEID 
    crudDichvu.delete({serviceidDelete,OFFICEID}, function (result) {
      
        if(result[0].control) {
            cancelLoading()
            alert("xoá dịch vụ cho " + OFFICEID + "-" + OFFICENAME + " không thành công"  )
            return
        }  
      cancelLoading()
      $scope.showSimpleToast("xoá dịch vụ thành công")
      $scope.servicefullInfo=result
    
      $scope.show_crudService=false
           
                         }, function () {
                             cancelLoading()
                             alert("Kết nối dữ liệu đơn vị " + OFFICEID + "-" + OFFICENAME + " không thành công"  )
                             return
                             }
                 );
}

function addDonvi (InfoDonvi){
    $scope.showAlert("processing")
        crudDonvi.save({InfoDonvi}, function (result) {
          
            if(result[0].control) {
                cancelLoading()
                alert("thêm don vị không thành công"  )
                return
            }  
          cancelLoading()
          $scope.showSimpleToast("thêm đơn vị thành công")
          $scope.show_crudService=false
        //   reloadDatatable()
          $scope.donvifullInfo=result
          
               
                             }, function () {
                                 cancelLoading()
                                 alert("load danh sách các đơn vị không thành công"  )
                                 return
                                 }
                     );
  }
  function editDonvi (InfoDonvi){
    $scope.showAlert("Processing")
    crudDonvi.update({InfoDonvi}, function (result) {
      
        if(result[0].control) {
            cancelLoading()
            alert("update đơn vị không thành công"  )
            return
        }  
      cancelLoading()
      $scope.showSimpleToast("update đơn vị  thành công")
      $scope.show_crudService=false
    //   reloadDatatable()
      $scope.donvifullInfo=result
    
           
                         }, function () {
                             cancelLoading()
                             alert("update đơn vị không thành công"  )
                             return
                             }
                 );
}
function deleteDonvi (index){
    $scope.showAlert("processing")
      let officeidDelete=$scope.donvifullInfo[index].OFFICEID 
    crudDonvi.delete({officeidDelete}, function (result) {
        console.log(result)
        if(result[0].control) {
            cancelLoading()
            alert("xoá đơn vị không thành công"  )
            return
        }  
      cancelLoading()
      $scope.showSimpleToast("xoá đơn vị thành công")
      $scope.donvifullInfo=result
    
      $scope.show_crudService=false
           
                         }, function () {
                             cancelLoading()
                             alert("xoá đơn vị không thành công"  )
                             return
                             }
                 );
}
function deleteNhanvien (index){
    $scope.showAlert("processing")
      let nhanvienDelete=$scope.staffs_grid2[index].STAFFID
    staff.delete({OFFICEID,COUNTERID,nhanvienDelete}, function (result) {
        if(result[0].control) {
            cancelLoading()
            alert("xoá nhân viên không thành công"  )
            return
        }  
      cancelLoading()
      $scope.showSimpleToast("xoá nhân viên thành công")
      $scope.staffs_grid2 = result
                         }, function () {
                             cancelLoading()
                             alert("xoá nhân viên không thành công"  )
                             return
                             }
                 );
}
$scope.ShowDialog_confirm = function (option,html,index) {

     var parentEl = angular.element(document.body);
     $mdDialog.show({
         parent: parentEl,
         // targetEvent: $event,
         // clickOutsideToClose: true,
         escapeToClose: true,
         //   scope: $scope,
         templateUrl: html,
         locals: {
           
         },
         controller: DialogController
     }).then(function (obj) {
     
        if (obj === "cancel") return
                if ( option==="dichvu")
                        {
                        deleteService(index)
                        }  
                if ( option==="donvi")
                {
                deleteDonvi(index)
                }    
                if ( option==="nhanvien")
                {
                  deleteNhanvien(index)
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

 $scope.ShowDialog_addStaff = function () {
     var parentEl = angular.element(document.body);
     $mdDialog.show({
         parent: parentEl,
         // targetEvent: $event,
         // clickOutsideToClose: true,
         escapeToClose: true,
         //   scope: $scope,
         templateUrl: 'pages/admin/dialogStaffAdd.html',
         locals: {
            COUNTERID
         },
         controller: DialogController
     }).then(function (obj) {
        if (obj === "cancel") return
      $scope.showAlert("processing")
        staff.save({obj}, function (result) {
            // console.log(result)
            if(result[0].control) {
                cancelLoading()
                alert(" thêm nhân viên không thành công"  )
                return
            }  
          cancelLoading()
          $scope.showSimpleToast("thêm nhân viên thành công")
          $scope.staffs_grid2=result
            // console.log($scope.accounts)
                             }, function () {
                                 cancelLoading()
                            alert(" thêm nhân viên không thành công"  )
                                 return
                                 }
                     );
         }, function () {  alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web") });
     // funtion dialog
     function DialogController($scope, $mdDialog,COUNTERID) {
           
         $scope.closeDialog = function () {
             $mdDialog.hide("cancel");
         };
         $scope.addDialog = function (staff) {
             console.log(staff)
             staff.COUNTERID=COUNTERID
             staff.OFFICEID=OFFICEID
             $mdDialog.hide({staff});
         }
      
     };
     // funtion dialog
 } 



///////////////// cau hinh nhan vien cua don vi//////////////////
  let OFFICEID=""
  let SERVICEID=""
  let COUNTERID=""
  let selectedOption_Config={}
  $scope.allCheck1=false
  $scope.allCheck2=false

   function load_donvi_Config (){
    donviInfo.query({ }, function (result) {
        $scope.donVi_Config =result
                 }, function () {
                     alert("Không load được đơn vị cấu hình vui lòng reset lại trình duyệt")
                     return
                    }
         );
   }
   load_donvi_Config();
///////////////// Service config//////////////////
   $scope.selectdonvi=function (selectedOption,option){
     if (!selectedOption) return
        ( selectedOption_Config==selectedOption)?null:(
            $scope.officeService_Config=[],
            $scope.officeCounter_Config=[],
            $scope.staffs_grid1=[],
            $scope.staffs_grid2=[],
            $scope.waning_Info={}
        );  
            OFFICENAME=selectedOption.OFFICENAME
            OFFICEID =selectedOption.OFFICEID
            selectedOption_Config=selectedOption     
            donviInfo.save({selectedOption}, function (result) {
            $scope.officeService_Config = result
                    if(option==1) callcheckboxWarning(OFFICEID)
                                }, function () {
                                    alert("Kết nối dữ liệu đơn vị " + OFFICEID + "-" + OFFICENAME + " không thành công"  )
                                    return
                                    }
                        );
         
   }
///////////////// Counter config//////////////////
$scope.selectService=function (selectedOption){
    if (!selectedOption) return
    ( selectedOption_Config==selectedOption)?null:(
        $scope.officeCounter_Config=[],
        $scope.staffs_grid1=[],
        $scope.staffs_grid2=[]
    );  
    counter.save({selectedOption,OFFICEID}, function (result) {
     $scope.officeCounter_Config = result
     selectedOption_Config=selectedOption
     
              }, function () {
                alert("Kết nối dữ liệu đơn vị " + OFFICEID + "-" + OFFICENAME + "-" + selectedOption.SERVICENAME+  " không thành công"  )
                  return
                 }
      );
        
}
////////////////// load nhan vien //////////
$scope.selectServiceCounter=function (selectedOption){
    // if (!selectedOption) return
    //         ( selectedOption_Config==selectedOption)?null:(
    //             $scope.staffs_grid1=[],
    //             $scope.staffs_grid2=[]
    //         );  
    //         ( selectedOption_Config==selectedOption)?null:(
    //             $scope.showAlert("Loading")
    //         );   
    //     staffs.save({selectedOption,OFFICEID,TABLE:"GRID2"}, function (result) {
    //             for (let i = 0; i < result.length; i++) { 
    //             result[i].checkBox=false
    //             }
    //             $scope.staffs_grid2 = result
             
    //             staffs.save({selectedOption,OFFICEID,TABLE:"GRID1"}, function (result) {
    //                     for (let i = 0; i < result.length; i++) { 
    //                         result[i].checkBox=false
    //                     }
    //                     $scope.staffs_grid1 = result
    //                     COUNTERID=selectedOption.COUNTERID
    //                     selectedOption_Config=selectedOption
    //                     cancelLoading()
    //                             }, function () {
    //                                 alert("Không load được danh sách các nhân viên")
    //                                 return
    //                                 }
    //                     );
    //         }, function () {
    //             alert("Không load được danh sách các nhân viên")
    //             return
    //             }
    //     );
    
        if (!selectedOption) return
        if (COUNTERID==selectedOption.COUNTERID ) return
        if (selectedOption.COUNTERID!=="" && selectedOption.COUNTERID!==null && selectedOption.COUNTERID!== undefined)
            {
                $scope.staffs_grid1=[]
                $scope.staffs_grid2=[]
                $scope.showAlert("Loading")
                    staffs.save({selectedOption,OFFICEID,TABLE:"GRID2"}, function (result) {
                    for (let i = 0; i < result.length; i++) { 
                      result[i].checkBox=false
                    }
                    COUNTERID=selectedOption.COUNTERID
                    $scope.staffs_grid2 = result
    
                    staffs.save({selectedOption,OFFICEID,TABLE:"GRID1"}, function (result) {
                        for (let i = 0; i < result.length; i++) { 
                            result[i].checkBox=false
                          }
                        COUNTERID=selectedOption.COUNTERID
                        $scope.staffs_grid1 = result
                        cancelLoading()
                                }, function () {
                                    alert("Không load được danh sách các nhân viên")
                                    return
                                    }
                        );
                            }, function () {
                                alert("Không load được danh sách các nhân viên")
                                return
                                }
                    );
              }
                else{
                    alert(" Bạn vui lòng chọn đơn vị cần cấu hình")
                }
}
/////////////////////////////
    $scope.capSo = function(){
        console.log("ok Toàn")
        captcha.query({ }, function (result) {
              console.log(result)
               
                       }, function () {
                           alert("đường truyền mạng có lỗi hoặc reset lại trình duyệt web")
                           return
                          }
               );
    }
    ///////////////////////grid1////////////

    $scope.allCheckBox1 = function(){
           $scope.allCheck1=!$scope.allCheck1
        for (let i = 0; i <  $scope.staffs_grid1.length; i++) { 
            $scope.staffs_grid1[i].checkBox=$scope.allCheck1
          }
    }
    $scope.checkbox_grid1 = function(index){
        $scope.staffs_grid1[index].checkBox=!$scope.staffs_grid1[index].checkBox
               
                     }
    $scope.allCheckBox2 = function(){
        $scope.allCheck2=!$scope.allCheck2
                for (let i = 0; i <  $scope.staffs_grid2.length; i++) { 
                    $scope.staffs_grid2[i].checkBox=$scope.allCheck2
                    }
            }
    $scope.checkbox_grid2 = function(index){
        $scope.staffs_grid2[index].checkBox=!$scope.staffs_grid2[index].checkBox
                
            }
    /////////////////// update///////
    $scope.update_right = function(){
        if ($scope.staffs_grid1==null || $scope.staffs_grid1==undefined || $scope.staffs_grid1=="") return alert(" bạn vui lòng chọn quầy")
         let checked_row=false
         let arrayUpdate =[]
        for (let i = 0; i <  $scope.staffs_grid1.length; i++) { 
           if ($scope.staffs_grid1[i].checkBox==true)
                {
                    checked_row=true
                    arrayUpdate.push($scope.staffs_grid1[i])
                }
            }
                if (!checked_row)  return alert("bạn vui lòng chọn nhân viên trong danh sách nhân viên")
                $scope.showAlert("processing")    
                staffs.update({arrayUpdate,OFFICEID,COUNTERID,TABLE:"GRID1"}, function (result) {
                        for (let i = 0; i < arrayUpdate.length; i++) { 
                            let index = $scope.staffs_grid1.findIndex(x => x.checkBox==true);
                            $scope.staffs_grid1.splice(index, 1)
                            arrayUpdate[i].checkBox=false
                            $scope.staffs_grid2.push(arrayUpdate[i])
                          }
                    //    $scope.reloadData
                       cancelLoading()
                       $scope.showSimpleToast("cập nhật thành công")
                                }, function () {
                                    alert("Không thực hiện được việc update nhân viên")
                                    cancelLoading()
                                    return
                                    }
                        );
    }
    $scope.update_left = function(){
        if ($scope.staffs_grid2==null || $scope.staffs_grid2==undefined || $scope.staffs_grid2=="") return alert(" bạn vui lòng chọn quầy")
         let checked_row=false
         let arrayUpdate =[]
        for (let i = 0; i <  $scope.staffs_grid2.length; i++) { 
           if ($scope.staffs_grid2[i].checkBox==true)
                {
                    checked_row=true
                    arrayUpdate.push($scope.staffs_grid2[i])
                }
            }
                if (!checked_row)  return alert("bạn vui lòng chọn nhân viên trong danh sách nhân viên tại quầy")
                $scope.showAlert("processing")   
                staffs.update({arrayUpdate,OFFICEID,COUNTERID,TABLE:"GRID2"}, function (result) {
                        for (let i = 0; i < arrayUpdate.length; i++) { 
                          
                            let index = $scope.staffs_grid2.findIndex(x => x.checkBox==true);
                            $scope.staffs_grid2.splice(index, 1)
                            arrayUpdate[i].checkBox=false
                            arrayUpdate[i].QUAY=0
                            $scope.staffs_grid1.push(arrayUpdate[i])
                          }
                    //    $scope.reloadData
                       cancelLoading()
                       $scope.showSimpleToast("cập nhật thành công")

                                }, function () {
                                    alert("Không thực hiện được việc update nhân viên")
                                    cancelLoading()
                                    return
                                    }
                        );
    }
    ////////////////////// warning////////////////
    function callcheckboxWarning(OFFICEID){
        checkboxWarning.save({OFFICEID}, function (result) {
            if(result[0].control=="noOk") 
            {
                $scope.showSimpleToast(" load dữ liệu không thành công") 
                cancelLoading()
            } 
            else{
                // console.log(result[0])
                $scope.waningcheckbox_Info={
                    sound:result[0].BYSOUND,
                    picture:result[0].BYIMG,
                }
                $scope.showSimpleToast(" load dữ liệu thành công") 
                cancelLoading()
            }
                    }, function () {
                        alert("Load dữ liệu cảnh báo " + OFFICEID + "-" + " không thành công")
                        return
                        }
            );
    }
 $scope.updatecheckbox=function(selectedOption){
    checkboxWarning.update({OFFICEID,selectedOption}, function (result) {
        if(result[0].control=="noOk") 
        {
            $scope.showSimpleToast(" cập nhật dữ liệu không thành công") 
            cancelLoading()
        } 
        else{
         
            $scope.showSimpleToast(" cập nhật dữ liệu thành công") 
            cancelLoading()
        }
                }, function () {
                    alert("Load dữ liệu cảnh báo " + OFFICEID + "-" + " không thành công")
                    return
                    }
        );
 }   
$scope.selectServiceWarning=function (selectedOption){
    if (!selectedOption) return
        ( selectedOption_Config==selectedOption)?null:(
            $scope.waning_Info=[]
        );  
        ( selectedOption_Config==selectedOption)?null:(
            $scope.showAlert("Loading")
        );
            SERVICEID=selectedOption.SERVICEID
            SERVICENAME=selectedOption.SERVICENAME
            canhbao.save({selectedOption,OFFICEID}, function (result) {
                if(result[0].control=="noOk") 
                {
                    $scope.showSimpleToast(" load dữ liệu không thành công") 
                    cancelLoading()
                } 
                else{
                    $scope.waning_Info={
                        timeWait_max:Number(result[0].WAITTIMEMAX),
                        timeService_max:Number(result[0].SERVICETIMEMAX),
                        time_2so:Number(result[0].DISCOUNTITIMEMAX),
                    }
                    $scope.showSimpleToast(" load dữ liệu thành công") 
                    selectedOption_Config=selectedOption
                    cancelLoading()
                }
              
                        }, function () {
                            alert("Load dữ liệu cảnh báo " + OFFICEID + "-" + OFFICENAME + SERVICENAME + " không thành công")
                            return
                            }
                );
    
}

$scope.saveserviceWarning=function(selectedOption,index){
        $scope.showAlert("processing")
    canhbao.update({selectedOption,OFFICEID,SERVICEID,index}, function (result) {
        if(result[0].control=="noOk") 
            {
                $scope.showSimpleToast(" cập nhật không thành công") 
                cancelLoading()
            } 
            else {
             
                $scope.showSimpleToast(" cập nhật thành công") 
                cancelLoading()
            }
                   }, function () {
                       alert("cập nhật dữ liệu cảnh báo " + OFFICEID + "-" + OFFICENAME  +"-"+ SERVICENAME + " không thành công")
                       cancelLoading()
                       return
                       }
           );
}


    /////////////giam sat dich vu//////////
    let autoload_service=""
    let selectedOption_Monitor={}
    $scope.warningShow =false
    $scope.checkbox1 =false
    $scope.checkbox2 =false

    function check1_checkbox ()
    {
        $scope.sumSERVICETIMEMAX=0
        $scope.sumWAITTIMEMAX =0
        $scope.warningShow =false
  
      if ($scope.checkbox1 == false  && $scope.checkbox2==false )
          for (let num of  $scope.listmonitorService ) {
              if (num.TG_PV_HIENTAI>num.SERVICETIMEMAX)   {$scope.sumSERVICETIMEMAX +=1 ;$scope.warningShow =true}
              if (num.MAXWAITTIME>num.WAITTIMEMAX)  {$scope.sumWAITTIMEMAX +=1;$scope.warningShow =true}
          }
      if ($scope.checkbox1 == true)
        
          for(let num of $scope.listmonitorService ){
              if ( num.TG_PV_HIENTAI > num.SERVICETIMEMAX) 
                  {
                      {$scope.sumSERVICETIMEMAX +=1 ;$scope.warningShow =true}
                  }
                }
      if ($scope.checkbox2 == true)
      
          for(let num of $scope.listmonitorService ){
              if ( num.MAXWAITTIME>num.WAITTIMEMAX) 
                  {
                      {$scope.sumWAITTIMEMAX +=1 ;$scope.warningShow =true}
                  }
          }
        }
   
    $scope.check1 =function(){
        $scope.checkbox1 =!$scope.checkbox1
        check1_checkbox()
    }

    $scope.check2 =function(){
        $scope.checkbox2 =!$scope.checkbox2
        check1_checkbox()
    }

  $scope.getserviceMonitor =function (selectedOption){
        if (!selectedOption) return
        ( selectedOption_Monitor==selectedOption  &&  autoload_service=="DonvimonitorService")?null:($scope.listService = [],$scope.listmonitorService =[]);
        ( selectedOption_Monitor==selectedOption  &&  autoload_service=="DonvimonitorService")?null:$scope.showAlert("Loading  "+ selectedOption.OFFICENAME);
        //  console.log(selectedOption_Monitor)
                            timer.stop();
                            selectedOption_Monitor=selectedOption
                            autoload_service="DonvimonitorService"
                            giamsatDichvu.save({selectedOption,allService:"All"}, function (result) {
                                    OFFICEID =selectedOption.OFFICEID
                                    $scope.listmonitorService = result
                                    $scope.listService = result
                                    check1_checkbox()
                                    timer.start()
                                    cancelLoading()
                                    // console.log(result)
                                    }, function () {
                                        alert("Không load được danh sách giám sát các dịch vụ trực tuyến")
                                        return
                                        }
                                );
   }

  $scope.getoneserviceMonitor = function(selectedOption){
    if (!selectedOption) return
        ( selectedOption_Monitor==selectedOption  &&  autoload_service=="ServicemonitorService")?null:($scope.listmonitorService =[]);
        ( selectedOption_Monitor==selectedOption  &&  autoload_service=="ServicemonitorService")?null:$scope.showAlert("Loading " + selectedOption.SERVICENAME);
            // console.log(selectedOption)
            timer.stop();
            selectedOption_Monitor=selectedOption
            autoload_service="ServicemonitorService"
            SERVICEID =selectedOption.SERVICEID
            selectedOption.OFFICEID=OFFICEID
        giamsatDichvu.save({selectedOption,allService:SERVICEID}, function (result) {
        $scope.listmonitorService = result
        check1_checkbox()
        timer.start()
        cancelLoading()
                }, function () {
                    alert("Không load được danh sách giám sát dịch vụ trực tuyến")
                    return
                    }
        );
    
}

  /////////////giam sat nhân viên//////////
  $scope.warningShowNhanvien =false
  $scope.checkbox1Nhanvien =false
  $scope.checkbox2Nhanvien =false
 
    function check2_checkbox ()
        {
            $scope.sumSERVICETIMEMAX=0
            $scope.sumDISCOUNTITIMEMAX =0
            $scope.warningShowNhanvien =false
      
          if ($scope.checkbox1Nhanvien == false  && $scope.checkbox2Nhanvien==false )
              for (let num of  $scope.liststaffsService ) {
                  if (num.TG_PV_HIENTAI>num.SERVICETIMEMAX)   {$scope.sumSERVICETIMEMAX +=1 ;$scope.warningShowNhanvien =true}
                  if (num.TG_OFF_2SO>num.DISCOUNTITIMEMAX)  {$scope.sumDISCOUNTITIMEMAX +=1;$scope.warningShowNhanvien =true}
              }
          if ($scope.checkbox1Nhanvien == true)
            
              for(let num of $scope.liststaffsService ){
                  if ( num.TG_PV_HIENTAI > num.SERVICETIMEMAX) 
                      {
                          {$scope.sumSERVICETIMEMAX +=1 ;$scope.warningShowNhanvien =true}
                      }
                    }
          if ($scope.checkbox2Nhanvien == true)
          
              for(let num of $scope.liststaffsService ){
                  if ( num.TG_OFF_2SO > num.DISCOUNTITIMEMAX) 
                      {
                          {$scope.sumDISCOUNTITIMEMAX +=1 ;$scope.warningShowNhanvien =true}
                      }
              }
            }

  $scope.check1Nhanvien =function(){
      $scope.checkbox1Nhanvien =!$scope.checkbox1Nhanvien
      check2_checkbox()
  }

  $scope.check2Nhanvien =function(){
      $scope.checkbox2Nhanvien =!$scope.checkbox2Nhanvien
      check2_checkbox()
  }
  $scope.getstaffsMonitor=function (selectedOption){
    
    if (!selectedOption) return
    ( selectedOption_Monitor==selectedOption  &&  autoload_service=="DonvimonitorNhanvien")?null:( $scope.liststaffsService = [], $scope.listServiceStaffs = [], $scope.listCounter=[] );      
    ( selectedOption_Monitor==selectedOption  &&  autoload_service=="DonvimonitorNhanvien")?null:$scope.showAlert("Loading " + selectedOption.OFFICENAME);
    // console.log(selectedOption)      
            timer.stop();
            selectedOption_Monitor=selectedOption
            autoload_service="DonvimonitorNhanvien"
            giamsatNhanvien.save({selectedOption,allService:{CONTROL:"DONVI",SERVICEID:SERVICEID}}, function (result) {
                OFFICEID =selectedOption.OFFICEID
                $scope.liststaffsService = result
                $scope.listServiceStaffs = result[result.length-1].arrayService
                check2_checkbox()
                timer.start()
                cancelLoading()
                    }, function () {
                        alert("Không load được danh sách nhân viên cần giám sát của đơn vị")
                        return
                        }
            );
}
$scope.getstaffsServiceMonitor=function (selectedOption){
    if (!selectedOption) return
        ( selectedOption_Monitor==selectedOption  &&  autoload_service=="ServicemonitorNhanvien")?null:( $scope.liststaffsService = [], $scope.listCounter=[] );     
        ( selectedOption_Monitor==selectedOption  &&  autoload_service=="ServicemonitorNhanvien")?null:$scope.showAlert("Loading "+ selectedOption.SERVICENAME);
                //  console.log(selectedOption) 
                    timer.stop()            
                    selectedOption_Monitor=selectedOption
                    autoload_service="ServicemonitorNhanvien"
                    selectedOption.OFFICEID=OFFICEID
                    SERVICEID =selectedOption.SERVICEID
            giamsatNhanvien.save({selectedOption,allService:{CONTROL:"SERVICE",SERVICEID:SERVICEID}}, function (result) {
            $scope.liststaffsService = result
            $scope.listCounter = result[result.length-1].arrayCounter
            check2_checkbox()
            timer.start()
            cancelLoading()
                }, function () {
                    alert("Không load được danh sách nhân viên cần giám sát dịch vụ ")
                    return
                    }
        );
          
}
$scope.getstaffsCounterMonitor=function (selectedOption){
     if (!selectedOption) return
        ( selectedOption_Monitor==selectedOption  &&  autoload_service=="CountermonitorNhanvien")?null:( $scope.liststaffsService = [] );     
        ( selectedOption_Monitor==selectedOption  &&  autoload_service=="CountermonitorNhanvien")?null:$scope.showAlert("Loading"); 
                        timer.stop()               
                        selectedOption_Monitor=selectedOption
                        autoload_service="CountermonitorNhanvien"
                        selectedOption.OFFICEID=OFFICEID
                        SERVICEID =selectedOption.SERVICEID
                        COUNTERID=selectedOption.COUNTERID
                    giamsatNhanvien.save({selectedOption,allService:{CONTROL:"COUNTER",SERVICEID:SERVICEID,COUNTERID:COUNTERID}}, function (result) {
                        $scope.liststaffsService = result
                        check2_checkbox()
                        timer.start()
                        cancelLoading()
                            }, function () {
                                alert("Không load được danh sách nhân viên cần giám sát của quầy ")
                                return
                                }
                    );
      
}

/////////////////////autoReload////////////////////
    function Timer(fn, t) {
        var timerObj = setInterval(fn, t);
    
        this.stop = function() {
            if (timerObj) {
                clearInterval(timerObj);
                timerObj = null;
            }
            return this;
        }
        this.start = function() {
            if (!timerObj) {
                this.stop();
                timerObj = setInterval(fn, t);
            }
            return this;
        }
        this.reset = function(newT) {
            t = newT;
            return this.stop().start();
        }
    }
    let timer = new Timer(function() {
        // console.log(selectedOption_Monitor)
        // console.log(autoload_service)
        if( autoload_service=="DonvimonitorService")
        $scope.getserviceMonitor(selectedOption_Monitor)
        if( autoload_service=="ServicemonitorService")
        $scope.getoneserviceMonitor(selectedOption_Monitor)
        if( autoload_service=="DonvimonitorNhanvien")
        $scope.getstaffsMonitor(selectedOption_Monitor)
        if( autoload_service=="ServicemonitorNhanvien")
        $scope.getstaffsServiceMonitor(selectedOption_Monitor)
        if( autoload_service=="CountermonitorNhanvien")
        $scope.getstaffsCounterMonitor(selectedOption_Monitor)
    }, 5000);

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
    
    /////////////app.controller////////////

    }])








