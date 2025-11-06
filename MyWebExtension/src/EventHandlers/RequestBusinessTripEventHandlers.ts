import { ILayout } from "@docsvision/webclient/System/$Layout";
import { CancelableEventArgs } from "@docsvision/webclient/System/CancelableEventArgs";
import { ICardSavingEventArgs } from "@docsvision/webclient/System/ICardSavingEventArgs";
import { Layout } from "@docsvision/webclient/System/Layout";
import { DirectoryDesignerRow } from "@docsvision/webclient/BackOffice/DirectoryDesignerRow";
import { GenModels } from "@docsvision/webclient/Generated/DocsVision.WebClient.Models";
import { StaffDirectoryItems } from "@docsvision/webclient/BackOffice/StaffDirectoryItems";
import { MessageBox } from "@docsvision/webclient/Helpers/MessageBox/MessageBox";
import { RequestBusinessTripLogic } from "../Logic/RequestBusinessTripLogic";
import { DateTimePicker } from "@docsvision/webclient/Platform/DateTimePicker";
import { $CardKindController } from "@docsvision/webclient/Generated/DocsVision.WebClient.Controllers";
import { CustomButton } from "@docsvision/webclient/Platform/CustomButton";

/**
 * Событие перед сохранением карточки
 * @param layout разметка
 * @param args аргументы
*/
export async function ddRequestBusinessTrip_onSaveCard(layout: ILayout, args: CancelableEventArgs<ICardSavingEventArgs>) {
    if (!layout) { return; }
    let logic = new RequestBusinessTripLogic();

    if (logic.CheckPossibility(layout)) {
        args.accept();
        return;
    }
    args.cancel();
}

/**
 * Событие проверки валидоности даты командировки
 * @param layout разметка
 * @param args аргументы
*/
export async function ddRequestBusinessTrip_DateTimePicker_onDateChanged(sender: DateTimePicker) {
    if (!sender) { return; }
    let logic = new RequestBusinessTripLogic();
    await logic.CheckDateTrip(sender);
}

/**
 * Событие вывод информации по карточке при нажатии на кнопку
 * @param layout разметка
*/
export async function ddRequestBusinessTrip_Button_onClick(sender: CustomButton) {
    if (!sender) { return; }
    let logic = new RequestBusinessTripLogic();
    await logic.showInformation(sender);
}

export async function ddRequestTrip_action1_onClick(sender: CustomButton) {
    new RequestBusinessTripLogic().performAction(sender.layout);
}

export async function ddRequestTrip_ChangeDirPhoneInfo_onDateChanged(sender: CustomButton) {
    new RequestBusinessTripLogic().ChangeDirPhoneInfo(sender.layout);
}

export async function ddRequestTrip_ChangeCityInfo_onDateChanged(sender: CustomButton) {
    new RequestBusinessTripLogic().ChangeCityInfo(sender.layout);
}


