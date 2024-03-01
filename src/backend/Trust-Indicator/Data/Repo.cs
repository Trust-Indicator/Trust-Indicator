using Microsoft.EntityFrameworkCore.ChangeTracking;
using Trust_Indicator.Dtos;
using Trust_Indicator.Model;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Xml.Linq;
using static System.Net.Mime.MediaTypeNames;
using BCrypt.Net;

namespace Trust_Indicator.Data
{
    public class Repo : IRepo
    {
        private readonly MyDbContext _dbContext;

        public Repo(MyDbContext dBContext)
        {
            _dbContext = dBContext;
        }

        // Login
        public bool ValidLogin(string email, string password)
        {
            User user = _dbContext.Users.FirstOrDefault(u => u.Email == email);
            if (user != null) {
                return Verify(password, user.Password);
            }
            return false;
        }
        public bool IsAdmin(User user)
        {
            User u = GetUserByID(user.UserID);
            return u.Is_Admin;
        }

        //User
        public IEnumerable<UserOutputDto> GetAllUsers()
        {
            IEnumerable<User> users = _dbContext.Users.ToList();
            IEnumerable<UserOutputDto> allUserOutputs = users.Select(e =>
                                        new UserOutputDto()
                                        {
                                            UserID = e.UserID,
                                            UserName = (e.UserName != null || e.UserName != "") ? e.UserName : e.LegalName,
                                            Email = e.Email,
                                            LegalName = e.LegalName,
                                            ProfilePhotoNO = e.ProfilePhotoNO,
                                        });
            return allUserOutputs;
        }

        public bool CheckUserName(string username)
        {
            User user = _dbContext.Users.FirstOrDefault(e => e.UserName.ToLower() == username.ToLower() || e.LegalName.ToLower() == username.ToLower());
            if (user != null)
            {
                return true;
            }
            return false;
        }
        public IEnumerable<UserOutputDto> GetUserByUsername(string username)
        {
            IEnumerable<User> users = _dbContext.Users.Where(e => e.UserName.ToLower().Contains(username.ToLower()) || e.LegalName.ToLower().Contains(username.ToLower()));
            IEnumerable<UserOutputDto> allUserOutputs = users.Select(e =>
                                        new UserOutputDto()
                                        {
                                            UserID = e.UserID,
                                            UserName = (e.UserName != null || e.UserName != "") ? e.UserName : e.LegalName,
                                            Email = e.Email,
                                            LegalName = e.LegalName,
                                            ProfilePhotoNO = e.ProfilePhotoNO,
                                        });
            return allUserOutputs;
        }
        public User GetUserByID(int id)
        {
            User user = _dbContext.Users.First(e => e.UserID == id);
            return user;
        }
        public User GetUserByEmail(string email)
        {
            User user = _dbContext.Users.FirstOrDefault(e => e.Email == email);
            if (user != null)
            {
                return user;
            }
            return null;
        }
        public UserOutputDto GetUserByLegalName(string legalName)
        {
            User user = _dbContext.Users.FirstOrDefault(e => e.LegalName == legalName);
            if (user != null)
            {
                return new UserOutputDto() { UserID = user.UserID, LegalName = user.LegalName, Email = user.Email, UserName = (user.UserName != null || user.UserName != "") ? user.UserName : user.LegalName, ProfilePhotoNO = (user.ProfilePhotoNO != null) ? user.ProfilePhotoNO : "" };

            }
            return null;    
        }
        public UserOutputDto AddUser(User user)
        {
            user.Password = HashPassword(user.Password);
            EntityEntry<User> entry = _dbContext.Users.Add(user);
            User u = entry.Entity;
            _dbContext.SaveChanges();
            return new UserOutputDto() { UserID = u.UserID, LegalName = u.LegalName, Email = u.Email, UserName = (u.UserName != null || u.UserName != "") ? u.UserName : u.LegalName, ProfilePhotoNO = (user.ProfilePhotoNO != null) ? user.ProfilePhotoNO : "" };
        }
        public UserOutputDto ChangeProfilePhoto(User user, string photo)
        {
            User u = _dbContext.Users.FirstOrDefault(e => e.UserID == user.UserID);
            u.ProfilePhotoNO = (photo != null || photo != "") ? photo : u.ProfilePhotoNO;
            EntityEntry<User> entry = _dbContext.Users.Update(u);
            User updateUser = entry.Entity;
            _dbContext.SaveChanges();
            return new UserOutputDto() { UserID = updateUser.UserID, LegalName = updateUser.LegalName, Email = updateUser.Email, UserName = (updateUser.UserName != null || updateUser.UserName != "") ? updateUser.UserName : updateUser.LegalName, ProfilePhotoNO = updateUser.ProfilePhotoNO };
        }
        public UserOutputDto ChangePassword(User user, string password)
        {
            User u = _dbContext.Users.FirstOrDefault(e => e.UserID == user.UserID);
            u.Password = (password != null || password != "" || password.Length < 12 || password.Length >= 6) ? HashPassword(password) : u.Password;
            EntityEntry<User> entry = _dbContext.Users.Update(u);
            User updateUser = entry.Entity;
            _dbContext.SaveChanges();
            return new UserOutputDto() { UserID = updateUser.UserID, LegalName = updateUser.LegalName, Email = updateUser.Email, UserName = (updateUser.UserName != null || updateUser.UserName != "") ? updateUser.UserName : updateUser.LegalName, ProfilePhotoNO = (user.ProfilePhotoNO != null) ? updateUser.ProfilePhotoNO : "" };
        }
        public UserOutputDto ChangeUserName(User user, string userName)
        {
            if (_dbContext.Users.FirstOrDefault(e => e.UserName == userName) != null)
            {
                return null;
            }
            if (user != null)
            {
                User u = _dbContext.Users.FirstOrDefault(e => e.Email == user.Email);
                u.UserName = (userName != null || userName != "") ? userName : u.UserName;
                EntityEntry<User> entry = _dbContext.Users.Update(u);
                User updateUser = entry.Entity;
                _dbContext.SaveChanges();
                return new UserOutputDto() { UserID = updateUser.UserID, LegalName = updateUser.LegalName, Email = updateUser.Email, UserName = (updateUser.UserName != null || updateUser.UserName != "") ? updateUser.UserName : updateUser.LegalName, ProfilePhotoNO = (user.ProfilePhotoNO != null) ? updateUser.ProfilePhotoNO : "" };

            }
            return null;
        }

        // Image
        public IEnumerable<ImageOutputDto> GetAllImages()
        {
            IEnumerable<Model.Image> images = _dbContext.Images.ToList();
            IEnumerable<ImageOutputDto> allImageOutputs = images.Select(e =>
                                        new ImageOutputDto()
                                        {
                                            ImageID = e.ImageID,
                                            UserID = e.UserID,
                                            ImageTitle = e.ImageTitle,
                                            ImageUrl = e.ImageUrl,
                                            ImageDescription = e.ImageDescription,
                                            UploadDate = e.UploadDate,
                                            Tag = e.Tag,
                                        });
            return allImageOutputs;
        }
        public IEnumerable<ImageOutputDto> SortImagesByUploadTime()
        {
            List<Model.Image> images = _dbContext.Images.ToList();
            var qry = from i in images
                      orderby i.UploadDate descending
                      select i;
            IEnumerable<ImageOutputDto> imageSorted = qry.Take(30).Select(e =>
                                        new ImageOutputDto()
                                        {
                                            ImageID = e.ImageID,
                                            UserID = e.UserID,
                                            ImageTitle = e.ImageTitle,
                                            ImageUrl = e.ImageUrl,
                                            ImageDescription = e.ImageDescription,
                                            UploadDate = e.UploadDate,
                                            Tag = e.Tag,
                                        });
            return imageSorted;
        }
        public IEnumerable<ImageOutputDto> GetImageByTag(string tag)
        {
            IEnumerable<Model.Image> images = _dbContext.Images.Where(e => e.Tag.Equals(tag));
            IEnumerable<ImageOutputDto> findImages = images.Select(e =>
                                        new ImageOutputDto()
                                        {
                                            ImageID = e.ImageID,
                                            UserID = e.UserID,
                                            ImageTitle = e.ImageTitle,
                                            ImageUrl = e.ImageUrl,
                                            ImageDescription = e.ImageDescription,
                                            UploadDate = e.UploadDate,
                                            Tag = e.Tag,
                                        });
            if (findImages.Count() == 0)
            {
                return null;
            }
            return findImages;
        }
        public IEnumerable<ImageOutputDto> GetImageByName(string name)
        {
            IEnumerable<Model.Image> images = _dbContext.Images.Where(e => e.ImageDescription.ToLower().Contains(name.ToLower()) || e.ImageTitle.ToLower().Contains(name.ToLower()));
            IEnumerable<ImageOutputDto> findImages = images.Select(e =>
                                        new ImageOutputDto()
                                        {
                                            ImageID = e.ImageID,
                                            UserID = e.UserID,
                                            ImageTitle = e.ImageTitle,
                                            ImageUrl = e.ImageUrl,
                                            ImageDescription = e.ImageDescription,
                                            UploadDate = e.UploadDate,
                                            Tag = e.Tag,
                                        });
            if (findImages.Count() == 0)
            {
                return null;
            }
            return findImages;
        }
        public IEnumerable<ImageOutputDto> GetImagesByUserName(string userName)
        {
            IEnumerable<UserOutputDto> users = GetUserByUsername(userName);
            IEnumerable<int> userIds = users.Select(e => e.UserID);
            IEnumerable<Model.Image> images = _dbContext.Images.Where(e => userIds.Contains(e.UserID));
            
            IEnumerable<ImageOutputDto> findImages = images.Select(e =>
                                        new ImageOutputDto()
                                        {
                                            ImageID = e.ImageID,
                                            UserID = e.UserID,
                                            ImageTitle = e.ImageTitle,
                                            ImageUrl = e.ImageUrl,
                                            ImageDescription = e.ImageDescription,
                                            UploadDate = e.UploadDate,
                                            Tag = e.Tag,
                                        });
            return findImages;
        }
        public ImageOutputDto GetImageByImageID(int imageId)
        {
            Model.Image image = _dbContext.Images.FirstOrDefault(e => e.ImageID == imageId);
            if (image == null)
            {
                return null;
            }
            return new ImageOutputDto() { ImageID = image.ImageID, UserID = image.UserID, ImageTitle = image.ImageTitle, ImageUrl = image.ImageUrl, ImageDescription = image.ImageDescription, UploadDate = image.UploadDate, Tag = image.Tag };
        }
        public DateTime GetImageUploadTimeByImageID(int imageId)
        {
            return GetImageByImageID(imageId).UploadDate;
        }
        public ImageOutputDto UploadImage(ImageInputDto newImage, User user)
        {
            Model.Image image = new Model.Image() { UserID = user.UserID, ImageTitle = newImage.ImageTitle, ImageUrl = newImage.ImageUrl, ImageDescription = newImage.ImageDescription, UploadDate = DateTime.Now, Tag = newImage.Tag };
            EntityEntry<Model.Image> entry = _dbContext.Images.Add(image);
            Model.Image i = entry.Entity;
            _dbContext.SaveChanges();
            return new ImageOutputDto() { ImageID = i.ImageID, UserID = i.UserID, ImageTitle = i.ImageTitle, ImageUrl = i.ImageUrl, ImageDescription = i.ImageDescription, UploadDate = i.UploadDate, Tag = i.Tag };
        }
        public ImageOutputDto ChangeDescriptionByImageID(int imageId, string newDescription)
        {
            Model.Image i = _dbContext.Images.FirstOrDefault(e => e.ImageID == imageId);
            i.ImageDescription = (newDescription != null || newDescription != "") ? newDescription : i.ImageDescription;
            EntityEntry<Model.Image> entry = _dbContext.Images.Update(i);
            Model.Image updateImage = entry.Entity;
            _dbContext.SaveChanges();
            return new ImageOutputDto() { ImageID = updateImage.ImageID, UserID = updateImage.UserID, ImageTitle = updateImage.ImageTitle, ImageUrl = updateImage.ImageUrl, ImageDescription = updateImage.ImageDescription, UploadDate = updateImage.UploadDate, Tag = updateImage.Tag };
        }
        public ImageOutputDto ChangeTitleByImageID(int imageId, string newTitle)
        {
            Model.Image i = _dbContext.Images.FirstOrDefault(e => e.ImageID == imageId);
            i.ImageTitle = (newTitle != null || newTitle != "") ? newTitle : i.ImageTitle;
            EntityEntry<Model.Image> entry = _dbContext.Images.Update(i);
            Model.Image updateImage = entry.Entity;
            _dbContext.SaveChanges();
            return new ImageOutputDto() { ImageID = updateImage.ImageID, UserID = updateImage.UserID, ImageTitle = updateImage.ImageTitle, ImageUrl = updateImage.ImageUrl, ImageDescription = updateImage.ImageDescription, UploadDate = updateImage.UploadDate, Tag = updateImage.Tag };
        }

        // Favorite
        public IEnumerable<FavoriteOutputDto> GetAllFavorites()
        {
            IEnumerable<Favorite> favorites = _dbContext.Favorites.ToList();
            IEnumerable<FavoriteOutputDto> allFavoriteOutputs = favorites.Select(e =>
                                        new FavoriteOutputDto()
                                        {
                                            RecordID = e.RecordID,
                                            UserID = e.UserID,
                                            ImageID = e.ImageID,
                                            Is_Favorite = e.Is_Favorite,
                                            Comment = e.Comment,
                                            Rate = e.Rate,
                                            Create_Date = e.Create_Date,
                                        });
            return allFavoriteOutputs;
        }
        public IEnumerable<FavoriteOutputDto> GetFavoritesByUserID(int userId)
        {
            IEnumerable<Favorite> favorites = _dbContext.Favorites.Where(e => e.UserID == userId);
            IEnumerable<FavoriteOutputDto> allFavoriteOutputs = favorites.Select(e =>
                                        new FavoriteOutputDto()
                                        {
                                            RecordID = e.RecordID,
                                            UserID = e.UserID,
                                            ImageID = e.ImageID,
                                            Is_Favorite = e.Is_Favorite,
                                            Comment = e.Comment,
                                            Rate = e.Rate,
                                            Create_Date = e.Create_Date,
                                        });
            return allFavoriteOutputs;
        }
        public int GetImageLikesByImageID(int imageId)
        {
            IEnumerable<Favorite> favorites = _dbContext.Favorites.Where(e => e.ImageID == imageId && e.Is_Favorite == true);
            return favorites.Count();
        }
        public double GetImageRateByImageID(int imageId)
        {
            IEnumerable<Favorite> favorites = _dbContext.Favorites.Where(e => e.ImageID == imageId);
            if (favorites.Any())
            {
                return favorites.Average(e => e.Rate);
            }
            else
            {
                return 0;
            }
        }
        public IEnumerable<string> GetCommentsByImageID(int imageId)
        {
            IEnumerable<Favorite> favorites = _dbContext.Favorites.Where(e => e.ImageID == imageId && e.Comment != null);
            return favorites.Select(e => e.Comment).ToList();
        }
        public IEnumerable<FavoriteOutputDto> SortUserFavoriteByCreateDate(int userId)
        {
            List<Favorite> favorites = _dbContext.Favorites.Where(e => e.UserID == userId).ToList();
            var qry = from i in favorites
                      orderby i.Create_Date descending
                      select i;
            IEnumerable<FavoriteOutputDto> favoritesSorted = qry.Take(30).Select(e =>
                                        new FavoriteOutputDto()
                                        {
                                            RecordID = e.RecordID,
                                            ImageID = e.ImageID,
                                            UserID = e.UserID,
                                            Rate = e.Rate,
                                            Is_Favorite = e.Is_Favorite,
                                            Comment = e.Comment,
                                            Create_Date = e.Create_Date,
                                        });
            return favoritesSorted;
        }
        public FavoriteOutputDto AddFavoriteRecord(Favorite newFavorite)
        {
            EntityEntry<Favorite> entry = _dbContext.Favorites.Add(newFavorite);
            Favorite i = entry.Entity;
            _dbContext.SaveChanges();
            return new FavoriteOutputDto() { RecordID = i.RecordID, ImageID = i.ImageID, UserID = i.UserID, Rate = i.Rate, Is_Favorite = i.Is_Favorite, Comment = i.Comment, Create_Date = i.Create_Date, };
        }

        // Metadata
        public MetadataOutputDto GetMetadataByImageID(int imageId)
        {
            Metadata metadata = _dbContext.Metadata.First(e => e.ImageID == imageId);
            return new MetadataOutputDto()
            {
                ImageID = metadata.ImageID,
                File_Size = metadata.File_Size,
                File_Type = metadata.File_Type,
                MIME_Type = metadata.MIME_Type,
                Create_Date = metadata.Create_Date,
                Modify_Date = metadata.Modify_Date,
                Color_Space = metadata.Color_Space,
                Make =  metadata.Make,
                Model = metadata.Model,
                Lens = metadata.Lens,
                Focal_Length = metadata.Focal_Length,
                Aperture = metadata.Aperture,
                Explosure = metadata.Explosure,
                ISO = metadata.ISO,
                Flash = metadata.Flash,
                Altitude = metadata.Altitude,
                Latitude = metadata.Latitude,
                Longitude = metadata.Longitude,
                Software = metadata.Software,
            };
        }
        public MetadataOutputDto AddMetadata(Metadata newMetadata)
        {
            EntityEntry<Metadata> entry = _dbContext.Metadata.Add(newMetadata);
            Metadata i = entry.Entity;
            _dbContext.SaveChanges();
            return new MetadataOutputDto()
            {
                ImageID = i.ImageID,
                File_Size = i.File_Size,
                File_Type = i.File_Type,
                MIME_Type = i.MIME_Type,
                Create_Date = i.Create_Date,
                Modify_Date = i.Modify_Date,
                Color_Space = i.Color_Space,
                Make = i.Make,
                Model = i.Model,
                Lens = i.Lens,
                Focal_Length = i.Focal_Length,
                Aperture = i.Aperture,
                Explosure = i.Explosure,
                ISO = i.ISO,
                Flash = i.Flash,
                Altitude = i.Altitude,
                Latitude = i.Latitude,
                Longitude = i.Longitude,
                Software = i.Software,
            };
        }
    }
}
