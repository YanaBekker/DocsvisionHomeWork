using DocsVision.BackOffice.CardLib.CardDefs;
using DocsVision.WebClient.Extensibility;
using DocsVision.WebClientLibrary.ObjectModel.Services.EntityLifeCycle;
using IntroductionToSDK.App.Services;
using Microsoft.Extensions.DependencyInjection;
using System;

namespace ServerExtension
{
    /// <summary>
    /// Задаёт описание расширения для WebClient, которое задано в текущей сборке
    /// </summary>
    public class ServerExtension : WebClientExtension
    {
        public ServerExtension() : base() { }
        public override string ExtensionName => "MyExtension";
        public override Version ExtensionVersion => new Version(1, 0, 0);
        public override void InitializeServiceCollection(IServiceCollection services)
        {
            services.AddSingleton<IReqService, ReqService>();

            services.Decorate<ICardLifeCycleEx>((original, serviceProvider) =>
            {
                var typeId = original.CardTypeId;

                if (typeId == CardDocument.ID)
                {
                    var reqService = serviceProvider.GetRequiredService<IReqService>();
                    return new MainLifeCycle(original, reqService);
                }
                return original;
            });

        }
    }
}