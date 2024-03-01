using System.ComponentModel.DataAnnotations;
namespace Trust_Indicator.Dtos
{
    public class UserInputDto
    {
        [Required]
        public string Password { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string LegalName { get; set; }
        public string? UserName { get; set; }
        [Required]
        public bool IsAdmin { get; set; }
    }
}
