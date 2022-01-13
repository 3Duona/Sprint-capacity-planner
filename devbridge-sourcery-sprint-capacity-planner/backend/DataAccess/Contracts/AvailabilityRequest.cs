using System.Collections.Generic;

namespace backend.DataAccess.Contracts
{
    public class AvailabilityRequest
    {
        public List<int> UserIds { get; set; }
    }
}
