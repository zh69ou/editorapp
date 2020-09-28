
var KisBpmChoiceFirmCtrl = [ '$scope', '$modal', '$timeout', '$translate', function($scope, $modal, $timeout, $translate) {

    var opts = {
        template:  'editor-app/configuration/properties/choice-firm-write.html?version=' + Date.now(),
        scope: $scope
    };

    $modal(opts);
}];

var KisBpmChoiceFirmPopupCtrl = [ '$scope', '$http', '$translate', function($scope, $http, $translate) {

    $scope.typelist = ['人员','部门','岗位','群组'];
    $scope.typeindex = 0
    // angular.element('#jstree').jstree({
    //     "plugins" : [ "wholerow", "checkbox" ]
    // })
    $scope.upindex = function(i){
        $scope.typeindex = i
        angular.element('#jstree').jstree({
            'plugins':["wholerow","checkbox"],
            'core' : {
                'data' :[
                    {
                        "id":1,
                        "text":'aaa'
                    },
                    {
                        "id":2,
                        "text":'bbb',
                        "children":[
                            {
                                "id":3,
                                "text":'ccc'
                            },
                            {
                                "id":4,
                                "text":'fff'
                            }
                        ]
                    },
                    {
                        "id":5,
                        "text":'eee',
                        "children":[
                            {
                                "id":7,
                                "text":'ccc'
                            },
                            {
                                "id":8,
                                "text":'www'
                            }
                        ]
                    }
                ],
            }
        }).on('changed.jstree',(e,data)=>{
            console.log('data',data.selected)
        })
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