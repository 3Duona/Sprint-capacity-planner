using System.Collections.Generic;

namespace backend.DataAccess.Contracts.Teams
{
    public class AddTeamMembersRequest
    {
        public List<int> MemberIds { get; set; }
    }
}
