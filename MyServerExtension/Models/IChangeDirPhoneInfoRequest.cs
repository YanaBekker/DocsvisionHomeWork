using System;

namespace ServerExtension.Models
{
    public class IChangeDirPhoneInfoRequest
    {
        public Guid DocumentId { get; set; }
        public Guid CommanderId { get; set; }
    }
}
