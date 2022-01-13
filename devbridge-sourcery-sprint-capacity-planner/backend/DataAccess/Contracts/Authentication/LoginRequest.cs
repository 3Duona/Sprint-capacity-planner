namespace backend.DataAccess.Contracts.Authentication
{
    public class LoginRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public bool Remember { get; set; }
    }
}
