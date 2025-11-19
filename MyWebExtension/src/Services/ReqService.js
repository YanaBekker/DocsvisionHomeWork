var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { ControllerBase, HttpMethods } from "@docsvision/webclient/System/ControllerBase";
var ReqService = /** @class */ (function (_super) {
    __extends(ReqService, _super);
    function ReqService(services) {
        var _this = _super.call(this, services) || this;
        _this.services = services;
        _this.controllerName = "Req";
        return _this;
    }
    ReqService.prototype.ChangeCityInfo = function (request) {
        return _super.prototype.doRequest.call(this, {
            controller: this.controllerName,
            action: 'ChangeCityInfo',
            isApi: true,
            method: HttpMethods.Post,
            data: request,
            options: { isShowOverlay: true }
        });
    };
    ReqService.prototype.GetReqName = function (documentId) {
        return _super.prototype.doRequest.call(this, {
            controller: this.controllerName,
            action: 'GetReqName',
            isApi: true,
            method: HttpMethods.Post,
            data: documentId,
            options: { isShowOverlay: true }
        });
    };
    ReqService.prototype.ChangeDirPhoneInfo = function (request) {
        return _super.prototype.doRequest.call(this, {
            controller: this.controllerName,
            action: 'ChangeDirPhoneInfo',
            isApi: true,
            method: HttpMethods.Post,
            data: request,
            options: { isShowOverlay: true }
        });
    };
    ReqService.prototype.GetCheapTickets = function (request) {
        return _super.prototype.doRequest.call(this, {
            controller: this.controllerName,
            action: 'GetCheapTickets',
            isApi: true,
            method: HttpMethods.Post,
            data: request,
            options: { isShowOverlay: true }
        });
    };
    return ReqService;
}(ControllerBase));
export { ReqService };
//# sourceMappingURL=ReqService.js.map