using DocsVision.Platform.WebClient;
using DocsVision.WebClientLibrary.ObjectModel.Services.EntityLifeCycle;
using DocsVision.WebClientLibrary.ObjectModel.Services.EntityLifeCycle.Options;
using ServerExtension.Helpers;
using ServerExtension.Services;
using System;
using System.Collections.Generic;

namespace ServerExtension.CardLifeCycle
{
    public class MainLifeCycle : ICardLifeCycleEx
    {
        public MainLifeCycle(ICardLifeCycleEx baseLifeCycle, IReqService service)
        {
            BaseLifeCycle = baseLifeCycle;
            ReqService = service;
        }
        protected ICardLifeCycleEx BaseLifeCycle { get; }
        protected IReqService ReqService { get; }
        public Guid CardTypeId => BaseLifeCycle.CardTypeId;
        public Guid Create(SessionContext sessionContext, CardCreateLifeCycleOptions options)
        {
            var cardId = BaseLifeCycle.Create(sessionContext, options);

            if (options.CardKindId == Const.ReqId)
            {
                ReqService.InitReq(sessionContext, cardId);
            }
            return cardId;
        }
        public bool CanDelete(SessionContext sessionContext, CardDeleteLifeCycleOptions options, out string message) 
            => BaseLifeCycle.CanDelete(sessionContext, options, out message);

        public string GetDigest(SessionContext sessionContext, CardDigestLifeCycleOptions options) 
            => BaseLifeCycle.GetDigest(sessionContext, options);

        public void OnDelete(SessionContext sessionContext, CardDeleteLifeCycleOptions options)
            => BaseLifeCycle.OnDelete(sessionContext, options);

        public void OnSave(SessionContext sessionContext, CardSaveLifeCycleOptions options)
            => BaseLifeCycle.OnSave(sessionContext, options);

        public bool Validate(SessionContext sessionContext, CardValidateLifeCycleOptions options, out List<ValidationResult> validationResults)
            => BaseLifeCycle.Validate(sessionContext, options, out validationResults);
    }
}
