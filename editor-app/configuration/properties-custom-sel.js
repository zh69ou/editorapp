
var KisBpmCustomSelCtrl = [ '$scope', '$modal', '$timeout', '$translate', function($scope, $modal, $timeout, $translate) {

    var opts = {
        template:  'editor-app/configuration/properties/custom-sel-write.html?version=' + Date.now(),
        scope: $scope
    };

    $modal(opts);
}];

var KisBpmCustomSelPopupCtrl = [ '$scope', '$http', '$translate', function($scope, $http, $translate) {

    $scope.typelist = ['人员','部门','岗位','群组'];
    $scope.typeindex = 0
    // angular.element('#jstree').jstree({
    //     "plugins" : [ "wholerow", "checkbox" ]
    // })
    $scope.treebox = null
    $scope.getList = function(){
        let url = KISBPM.URL.getCustomList()
        let arr = []
        let params = {}
        $http({
            method: 'POST',
            data: params,
            ignoreErrors: true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Authorization':window.localStorage.getItem('token')
            },
            // transformRequest: function (obj) {
            //     var str = [];
            //     for (var p in obj) {
            //     str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            //     }
            //     return str.join("&");
            // },
            url: url
        })
        .success(function (data, status, headers, config) {
            console.log(data)
        })
        .error(function (data, status, headers, config) {
            $scope.error = {};
            $scope.status.loading = false;
        });
    }

    setTimeout(()=>{
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