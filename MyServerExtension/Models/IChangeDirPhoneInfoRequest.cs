using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServerExtension.Models
{
    public class IChangeDirPhoneInfoRequest
    {
        public Guid DocumentId { get; set; }
        public Guid CommanderId { get; set; }
    }
}
