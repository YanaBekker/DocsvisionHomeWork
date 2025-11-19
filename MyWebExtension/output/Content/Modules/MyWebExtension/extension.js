define(['@docsvision/webclient/System/ExtensionManager', 'tslib', '@docsvision/webclient/Helpers/MessageBox/MessageBox', '@docsvision/webclient/System/$MessageBox', '@docsvision/webclient/System/ServiceUtils', '@docsvision/webclient/System/Service', '@docsvision/webclient/System/ControllerBase', '@docsvision/webclient/System/BaseControl', '@docsvision/webclient/System/ControlImpl', '@docsvision/webclient/System/Readonly', 'react', '@docsvision/webclient/Helpers/Button'], (function (ExtensionManager, tslib, MessageBox, $MessageBox, ServiceUtils, Service, ControllerBase, BaseControl, ControlImpl, Readonly, React, Button) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

    var $ReqService = ServiceUtils.serviceName(function (x) { return x.activityPlanService; });

    var RequestBusinessTripLogic = /** @class */ (function () {
        function RequestBusinessTripLogic() {
        }
        /**
         * Проверяет возможность сохранения карточки для поля основание для поездки
         * @param layout Разметка карточки
         * @returns true если сохранение разрешено, false если запрещено
        */
        RequestBusinessTripLogic.prototype.CheckPossibility = function (layout) {
            return tslib.__awaiter(this, void 0, void 0, function () {
                var tripReasonField, tripReasonValue;
                return tslib.__generator(this, function (_a) {
                    tripReasonField = layout.controls.tryGet("description");
                    if (!tripReasonField) {
                        console.warn("Контролы описания не найдены");
                        return [2 /*return*/];
                    }
                    tripReasonValue = tripReasonField.value;
                    if (!tripReasonValue || tripReasonValue.toString().trim() === "") {
                        MessageBox.MessageBox.ShowWarning("Сохранение отклонено: поле основание для поездки должно быть заполнено");
                        return [2 /*return*/, false];
                    }
                    return [2 /*return*/, true];
                });
            });
        };
        /**
         * Проверяет валидность дат: дата начала < даты окончания поездки
         * @param layout Разметка карточки
         * @returns true если дата начала < даты окончания поездки, false если дата начала >= даты окончания поездки
        */
        RequestBusinessTripLogic.prototype.CheckDateTrip = function (sender) {
            return tslib.__awaiter(this, void 0, void 0, function () {
                var layout, startDateControl, endDateControl, startDateValue, endDateValue;
                return tslib.__generator(this, function (_a) {
                    layout = sender.layout;
                    startDateControl = layout.controls.tryGet("dateFrom");
                    endDateControl = layout.controls.tryGet("dateTo");
                    if (!startDateControl || !endDateControl) {
                        console.warn("Контролы дат не найдены");
                        return [2 /*return*/];
                    }
                    startDateValue = startDateControl.params.value;
                    endDateValue = endDateControl.params.value;
                    if (!startDateValue || !endDateValue) {
                        return [2 /*return*/];
                    }
                    if (endDateValue < startDateValue) {
                        startDateControl.params.value = new Date();
                        endDateControl.params.value = new Date();
                        MessageBox.MessageBox.ShowWarning("Ошибка с датами: дата начала командировки не может быть позже даты окончания");
                    }
                    return [2 /*return*/];
                });
            });
        };
        /**
         * Отображает информацию о карточке
         * @param layout Разметка карточки
        */
        RequestBusinessTripLogic.prototype.showInformation = function (sender) {
            var _a, _b, _c, _d, _e, _f;
            return tslib.__awaiter(this, void 0, void 0, function () {
                var docName, regDate, dateFrom, dateTo, reason, city, formatDate, stripHtml, lines;
                return tslib.__generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            docName = ((_a = sender.layout.controls.tryGet("documentName").params) === null || _a === void 0 ? void 0 : _a.value) || "Не указано";
                            regDate = ((_b = sender.layout.controls.tryGet("regDate").params) === null || _b === void 0 ? void 0 : _b.value) || "Не указана";
                            dateFrom = ((_c = sender.layout.controls.tryGet("dateFrom").params) === null || _c === void 0 ? void 0 : _c.value) || "Не указана";
                            dateTo = ((_d = sender.layout.controls.tryGet("dateTo").params) === null || _d === void 0 ? void 0 : _d.value) || "Не указана";
                            reason = ((_e = sender.layout.controls.tryGet("description").params) === null || _e === void 0 ? void 0 : _e.value) || "Не указано";
                            city = ((_f = sender.layout.controls.tryGet("city").params.value) === null || _f === void 0 ? void 0 : _f.name) || "Не указано";
                            formatDate = function (dateValue) {
                                if (!dateValue || dateValue === "Не указана")
                                    return dateValue;
                                var date = new Date(dateValue);
                                return date.toLocaleDateString('ru-RU', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                });
                            };
                            stripHtml = function (html) {
                                if (!html || html === "Не указано")
                                    return html;
                                return html.replace(/<[^>]*>/g, '');
                            };
                            lines = [
                                "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430: " + docName,
                                "\u0414\u0430\u0442\u0430 \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u044F: " + formatDate(regDate),
                                "\u0414\u0430\u0442\u0430 \u0441: " + formatDate(dateFrom),
                                "\u0414\u0430\u0442\u0430 \u043F\u043E: " + formatDate(dateTo),
                                "\u041E\u0441\u043D\u043E\u0432\u0430\u043D\u0438\u0435: " + stripHtml(reason),
                                "\u0413\u043E\u0440\u043E\u0434: " + city
                            ].filter(Boolean).join('\n');
                            return [4 /*yield*/, MessageBox.MessageBox.ShowInfo(lines)];
                        case 1:
                            _g.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        RequestBusinessTripLogic.prototype.performAction = function (layout) {
            return tslib.__awaiter(this, void 0, void 0, function () {
                var response;
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, layout.getService($ReqService).GetReqName(layout.cardInfo.id)];
                        case 1:
                            response = _a.sent();
                            layout.getService($MessageBox.$MessageBox).showInfo(response);
                            return [2 /*return*/];
                    }
                });
            });
        };
        return RequestBusinessTripLogic;
    }());

    /**
     * Событие перед сохранением карточки
     * @param layout разметка
     * @param args аргументы
    */
    function ddRequestBusinessTrip_onSaveCard(layout, args) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var logic;
            return tslib.__generator(this, function (_a) {
                if (!layout) {
                    return [2 /*return*/];
                }
                logic = new RequestBusinessTripLogic();
                if (logic.CheckPossibility(layout)) {
                    args.accept();
                    return [2 /*return*/];
                }
                args.cancel();
                return [2 /*return*/];
            });
        });
    }
    /**
     * Событие проверки валидоности даты командировки
     * @param layout разметка
     * @param args аргументы
    */
    function ddRequestBusinessTrip_DateTimePicker_onDateChanged(sender) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var logic;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!sender) {
                            return [2 /*return*/];
                        }
                        logic = new RequestBusinessTripLogic();
                        return [4 /*yield*/, logic.CheckDateTrip(sender)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    /**
     * Событие вывод информации по карточке при нажатии на кнопку
     * @param layout разметка
    */
    function ddRequestBusinessTrip_Button_onClick(sender) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var logic;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!sender) {
                            return [2 /*return*/];
                        }
                        logic = new RequestBusinessTripLogic();
                        return [4 /*yield*/, logic.showInformation(sender)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    function ddRequestTrip_action1_onClick(sender) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            return tslib.__generator(this, function (_a) {
                new RequestBusinessTripLogic().performAction(sender.layout);
                return [2 /*return*/];
            });
        });
    }
    //export async function ddRequestTrip_getСheapTickets_onClick(sender: CustomButton) {
    //    new RequestBusinessTripLogic().GetСheapTickets(sender.layout);
    //}
    //export async function ddRequestTrip_ChangeDirPhoneInfo_onDateChanged(sender: CustomButton) {
    //    new RequestBusinessTripLogic().ChangeDirPhoneInfo(sender.layout);
    //}
    //export async function ddRequestTrip_ChangeCityInfo_onDateChanged(sender: CustomButton) {
    //    new RequestBusinessTripLogic().ChangeCityInfo(sender.layout);
    //}

    var RequestBusinessTripEventHandles = /*#__PURE__*/Object.freeze({
        __proto__: null,
        ddRequestBusinessTrip_onSaveCard: ddRequestBusinessTrip_onSaveCard,
        ddRequestBusinessTrip_DateTimePicker_onDateChanged: ddRequestBusinessTrip_DateTimePicker_onDateChanged,
        ddRequestBusinessTrip_Button_onClick: ddRequestBusinessTrip_Button_onClick,
        ddRequestTrip_action1_onClick: ddRequestTrip_action1_onClick
    });

    var ReqService = /** @class */ (function (_super) {
        tslib.__extends(ReqService, _super);
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
                method: ControllerBase.HttpMethods.Post,
                data: request,
                options: { isShowOverlay: true }
            });
        };
        ReqService.prototype.GetReqName = function (documentId) {
            return _super.prototype.doRequest.call(this, {
                controller: this.controllerName,
                action: 'GetReqName',
                isApi: true,
                method: ControllerBase.HttpMethods.Post,
                data: documentId,
                options: { isShowOverlay: true }
            });
        };
        ReqService.prototype.ChangeDirPhoneInfo = function (request) {
            return _super.prototype.doRequest.call(this, {
                controller: this.controllerName,
                action: 'ChangeDirPhoneInfo',
                isApi: true,
                method: ControllerBase.HttpMethods.Post,
                data: request,
                options: { isShowOverlay: true }
            });
        };
        ReqService.prototype.GetCheapTickets = function (request) {
            return _super.prototype.doRequest.call(this, {
                controller: this.controllerName,
                action: 'GetCheapTickets',
                isApi: true,
                method: ControllerBase.HttpMethods.Post,
                data: request,
                options: { isShowOverlay: true }
            });
        };
        return ReqService;
    }(ControllerBase.ControllerBase));

    var CheapTicketsControlParams = /** @class */ (function (_super) {
        tslib.__extends(CheapTicketsControlParams, _super);
        function CheapTicketsControlParams() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        tslib.__decorate([
            Readonly.r
        ], CheapTicketsControlParams.prototype, "getCheapTicketsLabel", void 0);
        tslib.__decorate([
            Readonly.r
        ], CheapTicketsControlParams.prototype, "services", void 0);
        return CheapTicketsControlParams;
    }(BaseControl.BaseControlParams));
    var CheapTicketsControl = /** @class */ (function (_super) {
        tslib.__extends(CheapTicketsControl, _super);
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
            return new ControlImpl.ControlImpl(this.props, this.state, this.renderControl.bind(this));
        };
        CheapTicketsControl.prototype.onButtonClick = function () {
            var _a, _b, _c, _d, _e, _f, _g;
            return tslib.__awaiter(this, void 0, void 0, function () {
                var dateFrom, dateTo, departure_at_format, return_at_format, cityName, tickets;
                return tslib.__generator(this, function (_h) {
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
                            _h.sent();
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
            return airline + " (\u0420\u0435\u0439\u0441 " + flightNumber + ")";
        };
        CheapTicketsControl.prototype.renderControl = function () {
            var _this = this;
            var _a, _b;
            return (React__default["default"].createElement("div", { style: { margin: "10px 0" } },
                React__default["default"].createElement(Button.Button, { text: this.state.isLoading ? "Поиск билетов..." : "Запросить стоимость билетов", align: Button.ButtonAlignModes.Center, onClick: function () { return _this.onButtonClick(); }, disabled: this.state.isLoading }),
                this.state.isExpanded && (React__default["default"].createElement("div", { style: {
                        marginTop: "15px",
                        padding: "15px",
                        border: "1px solid #ddd",
                        borderRadius: "5px",
                        backgroundColor: "#f9f9f9"
                    } }, ((_a = this.state.tickets) === null || _a === void 0 ? void 0 : _a.data) && this.state.tickets.data.length > 0 ? (React__default["default"].createElement("div", { style: { marginBottom: "15px" } },
                    React__default["default"].createElement("label", { htmlFor: "ticketSelector", style: {
                            display: "block",
                            marginBottom: "8px",
                            fontWeight: "bold",
                            fontSize: "14px"
                        } }, "\u0412\u0430\u0440\u0438\u0430\u043D\u0442\u044B \u0431\u0438\u043B\u0435\u0442\u043E\u0432:"),
                    React__default["default"].createElement("select", { id: "ticketSelector", style: {
                            width: "100%",
                            padding: "10px",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            fontSize: "14px",
                            backgroundColor: "white"
                        }, value: (_b = this.state.selectedTicketIndex) !== null && _b !== void 0 ? _b : "", onChange: function (e) { return _this.onTicketSelect(e); } },
                        React__default["default"].createElement("option", { value: "" }, "-- \u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0431\u0438\u043B\u0435\u0442 --"),
                        this.state.tickets.data.map(function (ticket, index) { return (React__default["default"].createElement("option", { key: index, value: index }, _this.formatTicketOption(ticket, index))); })))) : (
                /* Сообщение, если билеты не найдены */
                React__default["default"].createElement("div", { style: {
                        padding: "15px",
                        textAlign: "center",
                        color: "#666",
                        fontStyle: "italic"
                    } }, "\u0411\u0438\u043B\u0435\u0442\u044B \u043F\u043E \u0443\u043A\u0430\u0437\u0430\u043D\u043D\u044B\u043C \u043F\u0430\u0440\u0430\u043C\u0435\u0442\u0440\u0430\u043C \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u044B")))),
                this.state.selectedTicketPrice != null && (React__default["default"].createElement("div", { style: {
                        marginTop: "10px",
                        padding: "10px",
                        backgroundColor: "#e8f5e8",
                        border: "1px solid #4caf50",
                        borderRadius: "4px",
                        fontWeight: "bold"
                    } },
                    "\u0421\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C \u0431\u0438\u043B\u0435\u0442\u0430:  ",
                    this.state.selectedTicketPrice,
                    " \u0440\u0443\u0431."))));
        };
        return CheapTicketsControl;
    }(BaseControl.BaseControl));

    ExtensionManager.extensionManager.registerExtension({
        name: "MyWebExtension",
        version: "1.0",
        globalEventHandlers: [RequestBusinessTripEventHandles],
        layoutServices: [Service.Service.fromFactory($ReqService, function (services) { return new ReqService(services); })],
        controls: [{
                controlTypeName: "GetCheapTicketsControl", constructor: CheapTicketsControl
            }]
    });

}));
//# sourceMappingURL=extension.js.map
