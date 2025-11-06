using DocsVision.Platform.Data.Metadata.CardModel;
using DocsVision.Platform.WebClient;
using DocsVision.Platform.WebClient.Models;
using DocsVision.Platform.WebClient.Models.Generic;
using IntroductionToSDK.App.Services;
using Microsoft.AspNetCore.Mvc;
using ServerExtension.Models;
using System;

namespace IntroductionToSDK.App.Controllers {

    public class ReqController : ControllerBase
	{
		private readonly ICurrentObjectContextProvider contextProvider;
		private readonly IReqService reqService;
		public ReqController(
		ICurrentObjectContextProvider contextProvider,
		IReqService myService) {
			this.contextProvider = contextProvider;
			this.reqService = myService;
		}
		[HttpPost]
		public CommonResponse<string> GetReqName([FromBody] Guid documentId) {
			var sessionContext = contextProvider.GetOrCreateCurrentSessionContext();
            var result = reqService.GetReqName(sessionContext, documentId);
            return CommonResponse.CreateSuccess(result);
		}
        [HttpPost]
        public CommonResponse<bool> ChangeDirPhoneInfo([FromBody] IChangeDirPhoneInfoRequest data)
        {
            var sessionContext = contextProvider.GetOrCreateCurrentSessionContext();
            var result = reqService.ChangeDirPhoneInfo(sessionContext, data);
            return CommonResponse.CreateSuccess(result);
        }
        [HttpPost]
        public CommonResponse<IChangeCityInfoResponse> ChangeCityInfo([FromBody] IChangeCityInfoRequest data)
        {
            var sessionContext = contextProvider.GetOrCreateCurrentSessionContext();
            var result = reqService.ChangeCityInfo(sessionContext, data);
            return CommonResponse.CreateSuccess(result);
        }
    }
}
