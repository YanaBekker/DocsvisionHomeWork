import { BaseControl, BaseControlParams, BaseControlState } from "@docsvision/webclient/System/BaseControl";
import { ControlImpl } from "@docsvision/webclient/System/ControlImpl";
import { r } from "@docsvision/webclient/System/Readonly";
import React from "react";
import { $CardId } from "@docsvision/webclient/System/LayoutServices";
import { Button, ButtonAlignModes } from "@docsvision/webclient/Helpers/Button";
import { ApiResponse } from "../../Models/IApiResponse";
import { $ReqService } from "../../Services/Interfaces/IReqService";
import { DateTimePicker } from "@docsvision/webclient/Platform/DateTimePicker";
import { DirectoryDesignerRow } from "@docsvision/webclient/BackOffice/DirectoryDesignerRow";

export class CheapTicketsControlParams extends BaseControlParams {
    @r getCheapTicketsLabel?: string;
    @r services?: $ReqService & $CardId;
}

export interface CheapTicketsControlState extends CheapTicketsControlParams, BaseControlState {
    tickets: ApiResponse;
    isExpanded: boolean;
    selectedTicketIndex: number | null;
    selectedTicketPrice: string | null;
    isLoading: boolean;
}

export class CheapTicketsControl extends BaseControl<CheapTicketsControlParams, CheapTicketsControlState> {

    construct() {
        super.construct();
        this.state.tickets = null;
        this.state.isExpanded = false;
        this.state.selectedTicketIndex = null;
        this.state.selectedTicketPrice = null;
        this.state.isLoading = false;
    }

    protected createParams() {
        return new CheapTicketsControlParams();
    }

    protected createImpl() {
        return new ControlImpl(this.props, this.state, this.renderControl.bind(this));
    }

    private async onButtonClick() {
        console.log("All params:", this.params);
        console.log("getCheapTicketsLabel:", this.params.getCheapTicketsLabel);
        console.log("Params keys:", Object.keys(this.params));

        const dateFrom = this.layout.controls.tryGet<DateTimePicker>("dateFrom")?.params?.value;
        const dateTo = this.layout.controls.tryGet<DateTimePicker>("dateTo")?.params?.value;

        const departure_at_format = dateFrom ? dateFrom.toISOString().split('T')[0] : null;
        const return_at_format = dateTo ? dateTo.toISOString().split('T')[0] : null;

        const cityName = this.layout.controls.tryGet<DirectoryDesignerRow>("city")?.params?.value?.name || null;

        if (!cityName) {
            alert("Пожалуйста, выберите город");
            return;
        }

        this.setState({ isLoading: true });

        try {
            const tickets = await this.params.services.activityPlanService.GetCheapTickets({
                city: cityName,
                departure_at: departure_at_format,
                return_at: return_at_format
            });

            if (tickets?.success && tickets.data && tickets.data.length > 0) {
                tickets.data.sort((a, b) => parseInt(a.price) - parseInt(b.price));

                this.setState({
                    tickets: tickets,
                    isExpanded: true,
                    isLoading: false
                });
            } else {
                alert("Билеты по указанным параметрам не найдены");
                this.setState({
                    tickets: null,
                    isExpanded: true,
                    selectedTicketIndex: null,
                    selectedTicketPrice: null,
                    isLoading: false
                });
            }
        } catch (error) {
            alert("Ошибка при получении данных о билета:х");
            this.setState({
                tickets: null,
                isExpanded: false,
                selectedTicketIndex: null,
                selectedTicketPrice: null,
                isLoading: false
            });
        }
    }

    private onTicketSelect(event: React.ChangeEvent<HTMLSelectElement>) {
        const selectedIndex = parseInt(event.target.value);

        if (selectedIndex >= 0 && this.state.tickets?.data?.[selectedIndex]) {
            const selectedTicket = this.state.tickets.data[selectedIndex];
            this.setState({
                selectedTicketIndex: selectedIndex,
                selectedTicketPrice: selectedTicket.price
            });
        } else {
            this.setState({
                selectedTicketIndex: null,
                selectedTicketPrice: null
            });
        }
    }

    private formatTicketOption(ticket: any, index: number): string {
        const airline = ticket.airline || "Неизвестная авиакомпания";
        const flightNumber = ticket.flight_Number || "Н/Д";

        return `${airline} (Рейс ${flightNumber})`;
    }

    renderControl() {
        return (
            <div style={{ margin: "10px 0" }}>
                {/* Кнопка запроса */}
                <Button
                    text={this.state.isLoading ? "Поиск билетов..." : "Запросить стоимость билетов"}
                    align={ButtonAlignModes.Center}
                    onClick={() => this.onButtonClick()}
                    disabled={this.state.isLoading}
                />

                {/* Раскрывающаяся область с результатами */}
                {this.state.isExpanded && (
                    <div style={{
                        marginTop: "15px",
                        padding: "15px",
                        border: "1px solid #ddd",
                        borderRadius: "5px",
                        backgroundColor: "#f9f9f9"
                    }}>

                        {/* DROPDOWN - Перечисление вариантов билетов */}
                        {this.state.tickets?.data && this.state.tickets.data.length > 0 ? (
                            <div style={{ marginBottom: "15px" }}>
                                <label
                                    htmlFor="ticketSelector"
                                    style={{
                                        display: "block",
                                        marginBottom: "8px",
                                        fontWeight: "bold",
                                        fontSize: "14px"
                                    }}
                                >
                                    Варианты билетов:
                                </label>
                                <select
                                    id="ticketSelector"
                                    style={{
                                        width: "100%",
                                        padding: "10px",
                                        border: "1px solid #ccc",
                                        borderRadius: "4px",
                                        fontSize: "14px",
                                        backgroundColor: "white"
                                    }}
                                    value={this.state.selectedTicketIndex ?? ""}
                                    onChange={(e) => this.onTicketSelect(e)}
                                >
                                    <option value="">-- Выберите билет --</option>
                                    {this.state.tickets.data.map((ticket, index) => (
                                        <option key={index} value={index}>
                                            {this.formatTicketOption(ticket, index)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            /* Сообщение, если билеты не найдены */
                            <div style={{
                                padding: "15px",
                                textAlign: "center",
                                color: "#666",
                                fontStyle: "italic"
                            }}>
                                Билеты по указанным параметрам не найдены
                            </div>
                        )}
                    </div>
                )}

                {this.state.selectedTicketPrice != null && (
                    <div style={{
                        marginTop: "10px",
                        padding: "10px",
                        backgroundColor: "#e8f5e8",
                        border: "1px solid #4caf50",
                        borderRadius: "4px",
                        fontWeight: "bold"
                    }}>
                        {this.params.getCheapTicketsLabel} {this.state.selectedTicketPrice} руб.
                    </div>
                )}
            </div>
        );
    }
}