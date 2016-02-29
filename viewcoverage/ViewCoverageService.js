/**
 * @ngdoc service
 * @name ViewCoverage
 *
 * @description
 * This service allows you call view coverage API.
 *
 * @snum
 * Serial Number for which you require coverage. e.g. "2111178647"
 *
 *
 * @callback
 * callback that gets executed on successful API call
 */
Class.Create({
    Name: "app.cas.partial.viewcoverage.ViewCoverageService",
    Parent: "component.base.BaseService",
    Initialize: function (clazz) {
        clazz.serialNumberCollection = {};
        return this.Parent.Initialize(clazz);
    },
    Imports: ["$rootScope", "ViewCoverageService", "BusyService", "ResourceService", "__ViewCoverageURL"],
    // serviceDependencies : function () {
    //     return ['$rootScope', '$scope', '$http'];
    // },
    // [TODO: Check with Chris on how to display coverage API failure.]
    showCoverageSection: function (snum) {
        if (!this.serialNumberCollection.hasOwnProperty(snum)) {
            this.serialNumberCollection[snum] = {};
        }
        this.serialNumberCollection[snum].show = true;
    },
    hideCoverageSection: function (snum) {
        if (!this.serialNumberCollection.hasOwnProperty(snum)) {
            this.serialNumberCollection[snum] = {};
        }
        this.serialNumberCollection[snum].show = false;
    },
    shouldShowCoverageSection: function (snum) {
        if (this.serialNumberCollection.hasOwnProperty(snum)) {
            return this.serialNumberCollection[snum].show;
        } else {
            return false;
        }
    },
    setCachedCoverageInfo: function (snum, viewCoverage) {
        if (!this.serialNumberCollection.hasOwnProperty(snum)) {
            this.serialNumberCollection[snum] = {};
        }
        if (viewCoverage && _undefined(viewCoverage.errorDesc)) {
            viewCoverage.technicalSupportIcon = "Active" === _get(viewCoverage, "technicalSupport") ? "cas.coverage.active" :
                "cas.coverage.expired";
            if ("Active" === _get(viewCoverage, "supportCoverage")) {
                viewCoverage.supportCoverageIcon = "cas.coverage.active";
            } else {
                if ("CL" === _get(viewCoverage, "supportCoverage")) {
                    viewCoverage.supportCoverageIcon = "cas.coverage.clvw";
                } else {
                    viewCoverage.supportCoverageIcon = "cas.coverage.expired";
                }
            }
            viewCoverage.serviceCoverageDesc = viewCoverage.supportCoverageDesc;
            if ("L" === viewCoverage.serialNumberStatusCode) {
                //Loaner
                viewCoverage.serviceCoverageDesc = ResourceService.localized("el.exp2.coverage.loaner");
                viewCoverage.supportCoverageIcon = "cas.coverage.clvw";
            }
        }
        this.serialNumberCollection[snum].data = viewCoverage;
    },
    getCachedCoverageInfo: function (snum) {
        if (this.serialNumberCollection.hasOwnProperty(snum)) {
            if (this.serialNumberCollection[snum].hasOwnProperty("data")) {
                return this.serialNumberCollection[snum].data;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    clearCachedCoverageInfo: function () {
        this.serialNumberCollection = {};
    },
    // Still not sure about caching it in this call. BUT...
    getCoverage: function (snum, callback) {
        BusyService.setBusy(snum);
        var coverageData = ViewCoverageService.getCachedCoverageInfo(snum);
        var callbackWrapper = function (response) {
            BusyService.setDone(snum);
            if (response.errorDetail && response.errorDetail.errorDesc) {
                if (_undefined(response.data)) {
                    response.data = {};
                }
                response.data.errorDesc = response.errorDetail.errorDesc;
            }
            ViewCoverageService.setCachedCoverageInfo(snum, response.data);
            (callback || angular.noop)(response.data);
        };
        if (!coverageData) {
            // No cache
            BaseService.ajax(__ViewCoverageURL, callbackWrapper, true, true, {
                serialNumber: snum
            });
        } else {
            callbackWrapper(ViewCoverageService.getCachedCoverageInfo(snum));
            ViewCoverageService.setCachedCoverageInfo(snum, coverageData);
            (callback || angular.noop)(coverageData);
        }
    }
});