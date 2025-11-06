using DocsVision.BackOffice.WebClient.StaffDirectoryItems.Models;
using DocsVision.Platform.WebClient;
using IntroductionToSDK.App.Controllers;
using ServerExtension.Models;
using System;

namespace IntroductionToSDK.App.Services {
	public interface IReqService {
		string GetReqName(SessionContext sessionContext, Guid cardId);
        bool ChangeDirPhoneInfo(SessionContext sessionContext, IChangeDirPhoneInfoRequest data);
        IChangeCityInfoResponse ChangeCityInfo(SessionContext sessionContext, IChangeCityInfoRequest data);
        void InitReq(SessionContext sessionContext, Guid cardId);
    }
}
