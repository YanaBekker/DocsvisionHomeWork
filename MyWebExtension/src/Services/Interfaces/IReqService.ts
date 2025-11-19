import { StaffDirectoryItems } from "@docsvision/webclient/BackOffice/StaffDirectoryItems";
import { serviceName } from "@docsvision/webclient/System/ServiceUtils"
import { ChangeDirPhoneInfoRequest } from "../../Models/IChangeDirPhoneInfoRequest";
import { IChangeCityInfoRequest } from "../../Models/IChangeCityInfoRequest";
import { IChangeCityInfoResponse } from "../../Models/IChangeCityInfoResponse";
import { ApiResponse } from "../../Models/IApiResponse";
import { FlightDataRequest } from "../../Models/IFlightDataRequest";

export interface IReqService {
    GetReqName(documentId: string): Promise<string>
    ChangeDirPhoneInfo(request: ChangeDirPhoneInfoRequest): Promise<Boolean>
    ChangeCityInfo(request: IChangeCityInfoRequest): Promise<IChangeCityInfoResponse>
    GetCheapTickets(request: FlightDataRequest): Promise<ApiResponse> 
}

export type $ReqService = { activityPlanService: IReqService }; 
export const $ReqService = serviceName<$ReqService, IReqService>(x => x.activityPlanService); 