namespace Trust_Indicator.Dtos
{
    public class FavoriteOutputDto
    {
        public int RecordID { get; set; }
        public int UserID { get; set; }
        public int ImageID { get; set; }
        public bool Is_Favorite { get; set; }
        public string? Comment { get; set; }
        public int? Rate { get; set; }
        public DateTime Create_Date { get; set; }
    }
}
