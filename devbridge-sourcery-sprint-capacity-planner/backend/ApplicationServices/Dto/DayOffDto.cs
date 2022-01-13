namespace backend.ApplicationServices.Dto
{
    public class DayOffDto
    {
        public int Id { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public int DaysCount { get; set; }
        public string Reason { get; set; }
        public int UserId { get; set; }
    }
}
