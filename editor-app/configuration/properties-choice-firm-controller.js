
var KisBpmChoiceFirmCtrl = [ '$scope', '$modal', '$timeout', '$translate', function($scope, $modal, $timeout, $translate) {

    var opts = {
        template:  'editor-app/configuration/properties/choice-firm-write.html?version=' + Date.now(),
        scope: $scope,
        backdrop:'static',
        keyboard:false
    };

    $modal(opts);
}];

function checkData(arr,$scope){
    if(Array.isArray(arr)){
        let narr = []
        arr.forEach(res=>{
            if(res.children){
                let carr = checkData(res.children,$scope)
                narr = narr.concat(carr)
            }
        })
        let nearr = arr.map(res=>{
            let obj = {
                id:res.departmentId,
                parent:res.parentId?res.parentId:'#',
                text:res.departmentName,
                state: {selected: $scope.property.value.assignment.assignee&&$scope.property.value.assignment.assignee.indexOf(res.departmentId)!= -1?true:false}
            }
            return obj
        })
        narr = narr.concat(nearr)
        return narr
    }
}

function checkUserData(arr,$scope){
    if(Array.isArray(arr)){
        let narr = []
        arr.forEach(res=>{
            if(res.children){
                let carr = checkUserData(res.children,$scope)
                narr = narr.concat(carr)
            }
        })
        let nearr = arr.map(res=>{
            let obj = {
                id:res.userId,
                parent:res.parentId?res.parentId:'#',
                text:res.userFullName,
                state: {selected: $scope.property.value.assignment.assignee&&$scope.property.value.assignment.assignee.indexOf(res.userId)!= -1?true:false}
            }
            return obj
        })
        narr = narr.concat(nearr)
        return narr
    }
}

function checkGroupData(arr,$scope){
    if(Array.isArray(arr)){
        let narr = []
        arr.forEach(res=>{
            if(res.children){
                let carr = checkGroupData(res.children,$scope)
                narr = narr.concat(carr)
            }
        })
        let nearr = arr.map(res=>{
            let obj = {
                id:res.id,
                parent:res.parentId?res.parentId:'#',
                text:res.name,
                state: {selected: $scope.property.value.assignment.assignee&&$scope.property.value.assignment.assignee.indexOf(res.id)!= -1?true:false}
            }
            return obj
        })
        narr = narr.concat(nearr)
        return narr
    }
}

var KisBpmChoiceFirmPopupCtrl = [ '$scope', '$http', '$cookies', '$translate', function($scope, $http, $cookies, $translate) {

    $scope.typelist = ['人员','部门','岗位','群组'];
    let urllist = [
        KISBPM.URL.getPeo(),
        KISBPM.URL.getFirm(),
        KISBPM.URL.getGrop(),
        KISBPM.URL.getGrop(),
    ];
    $scope.status = {
        loading: false
    };
    $scope.cacheval = ''
    $scope.typeindex = 0
    if($scope.property.value.assignment.assigneeindex){
        $scope.typeindex = $scope.property.value.assignment.assigneeindex
    }
    // angular.element('#jstree').jstree({
    //     "plugins" : [ "wholerow", "checkbox" ]
    // })
    $scope.getData=(name)=>{
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        // let str = window.localStorage.getItem(name)
        if(arr=document.cookie.match(reg)){
            return decodeURI(arr[2]);
        // if(str){
            // return FieldCheckBack(str)
        }else{
            return null
        }
    }
    $scope.upindex = function(i){
        $scope.typeindex = i
        let url = urllist[i]?urllist[i]:urllist[0]
        let arr = []
        let params = {}
        angular.element('#jstree').jstree("destroy")
        if(i==1){
            $http({
                method: 'POST',
                data: params,
                ignoreErrors: true,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization':$scope.getData("token")
                },
                url: url
            })
            .success(function (data, status, headers, config) {
                let arr = checkData(data,$scope)
                $scope.status.loading = false;
                angular.element('#jstree').jstree({
                    'plugins':["wholerow","checkbox"],
                    'core' : {
                        "multiple": false,
                        'data' :arr,
                    }
                })
                angular.element('#jstree').on('changed.jstree',(e,data)=>{
                    $scope.cacheval = 'dept_'+data.selected[0]
                })
            })
            .error(function (data, status, headers, config) {
                $scope.error = {};
                $scope.status.loading = false;
            });
        }else if(i===0){
            $http({
                method: 'POST',
                data: params,
                ignoreErrors: true,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization':$scope.getData("token")
                },
                url: url
            })
            .success(function (data, status, headers, config) {
                let arr = checkUserData(data,$scope)
                $scope.status.loading = false;
                angular.element('#jstree').jstree({
                    'plugins':["wholerow","checkbox","state"],
                    'core' : {
                        "multiple": false,
                        'data' :arr,
                    }
                })
                angular.element('#jstree').on('changed.jstree',(e,data)=>{
                    $scope.cacheval = 'user_'+data.selected[0]
                })
            })
            .error(function (data, status, headers, config) {
                $scope.error = {};
                $scope.status.loading = false;
            });
        }else if(i===2){
            // $http({
            //     method: 'POST',
            //     data: params,
            //     ignoreErrors: true,
            //     headers: {
            //         'Accept': 'application/json',
            //         'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            //         'Authorization':$scope.getData("token")
            //     },
            //     url: url
            // })
            // .success(function (data, status, headers, config) {
            //     let arr = checkUserData(data,$scope)
            //     $scope.status.loading = false;
            //     $scope.treebox = angular.element('#jstree').jstree({
            //         'plugins':["wholerow","checkbox","state"],
            //         'core' : {
            //             "multiple": false,
            //             'data' :arr,
            //         }
            //     }).on('changed.jstree',(e,data)=>{
            //         $scope.cacheval = 'user_'+data.selected[0]
            //         console.log('data',data.selected)
            //     })
            // })
            // .error(function (data, status, headers, config) {
            //     $scope.error = {};
            //     $scope.status.loading = false;
            // });
        }else if(i===3){
            $http({
                method: 'GET',
                data: params,
                ignoreErrors: true,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization':$scope.getData("token")
                },
                url: url
            })
            .success(function (data, status, headers, config) {
                let arr = checkGroupData(data,$scope)
                $scope.status.loading = false;
                angular.element('#jstree').jstree({
                    'plugins':["wholerow","checkbox","state"],
                    'core' : {
                        "multiple": false,
                        'data' :arr,
                    }
                })
                angular.element('#jstree').on('changed.jstree',(e,data)=>{
                    $scope.cacheval = 'grp_'+data.selected[0]
                })
            })
            .error(function (data, status, headers, config) {
                $scope.error = {};
                $scope.status.loading = false;
            });
        }
    }

    setTimeout(()=>{
        $scope.upindex($scope.typeindex)
    },100)

    $scope.save = function() {
        $scope.property.value.assignment.assignee = $scope.cacheval
        $scope.property.value.assignment.assigneeindex = $scope.typeindex
        $scope.updatePropertyInModel($scope.property);
        $scope.close();
    };

    $scope.cancel = function() {
        $scope.close();
    };

    // Close button handler
    $scope.close = function() {
        $scope.property.mode = 'read';
        $scope.$hide();
    };
}];