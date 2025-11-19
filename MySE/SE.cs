using DocsVision.Platform.Data;
using DocsVision.Platform.StorageServer;
using DocsVision.Platform.StorageServer.Extensibility;
using System.Data;

namespace MySE
{
    public class SE : StorageServerExtension
    {
        public SE() { }

        [ExtensionMethod]
        public DataTable GetReqComInfo(Guid employeeId)
        {
            using (var cmd = DbRequest.DataLayer.Connection.CreateCommand("getReqComInfo", System.Data.CommandType.StoredProcedure))
            {
                cmd.AddParameter("EmployeeId", System.Data.DbType.Guid, System.Data.ParameterDirection.Input, 0, employeeId);
                var dataTable = new DataTable();
                using (var reader = cmd.ExecuteReader())
                {
                    dataTable.Load(reader);
                }
                return dataTable;
            }
        }
        [ExtensionMethod]
        public ApiResponse GetCheapTickets(string iata_code, string departure_at, string return_at)
        {
            string token = "b165d8c4be5500d4da61df5067fd34ad";
            var apiClient = new AviasalesApiClient(token);

            var response = apiClient.GetCheapestFlights(
                origin: "LED",
                destination: iata_code,
                departureAt: departure_at,
                returnAt: return_at,
                currency: "rub",
                limit: 10
            );
          
            return response;

        }
    }
}
