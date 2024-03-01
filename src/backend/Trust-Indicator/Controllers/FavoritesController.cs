using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Trust_Indicator.Dtos;
using System.Security.Claims;
using Trust_Indicator.Data;
using Trust_Indicator.Model;

namespace Trust_Indicator.Controllers
{
    [Route("favorite")]
    [ApiController]
    public class FavoritesController : Controller
    {
        private readonly IRepo _repo;
        public FavoritesController(IRepo repository)
        {
            _repo = repository;
        }

        // GET: api/Favorites
        [HttpGet("")]
        public ActionResult<IEnumerable<FavoriteOutputDto>> GetAllFavorites()
        {
            var favorites = _repo.GetAllFavorites();
            if (favorites == null || !favorites.Any())
            {
                return NotFound();
            }
            return Ok(favorites);
        }

        // GET: favorite/user/5
        [Authorize(AuthenticationSchemes = "MyAuthentication")]
        [Authorize(Policy = "UserOnly")]
        [HttpGet("user/{userId}")]
        public ActionResult<IEnumerable<FavoriteOutputDto>> GetFavoritesByUserId(int userId)
        {
            var favorites = _repo.GetFavoritesByUserID(userId);
            if (favorites == null || !favorites.Any())
            {
                return NotFound();
            }
            return Ok(favorites);
        }

        // GET: favorite/sorted/user/5
        [Authorize(AuthenticationSchemes = "MyAuthentication")]
        [Authorize(Policy = "UserOnly")]
        [HttpGet("sorted/user/{userId}")]
        public ActionResult<IEnumerable<FavoriteOutputDto>> GetSortedFavoritesByUserId(int userId)
        {
            var favorites = _repo.SortUserFavoriteByCreateDate(userId);
            if (favorites == null || !favorites.Any())
            {
                return NotFound();
            }
            return Ok(favorites);
        }

        // GET: favorite/likes/5
        [HttpGet("like/{imageId}")]
        public ActionResult<int> GetImageLikesByImageID(int imageId)
        {
            return Ok(_repo.GetImageLikesByImageID(imageId));
        }

        // GET: favorite/rate/5
        [HttpGet("rate/{imageId}")]
        public ActionResult<double> GetImageRateByImageID(int imageId)
        {
            return Ok(_repo.GetImageRateByImageID(imageId));
        }

        // GET: favorite/comments/5
        [HttpGet("comments/{imageId}")]
        public ActionResult<IEnumerable<string>> GetCommentsByImageID(int imageId)
        {
            var comments = _repo.GetCommentsByImageID(imageId);
            if (comments == null || !comments.Any())
            {
                return NotFound();
            }
            return Ok(comments);
        }

        [HttpGet("sorted/user/{userId}")]
        public ActionResult<IEnumerable<FavoriteOutputDto>> SortUserFavoriteByCreateDate(int userId)
        {
            var favorites = _repo.SortUserFavoriteByCreateDate(userId);
            if (favorites == null || !favorites.Any())
            {
                return NotFound();
            }
            return Ok(favorites);
        }
       
        // POST: favorite
        [HttpPost("RecordID")]
        public ActionResult<FavoriteOutputDto> AddFavoriteRecord(Favorite newFavorite)
        {
            var addedFavorite = _repo.AddFavoriteRecord(newFavorite);
            if (addedFavorite == null)
            {
                return BadRequest("Failed to add the favorite.");
            }
            return CreatedAtAction(nameof(AddFavoriteRecord), new { id = addedFavorite.RecordID }, addedFavorite);
        }
    }
}
