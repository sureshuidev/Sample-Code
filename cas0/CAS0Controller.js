Class.Create({
    Name: "app.cas.page.cas0.CAS0Controller",
    Parent: "component.base.BaseController",
    controllerDependencies: function () {
        return ["$scope", "CAS0Service", "DeepDiveService"];
    },
    Imports: ["CAS0Service", "DeepDiveService"],
    main: function ($scope, CAS0Service) {
        this.CASController = $scope.$parent;
        var _this = this;
        CAS0Service.getRegions(function (regions) {
            $scope._regions = regions;
            var selectionsObj = DeepDiveService.bootstrappedScope();
            if (!_.isEmpty(selectionsObj)) {
                if (selectionsObj && selectionsObj.regionCode) {
                    var firstLevel = _.find($scope._regions.regions, function (region) {
                        if (selectionsObj.regionCode.toLowerCase() === region.regionCode.toLowerCase()) {
                            return region;
                        }
                    });
                    if (firstLevel) {
                        _this.CASController.selectFirstLevel("Region", firstLevel, 0);
                    }
                }
            }
        });
        CAS0Service.geoStatus = "unknown";
    }
});