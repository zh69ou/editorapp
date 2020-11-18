
var KisBpmChoiceFirmCtrl = [ '$scope', '$modal', '$timeout', '$translate', function($scope, $modal, $timeout, $translate) {

    var opts = {
        template:  'editor-app/configuration/properties/choice-firm-write.html?version=' + Date.now(),
        scope: $scope
    };

    $modal(opts);
}];

function checkData(arr,$scope,narr=[]){
    if(Array.isArray(arr)){
        narr = narr.concat(arr.map(res=>{
            if(res.children){
                narr = narr.concat(checkData(res.children,$scope,narr))
            }
            let obj = {
                id:res.departmentId,
                parent:res.parentId?res.parentId:'#',
                text:res.departmentName,
                state: {checked: $scope.property.value.assignment.assignee&&$scope.property.value.assignment.assignee.indexOf(res.departmentId)!= -1?true:false}
            }
            return obj
        }))
        return narr
    }
}

function checkUserData(arr,$scope,narr=[]){
    if(Array.isArray(arr)){
        narr = narr.concat(arr.map(res=>{
            if(res.children){
                narr = narr.concat(checkUserData(res.children,$scope,narr))
            }
            let obj = {
                id:res.userId,
                parent:res.parentId?res.parentId:'#',
                text:res.userFullName,
                state: {checked: $scope.property.value.assignment.assignee&&$scope.property.value.assignment.assignee.indexOf(res.userId)!= -1?true:false}
            }
            return obj
        }))
        return narr
    }
}

function checkGroupData(arr,$scope,narr=[]){
    if(Array.isArray(arr)){
        narr = narr.concat(arr.map(res=>{
            if(res.children){
                narr = narr.concat(checkGroupData(res.children,$scope,narr))
            }
            let obj = {
                id:res.id,
                parent:res.parentId?res.parentId:'#',
                text:res.name,
                state: {checked: $scope.property.value.assignment.assignee&&$scope.property.value.assignment.assignee.indexOf(res.id)!= -1?true:false}
            }
            return obj
        }))
        return narr
    }
}

var KisBpmChoiceFirmPopupCtrl = [ '$scope', '$http', '$translate', function($scope, $http, $translate) {

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
    // angular.element('#jstree').jstree({
    //     "plugins" : [ "wholerow", "checkbox" ]
    // })
    $scope.treebox = null
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
                    'Authorization':window.localStorage.getItem('token')
                },
                url: url
            })
            .success(function (data, status, headers, config) {
                let arr = checkData(data,$scope)
                $scope.status.loading = false;
                $scope.treebox = angular.element('#jstree').jstree({
                    'plugins':["wholerow","checkbox"],
                    'core' : {
                        "multiple": false,
                        'data' :arr,
                    }
                }).on('changed.jstree',(e,data)=>{
                    $scope.cacheval = 'dpt_'+data.selected[0]
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
                    'Authorization':window.localStorage.getItem('token')
                },
                url: url
            })
            .success(function (data, status, headers, config) {
                let arr = checkUserData(data,$scope)
                $scope.status.loading = false;
                $scope.treebox = angular.element('#jstree').jstree({
                    'plugins':["wholerow","checkbox"],
                    'core' : {
                        "multiple": false,
                        'data' :arr,
                    }
                }).on('changed.jstree',(e,data)=>{
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
            //         'Authorization':window.localStorage.getItem('token')
            //     },
            //     url: url
            // })
            // .success(function (data, status, headers, config) {
            //     let arr = checkUserData(data,$scope)
            //     $scope.status.loading = false;
            //     $scope.treebox = angular.element('#jstree').jstree({
            //         'plugins':["wholerow","checkbox"],
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
                    'Authorization':window.localStorage.getItem('token')
                },
                url: url
            })
            .success(function (data, status, headers, config) {
                let arr = checkGroupData(data,$scope)
                $scope.status.loading = false;
                $scope.treebox = angular.element('#jstree').jstree({
                    'plugins':["wholerow","checkbox"],
                    'core' : {
                        "multiple": false,
                        'data' :arr,
                    }
                }).on('changed.jstree',(e,data)=>{
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