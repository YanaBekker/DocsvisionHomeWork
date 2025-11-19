using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServerExtension.Models
{
    public class IFlightDataRequest
    {
        public string City { get; set; }
        public string Departure_at { get; set; }
        public string Return_At { get; set; }
    }
}
