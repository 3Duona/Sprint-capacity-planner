using System;
using System.Collections.Generic;
using System.Text;

namespace backend.DataAccess.Contracts
{
    public class SprintExpectedVelocityRequest
    {
        public double ActualVelocity { get; set; }

        public double SprintDevCapacity { get; set; }
    }
}
