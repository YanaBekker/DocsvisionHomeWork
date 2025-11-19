using DocsVision.Platform.WebClient;
using ServerExtension.Models;
using System;
using System.Threading.Tasks;

namespace ServerExtension.Services
{
	public interface IReqService {
		string GetReqName(SessionContext sessionContext, Guid cardId);
        bool ChangeDirPhoneInfo(SessionContext sessionContext, IChangeDirPhoneInfoRequest data);
        //IChangeCityInfoResponse ChangeCityInfo(SessionContext sessionContext, IChangeCityInfoRequest data);
        void InitReq(SessionContext sessionContext, Guid cardId);
        ApiResponse GetCheapTickets(SessionContext sessionContext, IFlightDataRequest data);
    }
}
