Class.Create({
    Name: "app.cas.partial.viewcoverage.ViewCoverageTriggerDirective",
    Parent: "component.base.BaseDirective",
    Imports: ["ViewCoverageService"],
    directiveName: function () {
        return "awViewCoverageTrigger";
    },
    directiveDependencies: function () {
        return ["$window", "$rootScope"];
    },
    directiveDecl: function () {
        this.restrict = "E";
        this.transclude = true;
        this.replace = true;
        this.templateUrl = this.ResolveTemplate("app/cas/partial/viewcoverage/LGViewCoverageTrigger.html");
        this.scope = {
            layout: "@",
            serialNum: "=",
            directiveNameForBusy: "@",
            grid: "@",
            callback: "&adjustHeightsCallback"
        };
    },
    link: function (scope, element, attr) {
        scope.showCoverageSection = ViewCoverageService.shouldShowCoverageSection(scope.serialNum);
        scope.showCov = function () {
            ViewCoverageService.getCoverage(scope.serialNum, function (data) {
                scope.showCoverageSection = true;
                ViewCoverageService.showCoverageSection(scope.serialNum);
                scope.callback();
            });
            scope.$evalAsync();
        };
        scope.hideCov = function () {
            scope.showCoverageSection = false;
            ViewCoverageService.hideCoverageSection(scope.serialNum);
        };
    }
});