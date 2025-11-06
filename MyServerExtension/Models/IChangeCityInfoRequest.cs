using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServerExtension.Models
{
    public class IChangeCityInfoRequest
    {
        public Guid DocumentId { get; set; }
        public int DaysCount { get; set; }
        public string City { get; set; }
    }
}
