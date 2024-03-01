using System.ComponentModel.DataAnnotations;

namespace Trust_Indicator.Model
{
    public class Image
    {
        [Key]
        public int ImageID { get; set; }
        [Required]
        public int UserID { get; set; }
        public string ImageTitle { get; set; }
        [Required]
        public string ImageUrl { get; set;}
        public DateTime UploadDate { get; set; }
        public string Tag { get; set; }
        public string ImageDescription { get; internal set; }
    }
}