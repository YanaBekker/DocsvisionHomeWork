import { ControllerBase, HttpMethods } from "@docsvision/webclient/System/ControllerBase";
import { $RequestManager } from "@docsvision/webclient/System/$RequestManager";
import { ChangeDirPhoneInfoRequest } from "../Models/IChangeDirPhoneInfoRequest";
import { IReqService } from "./Interfaces/IReqService";
import { IChangeCityInfoRequest } from "../Models/IChangeCityInfoRequest";
import { IChangeCityInfoResponse } from "../Models/IChangeCityInfoResponse";
import { FlightDataRequest } from "../Models/IFlightDataRequest";
import { ApiResponse } from "../Models/IApiResponse";

export class ReqService extends ControllerBase implements IReqService {
    protected controllerName: string = "Req";

    constructor(protected services: $RequestManager) {
        super(services);
    } 

    ChangeCityInfo(request: IChangeCityInfoRequest): Promise<IChangeCityInfoResponse> {
        return super.doRequest({
            controller: this.controllerName,
            action: 'ChangeCityInfo',
            isApi: true,
            method: HttpMethods.Post,
            data: request,
            options: { isShowOverlay: true }
        })
    }
    GetReqName(documentId: string): Promise<string> {
        return super.doRequest({
            controller: this.controllerName,
            action: 'GetReqName',
            isApi: true,
            method: HttpMethods.Post,
            data: documentId, 
            options: { isShowOverlay: true }
        })
    }
    ChangeDirPhoneInfo(request: ChangeDirPhoneInfoRequest): Promise<Boolean> {
        return super.doRequest({
            controller: this.controllerName,
            action: 'ChangeDirPhoneInfo',
            isApi: true,
            method: HttpMethods.Post,
            data: request,
            options: { isShowOverlay: true }
        })
    }

    GetCheapTickets(request: FlightDataRequest): Promise<ApiResponse> {
        return super.doRequest({
            controller: this.controllerName,
            action: 'GetCheapTickets',
            isApi: true,
            method: HttpMethods.Post,
            data: request,
            options: { isShowOverlay: true }
        })
    }
}