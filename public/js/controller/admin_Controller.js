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


app.controller('admin_Controller', ['$scope', '$location', '$resource','$interval','$mdToast','$mdDialog','$timeout','donviInfo',
'counter','staffs','DTOptionsBuilder',
'DTColumnBuilder','DTColumnDefBuilder',
'giamsatDichvu','giamsatNhanvien',
function ($scope, $location, $resource,$interval,$mdToast, $mdDialog, $timeout,donviInfo,counter,staffs,DTOptionsBuilder,
DTColumnBuilder,DTColumnDefBuilder,giamsatDichvu,giamsatNhanvien) {
// datatables



$scope.dtOptions_tables = DTOptionsBuilder.newOptions()
.withPaginationType('full_numbers',false)
.withOption('ordering', false)
.withOption('bFilter', true)
.withOption('bInfo',false)


// Do not forget to add the scorllY option!!!

.withOption('paging', true)
.withOption('lengthMenu', [[5, 10, 15, 20, 25, -1], [5, 10, 15, 20, 25, "All"]]);

$scope.reloadData = function() {
    $scope.dtOptions.reloadData();
};
let dataTables_Template=['pages/admin/datatables-cauhinhNhanvien.html',
'pages/admin/datatables-giamsatNhanvien.html','pages/admin/datatables-giamsatDichvu.html',
'pages/admin/datatables-cauhinhMuccanhbao.html'
];

$scope.template=dataTables_Template[0];

$scope.load_datatables_cauhinhNhanvien = function(){
    timer.stop();
    $scope.staffs_grid1=[]
    $scope.staffs_grid2=[]
    $scope.template=dataTables_Template[0];
};
$scope.load_datatables_giamsathNhanvien = function(){
    timer.stop();
    autoload_service=null
    $scope.liststaffsService = []
    $scope.listServiceStaffs = []
    $scope.liststaffsService =[]
    $scope.template=dataTables_Template[1];
   
};
$scope.load_datatables_giamsathDichvu = function(){
    timer.stop();
    autoload_service=null
    $scope.listmonitorService = []
    $scope.listService = result=[]
    $scope.template=dataTables_Template[2];
};
$scope.load_datatables_cauhinhMuccanhbao = function(){
    timer.stop();
    $scope.template=dataTables_Template[3];
};



  ///////////////// cau hinh nhan vien cua don vi//////////////////
  
  let OFFICEID ="empty"
  let OFFICENAME="empty"
  let SERVICEID="empty"
  let COUNTERID="empty"
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
   $scope.selectdonvi=function (selectedOption){
        if (!selectedOption) return
        if (OFFICEID==selectedOption.OFFICEID ) return
    $scope.officeService_Config=[]
    $scope.officeCounter_Config=[]
    $scope.staffs_grid1=[]
    $scope.staffs_grid2=[]
    SERVICEID="empty"
    COUNTERID="empty"
    OFFICENAME=selectedOption.OFFICENAME
       if(selectedOption.OFFICEID!=="" && selectedOption.OFFICEID!==null && selectedOption.OFFICEID!== undefined)
           {             OFFICEID =selectedOption.OFFICEID
                        donviInfo.save({selectedOption}, function (result) {
                        $scope.officeService_Config = result
                                }, function () {
                                    alert("Kết nối dữ liệu đơn vị " + OFFICEID + "-" + OFFICENAME + " không thành công"  )
                                    return
                                    }
                        );
                    }
            else{
                alert(" Bạn vui lòng chọn đơn vị cần cấu hình")
            }
   }
///////////////// Counter config//////////////////
$scope.selectService=function (selectedOption){
    if (!selectedOption) return
    if (SERVICEID==selectedOption.SERVICEID ) return
    $scope.officeCounter_Config=[]
    if(selectedOption.SERVICEID!=="" && selectedOption.SERVICEID!==null && selectedOption.SERVICEID!== undefined)
    counter.save({selectedOption,OFFICEID}, function (result) {
     $scope.staffs_grid1=[]
     $scope.staffs_grid2=[]
     SERVICEID=selectedOption.SERVICEID
     $scope.officeCounter_Config = result
              }, function () {
                  alert("Không load được các quầy vui lòng chọn lại các dịch vụ")
                  return
                 }
      );
         else{
             alert(" Bạn vui lòng chọn đơn vị cần cấu hình")
         }
}
////////////////// load nhan vien //////////
$scope.selectServiceCounter=function (selectedOption){
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
                       $scope.reloadData
                       cancelLoading()
                       $scope.showSimpleToast("cập nhật thành công")
                                }, function () {
                                    alert("Không thực hiện được việc update nhân viên")
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
                       $scope.reloadData
                       cancelLoading()
                       $scope.showSimpleToast("cập nhật thành công")

                                }, function () {
                                    alert("Không thực hiện được việc update nhân viên")
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
              if (num.AVGWAITTIME>num.WAITTIMEMAX)  {$scope.sumWAITTIMEMAX +=1;$scope.warningShow =true}
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
              if ( num.AVGWAITTIME>num.WAITTIMEMAX) 
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
        if (selectedOption_Monitor==selectedOption ) return
        $scope.listService = []
        SERVICEID="empty"
        if(selectedOption.OFFICEID!=="" && selectedOption.OFFICEID!==null && selectedOption.OFFICEID!== undefined)
                {  
         ( selectedOption_Monitor==selectedOption  &&  autoload_service=="DonvimonitorService")?null:$scope.showAlert("Loading");
                    
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
                                    }, function () {
                                        alert("Không load được dịch vụ vui lòng chọn lại đơn vị cần cấu hình")
                                        return
                                        }
                                );
                         
                }       
                        else{
                            alert(" Bạn vui lòng chọn đơn vị cần cấu hình")
                        }
                           
   }

  

  $scope.getoneserviceMonitor = function(selectedOption){
    if (!selectedOption) return
    if (selectedOption_Monitor==selectedOption ) return
    if(selectedOption.SERVICEID!=="" && selectedOption.SERVICEID!==null && selectedOption.SERVICEID!== undefined)
      {     
        ( selectedOption_Monitor==selectedOption  &&  autoload_service=="ServicemonitorService")?null:$scope.showAlert("Loading");
            timer.stop();
            selectedOption_Monitor=selectedOption
            autoload_service="ServicemonitorService"
            selectedOption.OFFICEID=OFFICEID
            SERVICEID =selectedOption.SERVICEID
            giamsatDichvu.save({selectedOption,allService:SERVICEID}, function (result) {
            $scope.listmonitorService = result
            check1_checkbox()
            timer.start()
            cancelLoading()
            
                    }, function () {
                        alert("Không load được dịch vụ vui lòng chọn lại đơn vị cần cấu hình")
                        return
                        }
            );
      }
        else{
            alert(" Bạn vui lòng chọn đơn vị cần cấu hình")
        }
}

  /////////////giam sat nhân viên//////////
  $scope.warningShowNhanvien =false
  $scope.checkbox1Nhanvien =false
  $scope.checkbox2Nhanvien =false
  let selectedOption_staffsMonitor={}
 
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
     if (selectedOption_Monitor==selectedOption ) return
     timer.stop();
   
     $scope.listServiceStaffs = []
     $scope.listCounter =[]
     SERVICEID="empty"
     if(selectedOption.OFFICEID!=="" && selectedOption.OFFICEID!==null && selectedOption.OFFICEID!== undefined)
        {
            ( selectedOption_Monitor==selectedOption  &&  autoload_service=="DonvimonitorNhanvien")?null:$scope.showAlert("Loading");
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
                        alert("Không load được dịch vụ vui lòng chọn lại đơn vị cần cấu hình")
                        return
                        }
            );
        }
         else{
             alert(" Bạn vui lòng chọn đơn vị cần cấu hình")
         }
}
$scope.getstaffsServiceMonitor=function (selectedOption){
    
     if (!selectedOption) return
     if (selectedOption_Monitor==selectedOption ) return
     timer.stop()
     $scope.listCounter =[]
     selectedOption.OFFICEID=OFFICEID
     SERVICEID =selectedOption.SERVICEID
     if(selectedOption.SERVICEID!=="" && selectedOption.SERVICEID!==null && selectedOption.SERVICEID!== undefined)
       {
        ( selectedOption_Monitor==selectedOption  &&  autoload_service=="ServicemonitorNhanvien")?null:$scope.showAlert("Loading");
                    selectedOption_Monitor=selectedOption
                    autoload_service="ServicemonitorNhanvien"
                giamsatNhanvien.save({selectedOption,allService:{CONTROL:"SERVICE",SERVICEID:SERVICEID}}, function (result) {
                    $scope.liststaffsService = result
                    $scope.listCounter = result[result.length-1].arrayCounter
                    check2_checkbox()
                    timer.start()
                    cancelLoading()
                        }, function () {
                            alert("Không load được dịch vụ vui lòng chọn lại đơn vị cần cấu hình")
                            return
                            }
                );
            }
                else{
                    alert(" Bạn vui lòng chọn đơn vị cần cấu hình")
                }
}
$scope.getstaffsCounterMonitor=function (selectedOption){
     if (!selectedOption) return
     if (selectedOption_Monitor==selectedOption ) return
     timer.stop()
    $scope.liststaffsService=[]
     selectedOption.OFFICEID=OFFICEID
     SERVICEID =selectedOption.SERVICEID
     COUNTERID=selectedOption.COUNTERID
     if(selectedOption.COUNTERID!=="" && selectedOption.COUNTERID!==null && selectedOption.COUNTERID!== undefined)
      { 
        ( selectedOption_Monitor==selectedOption  &&  autoload_service=="CountermonitorNhanvien")?null:$scope.showAlert("Loading"); 
        selectedOption_Monitor=selectedOption
                        autoload_service="CountermonitorNhanvien"
                    giamsatNhanvien.save({selectedOption,allService:{CONTROL:"COUNTER",SERVICEID:SERVICEID,COUNTERID:COUNTERID}}, function (result) {
                        $scope.liststaffsService = result
                        check2_checkbox()
                        timer.start()
                        cancelLoading()
                            }, function () {
                                alert("Không load được dịch vụ vui lòng chọn lại đơn vị cần cấu hình")
                                return
                                }
                    );
        }
                    else{
                        alert(" Bạn vui lòng chọn đơn vị cần cấu hình")
                    }
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








