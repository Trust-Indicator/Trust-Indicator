using FluentValidation.Results;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Trust_Indicator.Data;
using Trust_Indicator.Dtos;
using Trust_Indicator.Model;

namespace Trust_Indicator.Controllers
{
    [Route("api")]
    [ApiController]
    public class TestController : Controller
    {
        private readonly IRepo _repo;
        public TestController(IRepo repo)
        {
            _repo = repo;
        }

        //api/GetVersion
        [HttpGet("GetVersion")]
        public ActionResult GetVersion()
        {
            return Ok("1.0.0");
        }

        //api/GetVersionA
        [Authorize(AuthenticationSchemes = "MyAuthentication")]
        [Authorize(Policy = "UserOnly")]
        [HttpGet("GetVersionA")]
        public ActionResult GetVersionA()
        {
            return Ok("1.0.0 (auth)");
        }

        //api/AddAdmin
        [HttpPost("AddAdmin")]
        public ActionResult AddAdmin(UserInputDto user)
        {
            User a = new User { Email = user.Email, Password = user.Password, UserName = user.UserName, LegalName = user.LegalName, Is_Admin = true };

            UserValidator validator = new UserValidator();
            ValidationResult results = validator.Validate(a);

            if (!results.IsValid)
            {
                foreach (var failure in results.Errors)
                {
                    Console.WriteLine("Property " + failure.PropertyName + " failed validation. Error was: " + failure.ErrorMessage);
                }
                return BadRequest();
            }

            UserOutputDto newAdmin = _repo.AddUser(a);
            return Ok(newAdmin);
        }
    }
}
