using Trust_Indicator.Dtos;
using Trust_Indicator.Model;
using System.ComponentModel.Design;

namespace Trust_Indicator.Data
{
    public interface IRepo
    {
        //Login
        bool ValidLogin(string email, string password);
        bool IsAdmin(User user);

        //User
        IEnumerable<UserOutputDto> GetAllUsers();
        IEnumerable<UserOutputDto> GetUserByUsername(string username);
        bool CheckUserName(string username);
        User GetUserByID(int id);
        User GetUserByEmail(string email);
        UserOutputDto GetUserByLegalName(string legalName);
        UserOutputDto AddUser(User user);
        UserOutputDto ChangeProfilePhoto(User user, string photo);
        UserOutputDto ChangePassword(User user, string password);
        UserOutputDto ChangeUserName(User user, string userName);

        // Image
        IEnumerable<ImageOutputDto> GetAllImages();
        IEnumerable<ImageOutputDto> SortImagesByUploadTime();
        IEnumerable<ImageOutputDto> GetImageByTag(string tag);
        IEnumerable<ImageOutputDto> GetImageByName(string name);
        IEnumerable<ImageOutputDto> GetImagesByUserName(string userName);
        ImageOutputDto GetImageByImageID(int imageId);
        DateTime GetImageUploadTimeByImageID(int imageId);
        ImageOutputDto UploadImage(ImageInputDto newImage, User user);
        ImageOutputDto ChangeDescriptionByImageID(int imageId, string newDescription);
        ImageOutputDto ChangeTitleByImageID(int imageId, string newTitle);

        // Favorite
        IEnumerable<FavoriteOutputDto> GetAllFavorites();
        IEnumerable<FavoriteOutputDto> GetFavoritesByUserID(int userId);
        int GetImageLikesByImageID(int imageId);
        double GetImageRateByImageID(int imageId);
        IEnumerable<string> GetCommentsByImageID(int imageId);
        IEnumerable<FavoriteOutputDto> SortUserFavoriteByCreateDate(int userId);
        FavoriteOutputDto AddFavoriteRecord(Favorite newFavorite);

        // Metadata
        MetadataOutputDto GetMetadataByImageID(int imageId);
        MetadataOutputDto AddMetadata(Metadata newMetadata);
    }
}
