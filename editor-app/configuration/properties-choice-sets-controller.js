
var KisBpmChoiceSetsCtrl = [ '$scope', '$modal', '$timeout', '$translate', function($scope, $modal, $timeout, $translate) {

    var opts = {
        template:  'editor-app/configuration/properties/choice-sets-write.html?version=' + Date.now(),
        scope: $scope
    };

    $modal(opts);
}];

var KisBpmChoiceSetsPopupCtrl = [ '$scope', '$http', '$translate', function($scope, $http, $translate) {

    $scope.typelist = ['超时设置','额外信息','表单权限'];
    let urllist = [
        KISBPM.URL.getPeo(),
        KISBPM.URL.getFirm(),
    ];
    $scope.status = {
        loading: false
    };
    $scope.fsets = null
    $scope.typeindex = 0
    // angular.element('#jstree').jstree({
    //     "plugins" : [ "wholerow", "checkbox" ]
    // })
    $scope.treebox = null
    $scope.upindex = function(i){
        console.log($scope.fsets)
        $scope.typeindex = i
    }

    setTimeout(()=>{
        try{
            $scope.fsets = JSON.parse($scope.property.value)
        }catch(err){}
        $scope.upindex($scope.typeindex)
    },100)

    $scope.save = function() {

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