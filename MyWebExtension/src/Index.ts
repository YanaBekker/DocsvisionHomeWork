import { extensionManager } from "@docsvision/webclient/System/ExtensionManager";
import * as RequestBusinessTripEventHandles from "./EventHandlers/RequestBusinessTripEventHandlers";
import { Service } from "@docsvision/webclient/System/Service";
import { $RequestManager } from "@docsvision/webclient/System/$RequestManager";
import { ReqService } from "./Services/ReqService";
import { $ReqService } from "./Services/Interfaces/IReqService";
import { CheapTicketsControl } from "./Controls/GetCheapTicketsLabelControl/CheapTicketsControl";

extensionManager.registerExtension({
    name: "MyWebExtension",
    version: "1.0",
    globalEventHandlers: [RequestBusinessTripEventHandles],
    layoutServices: [Service.fromFactory($ReqService, 
        (services: $RequestManager) => new ReqService(services))],
    controls: [{
        controlTypeName: "GetCheapTicketsControl", constructor: CheapTicketsControl
    }]
})