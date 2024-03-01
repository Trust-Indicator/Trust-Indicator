using FluentValidation;
using System.ComponentModel.DataAnnotations;

namespace Trust_Indicator.Model
{
    public class User
    {
        [Key]
        public int UserID { get; set; }
        public string? UserName { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
        [Required]
        public string LegalName { get; set; }
        public string? ProfilePhotoNO { get; set; }
        [Required]
        public bool Is_Admin { get; set; }
    }

    public class UserValidator : AbstractValidator<User>
    {
        public UserValidator()
        {
            // check username is not null, empty and is beteen 1 and 15 characters
            RuleFor(x => x.UserName).NotNull().NotEmpty().Length(1, 15).WithMessage("Please provide a valid user name.");
            // check password is not null, empty and is beteen 6 and 12 characters
            RuleFor(x => x.Password).NotNull().NotEmpty().Length(6, 12).WithMessage("Please provide a valid password.");
            // check email is not null, empty and is valid email address
            RuleFor(x => x.Email).NotNull().NotEmpty().EmailAddress().WithMessage("Please provide a valid email.");
        }
    }
}

