namespace backend.DataAccess.Contracts
{
    public interface IDayOffRequest
    {
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public int DaysCount { get; set; }
        public string Reason { get; set; }
    }
}
