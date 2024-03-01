using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Xml.Linq;
using Trust_Indicator.Data;
using Trust_Indicator.Dtos;
using Trust_Indicator.Model;

namespace Trust_Indicator.Controllers
{
    [Route("image")]
    [ApiController]
    public class ImageController : Controller
    {
        private readonly IRepo _repo;
        public ImageController(IRepo repository)
        {
            _repo = repository;
        }
        [HttpGet("all")]
        public ActionResult<IEnumerable<ImageOutputDto>> GetAllImages()
        {
            return Ok(_repo.GetAllImages());
        }

        [HttpGet("latest")]
        public ActionResult<IEnumerable<ImageOutputDto>> SortImagesByUploadTime()
        {
            return Ok(_repo.SortImagesByUploadTime());
        }

        [HttpGet("tag/{tag}")]
        public ActionResult<IEnumerable<ImageOutputDto>> GetImageByTag(string tag)
        {
            return Ok(_repo.GetImageByTag(tag));
        }

        [HttpGet("search/{name}")]
        public ActionResult<IEnumerable<ImageOutputDto>> GetImageByName(string name)
        {
            if (_repo.GetImageByName(name) == null)
                return NotFound();
            return Ok(_repo.GetImageByName(name));
        }

        [HttpGet("user/{userName}")]
        public ActionResult<IEnumerable<ImageOutputDto>> GetImagesByUserName(string userName)
        {
            if (_repo.GetImageByName(userName) == null)
                return NotFound();
            return Ok(_repo.GetImagesByUserName(userName));
        }

        [HttpGet("{imageId}")]
        public ActionResult<ImageOutputDto> GetImageByImageID(int imageId)
        {
            if (_repo.GetImageByImageID(imageId) == null)
                return NotFound();
            return Ok(_repo.GetImageByImageID(imageId));
        }

        [HttpGet("uploadTime/{imageId}")]
        public ActionResult<DateTime> GetImageUploadTimeByImageID(int imageId)
        {
            if (_repo.GetImageByImageID(imageId) == null)
                return NotFound();
            return Ok(_repo.GetImageUploadTimeByImageID(imageId));
        }

        private User GetAuthenticatedUser()
        {
            var email = User.FindFirstValue("email");
            return _repo.GetUserByEmail(email);
        }

        [Authorize(AuthenticationSchemes = "MyAuthentication")]
        [Authorize(Policy = "UserOnly")]
        [HttpPost("upload")]
        public ActionResult<ImageOutputDto> UploadImage(ImageInputDto newImage)
        {
            User user = GetAuthenticatedUser();
            if (_repo.UploadImage(newImage, user) == null)
                return BadRequest(newImage);
            return Ok(_repo.UploadImage(newImage, user));
        }

        [Authorize(AuthenticationSchemes = "MyAuthentication")]
        [Authorize(Policy = "UserOnly")]
        [HttpPut("changeDescription/{imageId}")]
        public ActionResult<ImageOutputDto> ChangeDescriptionByImageID(int imageId, string newDescription)
        {
            User user = GetAuthenticatedUser();
            ImageOutputDto image = _repo.GetImageByImageID(imageId);
            if (image.UserID == user.UserID)
                return Ok(_repo.ChangeDescriptionByImageID(imageId, newDescription));
            return Unauthorized();
        }

        [Authorize(AuthenticationSchemes = "MyAuthentication")]
        [Authorize(Policy = "UserOnly")]
        [HttpPut("changeTitle/{imageId}")]
        public ActionResult<ImageOutputDto> ChangeTitleByImageID(int imageId, string newTitle)
        {
            User user = GetAuthenticatedUser();
            ImageOutputDto image = _repo.GetImageByImageID(imageId);
            if (image.UserID == user.UserID)
                return Ok(_repo.ChangeTitleByImageID(imageId, newTitle));
            return Unauthorized();
        }
    }
}
