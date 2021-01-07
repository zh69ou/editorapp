
var KisBpmChoiceSetsCtrl = [ '$scope', '$modal', '$timeout', '$cookies', '$translate', function($scope, $modal, $timeout,$cookies, $translate) {

    var opts = {
        template:  'editor-app/configuration/properties/choice-sets-write.html?version=' + Date.now(),
        scope: $scope,
        backdrop:'static',
        keyboard:false
    };

    $modal(opts);
}];

function SetCheckData(arr,$scope){
    if(Array.isArray(arr)){
        let narr = []
        arr.forEach(res=>{
            if(res.children){
                let carr = SetCheckData(res.children,$scope)
                narr = narr.concat(carr)
            }
        })
        let nearr = arr.map(res=>{
            let obj = {
                id:res.departmentId,
                parent:res.parentId?res.parentId:'#',
                text:res.departmentName,
                state: {selected: $scope.fsets.message.sendUsers[$scope.SelUserId]['WebuserId']&&$scope.fsets.message.sendUsers[$scope.SelUserId]['WebuserId'].indexOf(res.departmentId)!= -1?true:false}
            }
            return obj
        })
        narr = narr.concat(nearr)
        return narr
    }
}

function SetCheckUserData(arr,$scope){
    if(Array.isArray(arr)){
        let narr = []
        arr.forEach(res=>{
            if(res.children){
                let carr = SetCheckUserData(res.children,$scope)
                narr = narr.concat(carr)
            }
        })
        let nearr = arr.map(res=>{
            let obj = {
                id:res.userId,
                parent:res.parentId?res.parentId:'#',
                text:res.userFullName,
                state: {selected: $scope.fsets.message.sendUsers[$scope.SelUserId]['WebuserId']&&$scope.fsets.message.sendUsers[$scope.SelUserId]['WebuserId'].indexOf(res.userId)!= -1?true:false}
            }
            return obj
        })
        narr = narr.concat(nearr)
        return narr
    }
}

function SetCheckGroupData(arr,$scope,narr=[]){
    if(Array.isArray(arr)){
        let narr = []
        arr.forEach(res=>{
            if(res.children){
                let carr = SetCheckGroupData(res.children,$scope)
                narr = narr.concat(carr)
            }
        })
        let nearr = arr.map(res=>{
            let obj = {
                id:res.id,
                parent:res.parentId?res.parentId:'#',
                text:res.name,
                state: {selected: $scope.fsets.message.sendUsers[$scope.SelUserId]['WebuserId']&&$scope.fsets.message.sendUsers[$scope.SelUserId]['WebuserId'].indexOf(res.id)!= -1?true:false}
            }
            return obj
        })
        narr = narr.concat(nearr)
        return narr
    }
}

// function setObjVal(obj,nobj){
//     for (let k in obj) {
//         if(obj[k]&&typeof(obj[k])=='object'){
//             if(Array.isArray(obj[k])){
//                 if(nobj[k]){
//                     obj[k] = nobj[k]
//                 }
//             }else{
//                 obj[k] = setObjVal(obj[k],nobj[k])
//             }
//         }else{
//             if(nobj[k]){
//                 obj[k] =  nobj[k]
//             }
//         }
//     }
//     return obj
// }

/**
 * 对象检测，提取相同值
 * @Author zhou69.1@qq.com 2020-12-16
 */
function setObjVal (defsets,valsets){
    if(typeof(defsets)=='object'){
        let newsets = defsets
        for(let key in valsets){
            if(valsets&&Object.prototype.toString.call(newsets[key])==='[object Object]'&&typeof(valsets[key])!='undefined'&&typeof(valsets[key])!='function'){
                newsets[key] = setObjVal(newsets[key],valsets[key])
            }else if(valsets&&typeof(valsets[key])!='undefined'){
                newsets[key] = valsets[key]
            }
        }
        defsets = newsets
    }
    return defsets
}

function deepClone(obj){
    let _toString = Object.prototype.toString
    if (!obj || typeof obj !== 'object') {
        return obj
    }
    if (_toString.call(obj) === '[object Date]') {
        return new Date(obj.getTime())
    }
    let result = Array.isArray(obj) ? [] : obj.constructor ? new obj.constructor() : {}

    for (let key in obj) {
    result[key] = deepClone(obj[key])
    }

    return result
}

var KisBpmChoiceSetsPopupCtrl = [ '$scope', '$http','$cookies', '$translate', function($scope, $http,$cookies, $translate) {

    $scope.typelist = ['超时设置','额外信息','表单权限'];
    $scope.usertypelist = ['人员','部门','岗位','群组'];
    let urllist = [
        KISBPM.URL.getPeo(),
        KISBPM.URL.getFirm(),
        KISBPM.URL.getGrop(),
        KISBPM.URL.getGrop(),
    ];
    $scope.status = {
        loading: false,
        showbox:0,
        jsonval:"",
        SelUsertype:0,
    };
    $scope.fsets = {
        backNode:[""],    // 驳回
        stopNode:0,     //终结
        isDealer:0,    //是否时经销商
        isParallelNode:0,    //是否并行
        tableAuth:{
            overtime:0,
            parentAuth:[""],    //可控制权限
            fieldAuth:[""],    //子标签控制
            showAuth:[""],    //显示节点ID
        },
        message:{
            sendUsers:[
                {
                    userId:null,     //用户id
                    WebuserName:null,     //用户名（前端用）
                    WebuserId:null,     //用户名id（前端用）
                    WebuserType:null,     //用户类型（前端用）
                    noticeIndex:"",    //模块值(前端用)
                    noticeApplication:"",    //模板：应用id
                    noticeChanel:'JC',    //模板： 默认JC
                    noticeType:null,    //模板： 消息类型
                }
            ]
        },
        noticeAction:[ //超时设置
            {
                notices:[ //预警
                    {
                        noticeApplication:"", //用途1注册/2忘记密码/3通用流程
                        noticeChanel:'JC',    //渠道类型默认JC
                        noticeType:"1",    //信息类型 1短信/2邮件/3企业微信
                    }
                ],
                serialCode:0,    //是否排除节假日
                time:'',    //间隔时间
                timeUnit:'D',    // D天，H小时，M分钟
                type:'',    // 1超时，2预警，3执行时间
            }
        ]
    }
    $scope.changebox = function(n){
        if($scope.status.showbox==0){
            let str = JSON.stringify($scope.fsets)
            str = str.replace(/\"\[/g,"[")
            str = str.replace(/\]\"/g,"]")
            str = str.replace(/\\\"/g,"\"")
            $scope.status.jsonval = str
        }else if($scope.status.showbox==1){
            $scope.fsets = setObjVal($scope.fsets,JSON.parse($scope.status.jsonval))
        }
        $scope.status.showbox = n
    }
    $scope.fsetscopy = deepClone($scope.fsets)
    $scope.typeindex = 0
    $scope.SelUserBox = false
    $scope.SelUserId = 0
    $scope.noticeapplication = []
    $scope.applicationOptions = []
    $scope.typeOptions = []
    // angular.element('#jstree').jstree({
    //     "plugins" : [ "wholerow", "checkbox" ]
    // })
    $scope.selUser = function(i){
        $scope.seluserindex($scope.status.SelUsertype)
        $scope.SelUserBox = true
        $scope.SelUserId = i
    }
    $scope.closeuserbox = function(){
        $scope.SelUserBox = false
    }
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
    $scope.seloptions = function(){
        $http({
            method:'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Authorization':$scope.getData("token")
            },
            url:KISBPM.URL.getActOptions()
        }).success(function (data, status, headers, config) {
            $scope.status.loading = false;
            if(data.data){
                let res = data.data
                $scope.applicationOptions = res.noticeApplication
                $scope.typeOptions = res.noticeType
            }
        }).error(function (data, status, headers, config) {
            $scope.error = {};
            $scope.status.loading = false;
        });
    }
    $scope.seluserindex = function(i){
        $scope.status.SelUsertype = i
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
                let arr = SetCheckData(data,$scope)
                $scope.status.loading = false;
                angular.element('#jstree').jstree({
                    'plugins':["wholerow","checkbox"],
                    'core' : {
                        "multiple": false,
                        'data' :arr,
                    }
                })
                angular.element('#jstree').on('changed.jstree',(e,data)=>{
                    if(data.node&&data.node['id']){
                        $scope.fsets.message.sendUsers[$scope.SelUserId]['WebuserId'] = data.node['id']
                        $scope.fsets.message.sendUsers[$scope.SelUserId]['WebuserName'] = data.node['text']
                        $scope.fsets.message.sendUsers[$scope.SelUserId]['WebuserType'] = $scope.status.SelUsertype
                        $scope.fsets.message.sendUsers[$scope.SelUserId]['userId'] = 'dpt_'+data.node['id']
                        $scope.closeuserbox()
                    }
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
                let arr = SetCheckUserData(data,$scope)
                $scope.status.loading = false;
                angular.element('#jstree').jstree({
                    'plugins':["wholerow","checkbox"],
                    'core' : {
                        "multiple": false,
                        'data' :arr,
                    }
                })
                angular.element('#jstree').on('changed.jstree',(e,data)=>{
                    if(data.node&&data.node['id']){
                        $scope.fsets.message.sendUsers[$scope.SelUserId]['WebuserId'] = data.node['id']
                        $scope.fsets.message.sendUsers[$scope.SelUserId]['WebuserName'] = data.node['text']
                        $scope.fsets.message.sendUsers[$scope.SelUserId]['WebuserType'] = $scope.status.SelUsertype
                        $scope.cacheval = 'user_'+data.node['id']
                        $scope.closeuserbox()
                    }
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
            //     let arr = SetCheckUserData(data,$scope)
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
                    'Authorization':$scope.getData("token")
                },
                url: url
            })
            .success(function (data, status, headers, config) {
                let arr = SetCheckGroupData(data,$scope)
                $scope.status.loading = false;
                angular.element('#jstree').jstree({
                    'plugins':["wholerow","checkbox"],
                    'core' : {
                        "multiple": false,
                        'data' :arr,
                    }
                })
                angular.element('#jstree').on('changed.jstree',(e,data)=>{
                    if(data.node&&data.node['id']){
                        $scope.fsets.message.sendUsers[$scope.SelUserId]['WebuserId'] = data.node['id']
                        $scope.fsets.message.sendUsers[$scope.SelUserId]['WebuserName'] = data.node['text']
                        $scope.fsets.message.sendUsers[$scope.SelUserId]['WebuserType'] = $scope.status.SelUsertype
                        $scope.cacheval = 'grp_'+data.node['id']
                        $scope.closeuserbox()
                    }
                })
            })
            .error(function (data, status, headers, config) {
                $scope.error = {};
                $scope.status.loading = false;
            });
        }
    }

    $scope.upindex = function(i){
        $scope.typeindex = i
    }
    $scope.addbox = function(obj,aobj){
        if(obj){
            let nobj = typeof(aobj[0])=='object'?{...aobj[0]}:''
            obj.push(nobj||'')
        }
    }
    $scope.delbox = function(obj,i){
        if(obj){
            obj.splice(i,1)
        }
    }
    $scope.upNotice = function(obj){
        let arr = obj['noticeIndex'].split('_')
        obj['noticeApplication'] = arr[1]
        obj['noticeType'] = arr[2]
        obj['noticeChanel'] = arr[3]
    }

    $scope.getnoticlist = function(){
        let params = {}
        $http({
                method: 'GET',
                data: params,
                ignoreErrors: true,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization':$scope.getData("token")
                },
                url: KISBPM.URL.getNoticeapplicationList()
            })
            .success(function (data, status, headers, config) {
                $scope.noticeapplication = data
                $scope.status.loading = false;
            })
            .error(function (data, status, headers, config) {
                $scope.error = {};
                $scope.status.loading = false;
            });
    }

    $scope.getnoticlist()
    $scope.seloptions()
    setTimeout(()=>{
        $scope.status.jsonval = $scope.property.value
        try{
            let str = $scope.property.value
            let nobj = setObjVal($scope.fsets,JSON.parse(str))
            $scope.fsets = nobj
        }catch(err){}
        $scope.upindex($scope.typeindex)
    },100)

    $scope.save = function() {
        if($scope.status.showbox==0){
            let str = JSON.stringify($scope.fsets)
            str = str.replace(/\"\[/g,"[")
            str = str.replace(/\]\"/g,"]")
            str = str.replace(/\\\"/g,"\"")
            $scope.property.value = str
        }else if($scope.status.showbox==1){
            $scope.property.value = $scope.status.jsonval
        }
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