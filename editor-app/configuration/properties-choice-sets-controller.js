
var KisBpmChoiceSetsCtrl = [ '$scope', '$modal', '$timeout', '$translate', function($scope, $modal, $timeout, $translate) {

    var opts = {
        template:  'editor-app/configuration/properties/choice-sets-write.html?version=' + Date.now(),
        scope: $scope
    };

    $modal(opts);
}];

function setObjVal(obj,nobj){
    for (let k in obj) {
        if(obj[k]&&typeof(obj[k])=='object'){
            if(Array.isArray(obj[k])){
                if(nobj[k]){
                    obj[k] = nobj[k].concat(obj[k])
                }
            }else{
                obj[k] = setObjVal(obj[k],nobj[k])
            }
        }else{
            obj[k] =  nobj[k]
        }
    }
    return obj
}

var KisBpmChoiceSetsPopupCtrl = [ '$scope', '$http', '$translate', function($scope, $http, $translate) {

    $scope.typelist = ['超时设置','额外信息','表单权限'];
    let urllist = [
        KISBPM.URL.getPeo(),
        KISBPM.URL.getFirm(),
    ];
    $scope.status = {
        loading: false
    };
    $scope.fsets = {
        tableAuth:{
            overtime:0,
            backNode:[""],
            stopNode:0,
            isDealer:0,
            parentAuth:[""],
            fieldAuth:[""],
            showAuth:[""],
        }
    }
    $scope.typeindex = 0
    // angular.element('#jstree').jstree({
    //     "plugins" : [ "wholerow", "checkbox" ]
    // })
    $scope.treebox = null
    $scope.upindex = function(i){
        $scope.typeindex = i
    }
    $scope.addbox = function(obj){
        if(obj){
            obj.push('')
        }
    }
    $scope.delbox = function(obj,i){
        if(obj){
            obj.splice(i,1)
        }
    }

    setTimeout(()=>{
        try{
            $scope.fsets = setObjVal($scope.fsets,JSON.parse($scope.property.value))
        }catch(err){}
        $scope.upindex($scope.typeindex)
    },100)

    $scope.save = function() {
        $scope.property.value = JSON.stringify($scope.fsets)
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