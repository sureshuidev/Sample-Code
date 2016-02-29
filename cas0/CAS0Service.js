Class.Create({
    Name: "app.cas.page.cas0.CAS0Service",
    Parent: "component.base.BaseService",
    Imports: ["$rootScope", "__ChangeLocaleURL", "AnimateService", "BaseService", "BusyService", "LocaleSelectorService",
        "GeoService", "CAS0Service"],
    Initialize: function (clazz) {
        clazz._regions = null;
        return this.Parent.Initialize(clazz);
    },
    getRegions: function (callback) {
        BusyService.setBusy("cas0", Class("CalloutDirective").onBusyStart);
        BaseService.ajax(__ChangeLocaleURL, function (response, isError) {
            if (response && response.data && response.data.CAS) {
                BusyService.setDone("cas0", Class("CalloutDirective").onBusyEnd, 250);
                CAS0Service._regions = response.data.CAS;
                CAS0Service._countries = _.indexBy(CAS0Service._regions.regions.reduce(function (prev, curr, i, array) {
                    return prev.concat(curr.countries);
                }, []), "locale");
                (callback || angular.noop)(response.data.CAS);
            }
            if (isError) {
                BusyService.setDone("cas0", Class("CalloutDirective").onBusyEnd, 250);
                _error("Invalid API response");
            }
        }, true);
    },
    countryImgClip: function (spritePos) {
        return {
            "background-position": spritePos,
            "background-size": "500px 1000px"
        };
    },
    countryImg: function (spritePos) {
        return "cas.shared.countryFlag";
    },
    checkLocationService: function ($scope) {
        GeoService.getVisitorCountry(function () {
            BusyService.setBusy("locationService", Class("ButtonDirective").onBusyStart);
            $scope.$evalAsync();
        }, function (error, language, country) {
            if (error) {
                CAS0Service.geoStatus = "error";
            } else {
                LocaleSelectorService.changeLocale(language, country);
            }
            BusyService.setDone("locationService", Class("ButtonDirective").onBusyEnd);
            $scope.$evalAsync();
        });
    },
    fadeInGeoError: function () {
        var AnimateService = Class("AnimateService");
        return {
            enter: function (element, done) {
                var geoButton = $(".main-body-hero-text-sub");
                $(element).position({
                    my: "left top+60",
                    at: "left bottom",
                    of: geoButton
                });
                return AnimateService.animateCss(element, "fadeIn", function () {});
            }
        };
    }
});