using DocsVision.BackOffice.ObjectModel;
using DocsVision.Layout.WebClient.Models;
using DocsVision.Layout.WebClient.Models.TableData;
using DocsVision.Layout.WebClient.Services;
using DocsVision.Platform.ObjectManager;
using DocsVision.Platform.WebClient;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ServerExtension.DataGridPlugins
{
    public class MyPlugin : IDataGridControlPlugin
    {
        public string Name => "reqInfoTable";

        public TableModel GetTableData(SessionContext sessionContext, List<ParamModel> parameters)
        {
            
            Guid cardId = new Guid(parameters.FirstOrDefault(p => p.Key == "CurrentCardId").Value);
            Document doc = sessionContext.ObjectContext.GetObject<Document>(cardId);
        
            ExtensionManager extensionManager = sessionContext.Session.ExtensionManager;
            ExtensionMethod getReqComInfo = extensionManager.GetExtensionMethod("ES25_SE", "GetReqComInfo");

            getReqComInfo.Parameters.AddNew("employeeId", ParameterValueType.Guid, (Guid)doc.MainInfo["WhoCommander"]);

            object resultObj = getReqComInfo.Execute();
            Newtonsoft.Json.Linq.JArray jArray = (Newtonsoft.Json.Linq.JArray)resultObj;

            // DocsVision.Platform.WebClient.Diagnostics.Trace.TraceError($"resultObj Columns {resultObj.Columns}");
            TableModel table = new TableModel();

            string idColumn = "ID";
            string dateColumn = "dateFrom";
            string cityColumn = "city";
            string desColumn = "description";
            string stateColumn = "state";

            table.Columns.Add(new ColumnModel()
            {
                Id = idColumn,
                Name = "№",
                Type = DocsVision.WebClient.Models.Grid.ColumnType.String
            });

            table.Columns.Add(new ColumnModel()
            {
                Id = dateColumn,
                Name = "Дата выезда",
                Type = DocsVision.WebClient.Models.Grid.ColumnType.String
            });

            table.Columns.Add(new ColumnModel()
            {
                Id = cityColumn,
                Name = "Город",
                Type = DocsVision.WebClient.Models.Grid.ColumnType.String
            });

            table.Columns.Add(new ColumnModel()
            {
                Id = desColumn,
                Name = "Основание для поездки",
                Type = DocsVision.WebClient.Models.Grid.ColumnType.String
            });

            table.Columns.Add(new ColumnModel()
            {
                Id = stateColumn,
                Name = "Статус заявки",
                Type = DocsVision.WebClient.Models.Grid.ColumnType.String
            });

            int rowNumber = 1;
            foreach (var item in jArray)
            {
                string dateFrom = item["business_trip_dates_from"]?.ToString();
                string cityId = item["city"]?.ToString();
                string reason = item["reason_trip"]?.ToString();
                string stateId = item["state"]?.ToString();

                if (DateTime.TryParse(dateFrom, out DateTime date))
                {
                    dateFrom = date.ToString("dd.MM.yyyy");
                }
                if (!string.IsNullOrEmpty(reason))
                {
                    reason = System.Text.RegularExpressions.Regex.Replace(reason, "<.*?>", string.Empty);
                }

                string cityName = "";

                if (!string.IsNullOrEmpty(cityId))
                {
                    try
                    {
                        var city = sessionContext.ObjectContext.GetObject<BaseUniversalItem>(new Guid(cityId));
                        cityName = city.Name;
                    }
                    catch (Exception ex)
                    {
                    }
                }
                string stateName = "";
                if (!string.IsNullOrEmpty(stateId))
                {
                    try
                    {
                        var state = sessionContext.ObjectContext.GetObject<StatesState>(new Guid(stateId));
                        stateName = state.ToString();
                    }
                    catch (Exception ex)
                    {
                    }
                }

                table.Rows.Add(new RowModel()
                {
                    Id = rowNumber.ToString(),
                    Cells = new List<CellModel>()
                    {
                        new CellModel()
                        {
                            ColumnId = idColumn,
                            Value = rowNumber.ToString()
                        },
                        new CellModel() {
                            ColumnId = dateColumn,
                            Value = dateFrom
                        },
                        new CellModel() {
                            ColumnId = cityColumn,
                            Value = cityName
                        },
                        new CellModel() {
                            ColumnId = desColumn,
                            Value = reason
                        },
                        new CellModel()
                        {
                            ColumnId = stateColumn,
                            Value = stateName
                        }
                    }
                });

                rowNumber++;
            }

            table.Id = Guid.NewGuid().ToString();

            return table;
        }
    }
}
