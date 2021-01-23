
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
                state: {selected: $scope.status.cacheval&&res.departmentId==$scope.status.code?true:false}
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
                state: {selected: $scope.status.cacheval&&res.userId==$scope.status.code?true:false}
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
                state: {selected: $scope.status.cacheval&&res.id==$scope.status.code?true:false}
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
        loading: false,
        cacheval:'',
        typeindex:0,
        code:'',
        showbox:0,
        page:1,
        size:10,
        allpage:1,
        listpage:[],
        keywords:'',
    };
    if(typeof($scope.property.value)=='string'){
        let arr = $scope.property.value.split('_')
        if(arr.length==2){
            if(arr[0]=='user')$scope.status.typeindex = 0
            if(arr[0]=='dept')$scope.status.typeindex = 1
            if(arr[0]=='group')$scope.status.typeindex = 3
            $scope.status.code = arr[1]
        }
        $scope.status.cacheval = $scope.property.value
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
    $scope.pagelist=(arr)=>{
        let list = arr.filter((res,i)=>{
            return ($scope.status.keywords==''||$scope.status.keywords&&(res.text&&res.text.indexOf($scope.status.keywords)>-1))
        })
        $scope.status.allpage = Math.ceil(list.length/$scope.status.size)
        let b = ($scope.status.page-Math.ceil($scope.status.size/2))<1?1:$scope.status.page-Math.ceil($scope.status.size/2)
        let e = ($scope.status.page+Math.ceil($scope.status.size/2))>$scope.status.allpage?$scope.status.allpage:$scope.status.page+Math.ceil($scope.status.size/2)
        if((e-b)<$scope.status.size&&(b+$scope.status.size)<$scope.status.allpage){
            e = b+$scope.status.size
        }else if((e-b)<$scope.status.size&&(e-$scope.status.size)>1){
            b = e-$scope.status.size
        }
        $scope.status.listpage = new Array($scope.status.allpage).map((r,i)=>{
            return i
        }).filter((res,k)=>{
            return k>=b&&k<e
        })
        list = list.filter((res,i)=>{
            let begin = ($scope.status.page-1)*$scope.status.size
            let end = begin+$scope.status.size
            return i>=begin&&i<end
        })
        return list
    }
    $scope.jumppage = function(n){
        $scope.status.page = n
        $scope.upindex($scope.status.typeindex)
    }
    $scope.serwords = function(){
        $scope.status.page = 1
        $scope.upindex($scope.status.typeindex)
    }
    $scope.upindex = function(i){
        $scope.status.typeindex = i
        let url = urllist[i]?urllist[i]:urllist[0]
        let arr = []
        let params = {}
        angular.element('#jstree').jstree("destroy")
        $scope.status.loading = true;
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
                // arr = $scope.pagelist(arr)
                $scope.status.loading = false;
                angular.element('#jstree').jstree({
                    'plugins':["wholerow","checkbox"],
                    'core' : {
                        "multiple": false,
                        'data' :arr,
                    }
                })
                angular.element('#jstree').on('changed.jstree',(e,data)=>{
                    $scope.status.cacheval = 'dept_'+data.selected[0]
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
                arr = $scope.pagelist(arr)
                $scope.status.loading = false;
                angular.element('#jstree').jstree({
                    'plugins':["wholerow","checkbox"],
                    'core' : {
                        "multiple": false,
                        'data' :arr,
                    }
                })
                angular.element('#jstree').on('changed.jstree',(e,data)=>{
                    $scope.status.cacheval = 'user_'+data.selected[0]
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
                // arr = $scope.pagelist(arr)
                $scope.status.loading = false;
                angular.element('#jstree').jstree({
                    'plugins':["wholerow","checkbox"],
                    'core' : {
                        "multiple": false,
                        'data' :arr,
                    }
                })
                angular.element('#jstree').on('changed.jstree',(e,data)=>{
                    $scope.status.cacheval = 'group_'+data.selected[0]
                })
            })
            .error(function (data, status, headers, config) {
                $scope.error = {};
                $scope.status.loading = false;
            });
        }
    }
    $scope.changebox = function(n){
        $scope.status.page = 1
        let val = $scope.property.value
        if(val.assignment&&val.assignment.assignee&&typeof(val.assignment.assignee)=='string'){
            let arr = val.assignment.assignee.split('_')
            if(arr.length==2){
                if(arr[0]=='user')$scope.status.typeindex = 0
                if(arr[0]=='dept')$scope.status.typeindex = 1
                if(arr[0]=='group')$scope.status.typeindex = 3
                $scope.status.code = arr[1]
            }
            $scope.status.cacheval = val.assignment.assignee
        }else if($scope.status.cacheval){
            let arr = $scope.status.cacheval.split('_')
            if(arr.length==2){
                if(arr[0]=='user')$scope.status.typeindex = 0
                if(arr[0]=='dept')$scope.status.typeindex = 1
                if(arr[0]=='group')$scope.status.typeindex = 3
                $scope.status.code = arr[1]
            }
        }
        if(n==0){
            $scope.upindex($scope.status.typeindex)
        }
        $scope.status.showbox = n
    }

    setTimeout(()=>{
        $scope.upindex($scope.status.typeindex)
    },100)

    $scope.save = function() {
        let obj = {assignment:{
            assignee:$scope.status.cacheval,
            assigneeindex:$scope.status.typeindex,
        }}
        $scope.property.value = obj
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