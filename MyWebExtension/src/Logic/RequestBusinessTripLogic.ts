import { ILayout } from "@docsvision/webclient/System/$Layout";
import { CancelableEventArgs } from "@docsvision/webclient/System/CancelableEventArgs";
import { ICardSavingEventArgs } from "@docsvision/webclient/System/ICardSavingEventArgs";
import { Layout } from "@docsvision/webclient/System/Layout";
import { DirectoryDesignerRow } from "@docsvision/webclient/BackOffice/DirectoryDesignerRow";
import { GenModels } from "@docsvision/webclient/Generated/DocsVision.WebClient.Models";
import { StaffDirectoryItems } from "@docsvision/webclient/BackOffice/StaffDirectoryItems";
import { TextArea } from "@docsvision/webclient/Platform/TextArea";
import { DateTimePicker } from "@docsvision/webclient/Platform/DateTimePicker";
import { NumberControl } from "@docsvision/webclient/Platform/Number";
import { MessageBox } from "@docsvision/webclient/Helpers/MessageBox/MessageBox";
import { $CardKindController } from "@docsvision/webclient/Generated/DocsVision.WebClient.Controllers";
import { TextBox } from "@docsvision/webclient/Platform/TextBox";
import { CustomButton } from "@docsvision/webclient/Platform/CustomButton";
import { $MessageBox } from "@docsvision/webclient/System/$MessageBox";
import { $ReqService } from "../Services/Interfaces/IReqService";
import { Params } from "@docsvision/webclient/BackOffice/ChildTasksPerforming";

export class RequestBusinessTripLogic {

    /**
     * Проверяет возможность сохранения карточки для поля основание для поездки
     * @param layout Разметка карточки
     * @returns true если сохранение разрешено, false если запрещено
    */
    public async CheckPossibility(layout: ILayout): Promise<boolean> {
        const tripReasonField = layout.controls.tryGet<TextArea>("description");

        if (!tripReasonField) {
            console.warn("Контролы описания не найдены");
            return;
        }

        const tripReasonValue = tripReasonField.value;

        if (!tripReasonValue || tripReasonValue.toString().trim() === "") {
            MessageBox.ShowWarning("Сохранение отклонено: поле основание для поездки должно быть заполнено");
            return false;
        }

        return true;
    }

    /**
     * Проверяет валидность дат: дата начала < даты окончания поездки
     * @param layout Разметка карточки
     * @returns true если дата начала < даты окончания поездки, false если дата начала >= даты окончания поездки
    */
    public async CheckDateTrip(sender: DateTimePicker) {
        const layout = sender.layout;

        const startDateControl = layout.controls.tryGet<DateTimePicker>("dateFrom");
        const endDateControl = layout.controls.tryGet<DateTimePicker>("dateTo");

        if (!startDateControl || !endDateControl) {
            console.warn("Контролы дат не найдены");
            return;
        }

        const startDateValue = startDateControl.params.value;
        const endDateValue = endDateControl.params.value;

        if (!startDateValue || !endDateValue) {
            return;
        }

        if (endDateValue < startDateValue) {
            startDateControl.params.value = new Date();
            endDateControl.params.value = new Date();
            MessageBox.ShowWarning("Ошибка с датами: дата начала командировки не может быть позже даты окончания");
        }
    }

    /**
     * Отображает информацию о карточке
     * @param layout Разметка карточки
    */
    public async showInformation(sender: CustomButton) {
        const docName = sender.layout.controls.tryGet<TextBox>("documentName").params?.value || "Не указано";
        const regDate = sender.layout.controls.tryGet<DateTimePicker>("regDate").params?.value || "Не указана";
        const dateFrom = sender.layout.controls.tryGet<DateTimePicker>("dateFrom").params?.value || "Не указана";
        const dateTo = sender.layout.controls.tryGet<DateTimePicker>("dateTo").params?.value || "Не указана";
        const reason = sender.layout.controls.tryGet<TextArea>("description").params?.value || "Не указано";
        const city = sender.layout.controls.tryGet<DirectoryDesignerRow>("city").params.value?.name || "Не указано";
        

        const formatDate = (dateValue) => {
            if (!dateValue || dateValue === "Не указана") return dateValue;

            const date = new Date(dateValue);
            return date.toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        };

        const stripHtml = (html) => {
            if (!html || html === "Не указано") return html;
            return html.replace(/<[^>]*>/g, '');
        };

        const lines = [
            `Название документа: ${docName}`,
            `Дата создания: ${formatDate(regDate)}`,
            `Дата с: ${formatDate(dateFrom)}`,
            `Дата по: ${formatDate(dateTo)}`,
            `Основание: ${stripHtml(reason)}`,
            `Город: ${city}`
        ].filter(Boolean).join('\n');

        await MessageBox.ShowInfo(lines);
    }

    async performAction(layout: Layout) {
        const response = await layout.getService($ReqService).GetReqName(layout.cardInfo.id);
        layout.getService($MessageBox).showInfo(response);
    }

    async ChangeDirPhoneInfo(layout: Layout) {
        const commander = layout.controls.tryGet<(StaffDirectoryItems)>("commander");
        const value = commander.value as GenModels.EmployeeDataModel;

        const result = await layout.getService($ReqService).ChangeDirPhoneInfo({documentId: layout.cardInfo.id,
            commanderId: value.id});
        

        // Пыталась возвращать строку телефона и в какой либо виде данные о руководителе (id, типы и еще разные типы)
        // и меня значения тут  const phone = sender.layout.controls.tryGet<TextBox>("phone"); phone.params.value = то что вернули
        // но вот не смогал сотрудника вернуть

        layout.reloadFromServer();
    }

    async ChangeCityInfo(layout: Layout) {
        const cityNode = layout.controls.tryGet<(DirectoryDesignerRow)>("city");
        const day = layout.controls.tryGet<(NumberControl)>("dayCount");
     
        const result = await layout.getService($ReqService).ChangeCityInfo({documentId: layout.cardInfo.id,
            daysCount: day.value, city: cityNode.value.name});
        
        const sumTrip = layout.controls.tryGet<(NumberControl)>("sumTrip");
        sumTrip.params.value = result.amountMoney;
    }
}