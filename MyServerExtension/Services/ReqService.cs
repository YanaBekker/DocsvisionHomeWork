using DocsVision.BackOffice.CardLib.CardDefs;
using DocsVision.BackOffice.ObjectModel;
using DocsVision.BackOffice.ObjectModel.Services;
using DocsVision.BackOffice.WebClient.StaffDirectoryItems.Models;
using DocsVision.BackOffice.WebClient.State;
using DocsVision.Platform.ObjectModel;
using DocsVision.Platform.ObjectModel.Search;
using DocsVision.Platform.WebClient;
using DocumentFormat.OpenXml.Bibliography;
using DocumentFormat.OpenXml.EMMA;
using DocumentFormat.OpenXml.InkML;
using IntroductionToSDK.App.Controllers;
using ServerExtension.Models;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using static DocsVision.BackOffice.WebClient.Log.BuiltInOperations;
using static DocsVision.Platform.Data.Metadata.CardModel.WellKnownLogOperations.System;

namespace IntroductionToSDK.App.Services {
	public class ReqService : IReqService {
        public IChangeCityInfoResponse ChangeCityInfo(SessionContext sessionContext, IChangeCityInfoRequest data)
        {
            var card = sessionContext.ObjectContext.GetObject<Document>(data.DocumentId);
            IBaseUniversalService baseUniversalService = sessionContext.ObjectContext.GetService<IBaseUniversalService>();

           
            var cityNode = baseUniversalService.FindItemTypeWithSameName("Города", null);
            var city = baseUniversalService.FindItemWithSameName(data.City, cityNode);
            card.MainInfo["City"] = city;

            double money = (double)city.GetValue("daily");
            card.MainInfo["AmountTrips"] = money * data.DaysCount;

            sessionContext.ObjectContext.SaveObject(card);
            sessionContext.ObjectContext.AcceptChanges();

            return new IChangeCityInfoResponse { AmountMoney = money * data.DaysCount};
        }

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
