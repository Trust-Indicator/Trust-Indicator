using System.ComponentModel.DataAnnotations;
namespace Trust_Indicator.Dtos
{
    public class ImageInputDto
    {
        public string ImageTitle { get; set; }
        [Required]
        public string ImageUrl { get; set; }
        public string? ImageDescription { get; set; }
        public DateTime UploadDate { get; set; }
        public string Tag { get; set; }
    }
}
