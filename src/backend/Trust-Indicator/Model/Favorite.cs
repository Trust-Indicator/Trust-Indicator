using System.ComponentModel.DataAnnotations;

namespace Trust_Indicator.Model
{
    public class Favorite
    {
        [Key]
        public int RecordID { get; set; }
        [Required]
        public int ImageID { get; set; }
        [Required]
        public int UserID { get; set; }

        public int Rate { get; set; }
        public bool Is_Favorite { get; set; }
        public string? Comment { get; set; }
        public DateTime Create_Date { get; set; }
    }
}