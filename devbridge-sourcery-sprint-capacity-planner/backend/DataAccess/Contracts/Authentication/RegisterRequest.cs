﻿namespace backend.DataAccess.Contracts.Authentication
{
    public class RegisterRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Role { get; set; }
        public string Team { get; set; }
    }
}
