using System;

namespace ServerExtension.Models
{
    public class IChangeCityInfoRequest
    {
        public Guid DocumentId { get; set; }
        public int DaysCount { get; set; }
        public string City { get; set; }
    }
}
