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
import { MessageBox } from "@docsvision/webclient/Helpers/MessageBox/MessageBox";
import { $MessageBox } from "@docsvision/webclient/System/$MessageBox";
import { $ReqService } from "../Services/Interfaces/IReqService";
var RequestBusinessTripLogic = /** @class */ (function () {
    function RequestBusinessTripLogic() {
    }
    /**
     * Проверяет возможность сохранения карточки для поля основание для поездки
     * @param layout Разметка карточки
     * @returns true если сохранение разрешено, false если запрещено
    */
    RequestBusinessTripLogic.prototype.CheckPossibility = function (layout) {
        return __awaiter(this, void 0, void 0, function () {
            var tripReasonField, tripReasonValue;
            return __generator(this, function (_a) {
                tripReasonField = layout.controls.tryGet("description");
                if (!tripReasonField) {
                    console.warn("Контролы описания не найдены");
                    return [2 /*return*/];
                }
                tripReasonValue = tripReasonField.value;
                if (!tripReasonValue || tripReasonValue.toString().trim() === "") {
                    MessageBox.ShowWarning("Сохранение отклонено: поле основание для поездки должно быть заполнено");
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
        return __awaiter(this, void 0, void 0, function () {
            var layout, startDateControl, endDateControl, startDateValue, endDateValue;
            return __generator(this, function (_a) {
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
                    MessageBox.ShowWarning("Ошибка с датами: дата начала командировки не может быть позже даты окончания");
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
        return __awaiter(this, void 0, void 0, function () {
            var docName, regDate, dateFrom, dateTo, reason, city, formatDate, stripHtml, lines;
            return __generator(this, function (_g) {
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
                            "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430: ".concat(docName),
                            "\u0414\u0430\u0442\u0430 \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u044F: ".concat(formatDate(regDate)),
                            "\u0414\u0430\u0442\u0430 \u0441: ".concat(formatDate(dateFrom)),
                            "\u0414\u0430\u0442\u0430 \u043F\u043E: ".concat(formatDate(dateTo)),
                            "\u041E\u0441\u043D\u043E\u0432\u0430\u043D\u0438\u0435: ".concat(stripHtml(reason)),
                            "\u0413\u043E\u0440\u043E\u0434: ".concat(city)
                        ].filter(Boolean).join('\n');
                        return [4 /*yield*/, MessageBox.ShowInfo(lines)];
                    case 1:
                        _g.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    RequestBusinessTripLogic.prototype.performAction = function (layout) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, layout.getService($ReqService).GetReqName(layout.cardInfo.id)];
                    case 1:
                        response = _a.sent();
                        layout.getService($MessageBox).showInfo(response);
                        return [2 /*return*/];
                }
            });
        });
    };
    return RequestBusinessTripLogic;
}());
export { RequestBusinessTripLogic };
//# sourceMappingURL=RequestBusinessTripLogic.js.map