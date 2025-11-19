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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { BaseControl, BaseControlParams } from "@docsvision/webclient/System/BaseControl";
import { ControlImpl } from "@docsvision/webclient/System/ControlImpl";
import { r } from "@docsvision/webclient/System/Readonly";
import React from "react";
import { Button, ButtonAlignModes } from "@docsvision/webclient/Helpers/Button";
var CheapTicketsControlParams = /** @class */ (function (_super) {
    __extends(CheapTicketsControlParams, _super);
    function CheapTicketsControlParams() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        r
    ], CheapTicketsControlParams.prototype, "getCheapTicketsLabel", void 0);
    __decorate([
        r
    ], CheapTicketsControlParams.prototype, "services", void 0);
    return CheapTicketsControlParams;
}(BaseControlParams));
export { CheapTicketsControlParams };
var CheapTicketsControl = /** @class */ (function (_super) {
    __extends(CheapTicketsControl, _super);
    function CheapTicketsControl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CheapTicketsControl.prototype.construct = function () {
        _super.prototype.construct.call(this);
        this.state.tickets = null;
        this.state.isExpanded = false;
        this.state.selectedTicketIndex = null;
        this.state.selectedTicketPrice = null;
        this.state.isLoading = false;
    };
    CheapTicketsControl.prototype.createParams = function () {
        return new CheapTicketsControlParams();
    };
    CheapTicketsControl.prototype.createImpl = function () {
        return new ControlImpl(this.props, this.state, this.renderControl.bind(this));
    };
    CheapTicketsControl.prototype.onButtonClick = function () {
        var _a, _b, _c, _d, _e, _f, _g;
        return __awaiter(this, void 0, void 0, function () {
            var dateFrom, dateTo, departure_at_format, return_at_format, cityName, tickets, error_1;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        console.log("All params:", this.params);
                        console.log("getCheapTicketsLabel:", this.params.getCheapTicketsLabel);
                        console.log("Params keys:", Object.keys(this.params));
                        dateFrom = (_b = (_a = this.layout.controls.tryGet("dateFrom")) === null || _a === void 0 ? void 0 : _a.params) === null || _b === void 0 ? void 0 : _b.value;
                        dateTo = (_d = (_c = this.layout.controls.tryGet("dateTo")) === null || _c === void 0 ? void 0 : _c.params) === null || _d === void 0 ? void 0 : _d.value;
                        departure_at_format = dateFrom ? dateFrom.toISOString().split('T')[0] : null;
                        return_at_format = dateTo ? dateTo.toISOString().split('T')[0] : null;
                        cityName = ((_g = (_f = (_e = this.layout.controls.tryGet("city")) === null || _e === void 0 ? void 0 : _e.params) === null || _f === void 0 ? void 0 : _f.value) === null || _g === void 0 ? void 0 : _g.name) || null;
                        if (!cityName) {
                            alert("Пожалуйста, выберите город");
                            return [2 /*return*/];
                        }
                        this.setState({ isLoading: true });
                        _h.label = 1;
                    case 1:
                        _h.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.params.services.activityPlanService.GetCheapTickets({
                                city: cityName,
                                departure_at: departure_at_format,
                                return_at: return_at_format
                            })];
                    case 2:
                        tickets = _h.sent();
                        if ((tickets === null || tickets === void 0 ? void 0 : tickets.success) && tickets.data && tickets.data.length > 0) {
                            tickets.data.sort(function (a, b) { return parseInt(a.price) - parseInt(b.price); });
                            this.setState({
                                tickets: tickets,
                                isExpanded: true,
                                isLoading: false
                            });
                        }
                        else {
                            alert("Билеты по указанным параметрам не найдены");
                            this.setState({
                                tickets: null,
                                isExpanded: true,
                                selectedTicketIndex: null,
                                selectedTicketPrice: null,
                                isLoading: false
                            });
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _h.sent();
                        alert("Ошибка при получении данных о билета:х");
                        this.setState({
                            tickets: null,
                            isExpanded: false,
                            selectedTicketIndex: null,
                            selectedTicketPrice: null,
                            isLoading: false
                        });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CheapTicketsControl.prototype.onTicketSelect = function (event) {
        var _a, _b;
        var selectedIndex = parseInt(event.target.value);
        if (selectedIndex >= 0 && ((_b = (_a = this.state.tickets) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b[selectedIndex])) {
            var selectedTicket = this.state.tickets.data[selectedIndex];
            this.setState({
                selectedTicketIndex: selectedIndex,
                selectedTicketPrice: selectedTicket.price
            });
        }
        else {
            this.setState({
                selectedTicketIndex: null,
                selectedTicketPrice: null
            });
        }
    };
    CheapTicketsControl.prototype.formatTicketOption = function (ticket, index) {
        var airline = ticket.airline || "Неизвестная авиакомпания";
        var flightNumber = ticket.flight_Number || "Н/Д";
        return "".concat(airline, " (\u0420\u0435\u0439\u0441 ").concat(flightNumber, ")");
    };
    CheapTicketsControl.prototype.renderControl = function () {
        var _this = this;
        var _a, _b;
        return (React.createElement("div", { style: { margin: "10px 0" } },
            React.createElement(Button, { text: this.state.isLoading ? "Поиск билетов..." : "Запросить стоимость билетов", align: ButtonAlignModes.Center, onClick: function () { return _this.onButtonClick(); }, disabled: this.state.isLoading }),
            this.state.isExpanded && (React.createElement("div", { style: {
                    marginTop: "15px",
                    padding: "15px",
                    border: "1px solid #ddd",
                    borderRadius: "5px",
                    backgroundColor: "#f9f9f9"
                } }, ((_a = this.state.tickets) === null || _a === void 0 ? void 0 : _a.data) && this.state.tickets.data.length > 0 ? (React.createElement("div", { style: { marginBottom: "15px" } },
                React.createElement("label", { htmlFor: "ticketSelector", style: {
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: "bold",
                        fontSize: "14px"
                    } }, "\u0412\u0430\u0440\u0438\u0430\u043D\u0442\u044B \u0431\u0438\u043B\u0435\u0442\u043E\u0432:"),
                React.createElement("select", { id: "ticketSelector", style: {
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        fontSize: "14px",
                        backgroundColor: "white"
                    }, value: (_b = this.state.selectedTicketIndex) !== null && _b !== void 0 ? _b : "", onChange: function (e) { return _this.onTicketSelect(e); } },
                    React.createElement("option", { value: "" }, "-- \u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0431\u0438\u043B\u0435\u0442 --"),
                    this.state.tickets.data.map(function (ticket, index) { return (React.createElement("option", { key: index, value: index }, _this.formatTicketOption(ticket, index))); })))) : (
            /* Сообщение, если билеты не найдены */
            React.createElement("div", { style: {
                    padding: "15px",
                    textAlign: "center",
                    color: "#666",
                    fontStyle: "italic"
                } }, "\u0411\u0438\u043B\u0435\u0442\u044B \u043F\u043E \u0443\u043A\u0430\u0437\u0430\u043D\u043D\u044B\u043C \u043F\u0430\u0440\u0430\u043C\u0435\u0442\u0440\u0430\u043C \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u044B")))),
            this.state.selectedTicketPrice != null && (React.createElement("div", { style: {
                    marginTop: "10px",
                    padding: "10px",
                    backgroundColor: "#e8f5e8",
                    border: "1px solid #4caf50",
                    borderRadius: "4px",
                    fontWeight: "bold"
                } },
                this.params.getCheapTicketsLabel,
                " ",
                this.state.selectedTicketPrice,
                " \u0440\u0443\u0431."))));
    };
    return CheapTicketsControl;
}(BaseControl));
export { CheapTicketsControl };
//# sourceMappingURL=CheapTicketsControl.js.map