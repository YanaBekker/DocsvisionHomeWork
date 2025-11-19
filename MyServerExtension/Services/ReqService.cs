using AngleSharp.Io;
using DocsVision.BackOffice.CardLib.CardDefs;
using DocsVision.BackOffice.ObjectModel;
using DocsVision.BackOffice.ObjectModel.Services;
using DocsVision.Platform.ObjectManager;
using DocsVision.Platform.WebClient;
using Newtonsoft.Json.Linq;
using ServerExtension.Models;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace ServerExtension.Services
{
	public class ReqService : IReqService {
        //public IChangeCityInfoResponse ChangeCityInfo(SessionContext sessionContext, IChangeCityInfoRequest data)
        //{
        //    var card = sessionContext.ObjectContext.GetObject<Document>(data.DocumentId);
        //    IBaseUniversalService baseUniversalService = sessionContext.ObjectContext.GetService<IBaseUniversalService>();

           
        //    var cityNode = baseUniversalService.FindItemTypeWithSameName("Города", null);
        //    var city = baseUniversalService.FindItemWithSameName(data.City, cityNode);
        //    card.MainInfo["City"] = city;

        //    double money = (double)city.GetValue("daily");
        //    card.MainInfo["AmountTrips"] = money * data.DaysCount;

        //    sessionContext.ObjectContext.SaveObject(card);
        //    sessionContext.ObjectContext.AcceptChanges();

        //    return new IChangeCityInfoResponse { AmountMoney = money * data.DaysCount};
        //}

        public bool ChangeDirPhoneInfo(SessionContext sessionContext, IChangeDirPhoneInfoRequest data)
        {
            var card = sessionContext.ObjectContext.GetObject<Document>(data.DocumentId);
            var staffSvc = sessionContext.ObjectContext.GetService<IStaffService>();
            
            card.MainInfo["WhoCommander"] = data.CommanderId;
            card.MainInfo["Director"] = staffSvc.GetEmployeeManager(staffSvc.Get(data.CommanderId)).GetObjectId();
            card.MainInfo["Telephone"] = staffSvc.Get(data.CommanderId).MobilePhone;
            card.MainInfo["Concordant"] = card.MainInfo["Director"];

            sessionContext.ObjectContext.SaveObject(card);
            sessionContext.ObjectContext.AcceptChanges();

            return true;
        }
        
        public string GetReqName(SessionContext sessionContext, Guid cardId) {
			var card = sessionContext.ObjectContext.GetObject<Document>(cardId) ?? throw new ArgumentException("Error", nameof(cardId));

			return card.MainInfo[CardDocument.MainInfo.Content] as string;
		}

        public ApiResponse GetCheapTickets(SessionContext sessionContext, IFlightDataRequest data)
        {
            try
            {
                ExtensionManager extensionManager = sessionContext.Session.ExtensionManager;
                ExtensionMethod getReqComInfo = extensionManager.GetExtensionMethod("ES25_SE", "GetCheapTickets");

                IBaseUniversalService universalSvc = sessionContext.ObjectContext.GetService<IBaseUniversalService>();

                var cityNode = universalSvc.FindItemTypeWithSameName("Город", null);
                var strCity = universalSvc.FindItemWithSameName(data.City, cityNode);
                var iata_code = (string)strCity.ItemCard.MainInfo["airportCode"];

                getReqComInfo.Parameters.AddNew("iata_code", ParameterValueType.String, iata_code);
                getReqComInfo.Parameters.AddNew("departure_at", ParameterValueType.String, data.Departure_at);
                getReqComInfo.Parameters.AddNew("return_at", ParameterValueType.String, data.Return_At);

                var result = getReqComInfo.Execute();

                if (result is Newtonsoft.Json.Linq.JObject jObject)
                {
                    string jsonString = jObject.ToString();
                    var apiResponse = Newtonsoft.Json.JsonConvert.DeserializeObject<ApiResponse>(jsonString);

                    return apiResponse;
                }
                else
                {
                    DocsVision.Platform.WebClient.Diagnostics.Trace.TraceError($"\n\n\n\n Unexpected result type: {result?.GetType()}\n\n");
                    return null;
                }
            }
            catch (Exception ex)
            {
                DocsVision.Platform.WebClient.Diagnostics.Trace.TraceError($"{ex.Message}\n{ex.StackTrace}");
                return null;
            }
        }

        public void InitReq(SessionContext sessionContext, Guid cardId)
        {
            var card = sessionContext.ObjectContext.GetObject<Document>(cardId);
            var staffSvc = sessionContext.ObjectContext.GetService<IStaffService>();

            card.MainInfo["WhoCommander"] = staffSvc.GetCurrentEmployee().GetObjectId();
            Guid whoCommanderId = (Guid)card.MainInfo["WhoCommander"];
            card.MainInfo["Director"] = staffSvc.GetEmployeeManager(staffSvc.Get(whoCommanderId)).GetObjectId();
            card.MainInfo["Telephone"] = staffSvc.Get(whoCommanderId).MobilePhone;
            card.MainInfo["Concordant"] = staffSvc.GetEmployeeManager(staffSvc.Get(whoCommanderId)).GetObjectId();


            StaffGroup group = staffSvc.FindGroupByName(null, "Секретарь");
           StaffEmployee employees = staffSvc.GetGroupEmployees(group).First(s => s.Status == 0);

            card.MainInfo["WhoRegistration"] = employees.GetObjectId();


            sessionContext.ObjectContext.SaveObject(card);
            sessionContext.ObjectContext.AcceptChanges();
        }
    }
}
