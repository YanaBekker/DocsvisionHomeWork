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

    }
}
