using System;
using System.Collections.Generic;
using System.Resources;
using System.Runtime.Versioning;
using DocsVision.Platform.Tools.LayoutEditor.DataLayer.Model;
using DocsVision.Platform.Tools.LayoutEditor.Extensibility;
using DocsVision.Platform.Tools.LayoutEditor.Helpers;
using DocsVision.Platform.Tools.LayoutEditor.Infrostructure;
using DocsVision.Platform.Tools.LayoutEditor.ObjectModel.Descriptions;

namespace TemplateDesignerExtension.Extension
{
    /// <summary>
    /// Представляет собой пример расширения для редактора разметок
    /// </summary>
    [SupportedOSPlatform("windows")]
    class TemplateDesignerExtension : WebLayoutsDesignerExtension
    {
        /// <summary>
        /// Создаёт новый экземпляр <see cref="TemplateDesignerExtension"/>
        /// </summary>
        /// <param name="provider">Сервис-провайдер</param>
        public TemplateDesignerExtension(IServiceProvider provider)
            : base(provider)
        {
        }

        /// <summary>
        /// Возвращает словарь ключ/описание свойства, которые будут использоваться в пользовательских контролах
        /// </summary>
        protected override Dictionary<string, PropertyDescription> GetPropertyDescriptions()
        {
            return new Dictionary<string, PropertyDescription>
            {
                {"GetCheapTicketsLabel",  GetCheapTicketsLabelPropertyDescriptions()}
            };
        }

        /// <summary>
        /// Возвращает описание пользовательских контролов
        /// описание контрола PartnerLink выполнено альтернативным способом и содержится в каталоге xml
        /// </summary>
        protected override List<ControlTypeDescription> GetControlTypeDescriptions()
        {
            return new List<ControlTypeDescription>{
                GetCheapTicketsControlTypeDescription()
            };
        }

        /// <summary>
        /// Возвращает ResourceManager этого расширения (расширяет словарь локализации конструктора разметок, не путать с окном Localization конструктора разметок)
        /// </summary>
        protected override List<ResourceManager> GetResourceManagers()
        {
            return new List<ResourceManager>
            {
                Resources.ResourceManager
            };
        }

        /// <summary>
        /// Возвращает список условий выбора разметок этого расширения
        /// </summary>
        public override List<ModeConditionTypeModel> GetModeConditionTypes(Location location)
        {
            return base.GetModeConditionTypes(location);
        }

        /// <summary>
        /// Возвращает список доступных операций для контрола (доступность контрола в конкретной разметке, добавление/удаление/перемещение и т.д. контрола в разметке)
        /// </summary>
        /// <returns></returns>
        protected override Dictionary<string, Func<AllowedOperationsFlag>> GetAllowedOperations()
        {
            return base.GetAllowedOperations();
        }

        /// <summary>
        /// Возвращает список компонентов, содержащих графическое представление для отображения ЭУ
        /// </summary>
        /// <returns></returns>
        protected override Dictionary<string, Type> GetVisualizers()
        {
            return base.GetVisualizers();
        }

        /// <summary>
        /// Возвращает список редакторов значений свойств элементов управления
        /// </summary>
        /// <returns></returns>
        protected override Dictionary<string, Type> GetEditors()
        {
            return base.GetEditors();
        }

        /// <summary>
        /// Возвращает список резолверов элементов управления
        /// </summary>
        /// <returns></returns>
        protected override List<DataSourceResolverDescription> GetDataSourceResolverDescriptions()
        {
            return base.GetDataSourceResolverDescriptions();
        }

        private ControlTypeDescription GetCheapTicketsControlTypeDescription()
        {
            return new ControlTypeDescription("GetCheapTicketsControl")
            {
                DisplayName = "Получение дешевых авиабилетов (это не реклама авиасейлс)",
                ControlGroupDisplayName = "Tickets",
                PropertyDescriptions =
                {
                    PropertyFactory.GetNameProperty(),
                    PropertyFactory.GetVisibilityProperty(),
                    PropertyFactory.GetClickEvent(),
                    PropertyFactory.Create("GetCheapTicketsLabel")
                }
            };
        }

        private PropertyDescription GetCheapTicketsLabelPropertyDescriptions() 
        { 
            return new PropertyDescription()
            {
                Name = "GetCheapTicketsLabel",
                DisplayName = "Метка для цены",
                Type = typeof(string),
                Category = PropertyCategoryConstants.DataCategory
            };
        }
    }
}
