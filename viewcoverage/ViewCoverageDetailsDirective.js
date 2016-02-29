Class.Create({
    Name: "app.cas.partial.viewcoverage.ViewCoverageDetailsDirective",
    Parent: "component.base.BaseDirective",
    Imports: ["ViewCoverageService"],
    directiveName: function () {
        return "awViewCoverageDetails";
    },
    directiveDependencies: function () {
        return ["$window", "$rootScope"];
    },
    directiveDecl: function () {
        this.restrict = "E";
        this.transclude = true;
        this.replace = true;
        this.templateUrl = function (elem, attrs) {
            if ("undefined" === typeof attrs.layout) {
                return this.ResolveTemplate("app/cas/partial/viewcoverage", "ViewCoverageDetails.html", ["XS", "XS", "XS",
                    "LG"]);
            } else {
                return this.ResolveTemplate("app/cas/partial/viewcoverage", _.capitalize(attrs.layout) +
                    "ViewCoverageDetails.html", ["LG", "LG", "LG", "LG"]);
            }
        };
        this.scope = {
            layout: "@",
            grid: "@",
            viewCoverage: "=",
            freeStanding: "@",
            // Free standing directive that doesnt require view coverage trigger
            serialNumber: "@"
        };
    },
    link: function (scope, element, attr) {
        if (angular.isUndefined(scope.freeStanding)) {
            scope.freeStanding = false;
        }
        scope.showCoverageSection = false;
        if (scope.freeStanding && scope.serialNumber) {
            ViewCoverageService.getCoverage(scope.serialNumber, function (data) {
                scope.showCoverageSection = true;
                ViewCoverageService.showCoverageSection(scope.serialNumber);
                ViewCoverageService.setCachedCoverageInfo(scope.serialNumber, data);
                scope.$evalAsync();
            }, "ViewCoverageDetailsDirective");
        }
        scope.goToSelfSolve = function (fullCoverageUrl) {
            ViewCoverageService.getCachedCoverageInfo(scope.serialNumber);
            // var external_URL = "https://oss-uata.apple.com/wcResults.do=" + scope.serialNumber;
            window.open(fullCoverageUrl);
        };
    }
});