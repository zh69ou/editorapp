
var KisBpmCustomSelCtrl = [ '$scope', '$modal', '$timeout', '$translate', function($scope, $modal, $timeout, $translate) {

    var opts = {
        template:  'editor-app/configuration/properties/custom-sel-write.html?version=' + Date.now(),
        scope: $scope
    };

    $modal(opts);
}];

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

var KisBpmCustomSelPopupCtrl = [ '$scope', '$http',"$cookies", '$translate', function($scope, $http, $cookies, $translate) {
    $scope.oplist = []
    $scope.opsellist = []
    $scope.opshow = false
    $scope.searchwd = ''
    $scope.setsobj = ["","customform","info",""]
    let con = $scope.property.value.split('/')
    if(Array.isArray(con)&&con.length==4){
        $scope.setsobj = con
    }
    $scope.showbox = function(obj){
        $scope.opshow = true
        console.log(obj)
    }
    $scope.searwords = function(words){
        $scope.opsellist = $scope.oplist.filter(res=>{
            return res.introduction.indexOf(words)>=0
        })
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
    $scope.getList = function(){
        let url = KISBPM.URL.getFormList()
        let arr = []
        let params = {
            introduction:''
        }
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
            $scope.oplist = data
            $scope.opsellist = deepClone(data)
        })
        .error(function (data, status, headers, config) {
            $scope.error = {};
            $scope.status.loading = false;
        });
    }

    $scope.getList()

    $scope.save = function() {
        let str = $scope.setsobj.join('/')
        // console.log(str)
        $scope.property.value = str
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