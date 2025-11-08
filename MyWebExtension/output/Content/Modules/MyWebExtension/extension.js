define(['@docsvision/webclient/System/ExtensionManager', 'tslib', '@docsvision/webclient/Helpers/MessageBox/MessageBox', '@docsvision/webclient/System/$MessageBox', '@docsvision/webclient/System/ServiceUtils', '@docsvision/webclient/System/Service', '@docsvision/webclient/System/ControllerBase'], (function (ExtensionManager, tslib, MessageBox, $MessageBox, ServiceUtils, Service, ControllerBase) { 'use strict';

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
        return ReqService;
    }(ControllerBase.ControllerBase));

    ExtensionManager.extensionManager.registerExtension({
        name: "MyWebExtension",
        version: "1.0",
        globalEventHandlers: [RequestBusinessTripEventHandles],
        layoutServices: [Service.Service.fromFactory($ReqService, function (services) { return new ReqService(services); })],
        controls: []
    });

}));
//# sourceMappingURL=extension.js.map
