# DECISION LOG 
## Decision Details 
- Date: Aug 20, 2023
- Modify Date: Aug 26, 2023
- Decision Maker: All members 
  
## Background 
Every table and relation needs to be designed to serve the application's core needs. 
Minimizing redundancy and enhancing data retrieval speed.

## Decisions
1. **Decision**: Introduce a User DB to store all user-related data, with a unique identifier for each user.
	Reason: To manage users efficiently. 

	Update: Store `Legal name` instead of `First name`, `Middle name` and `Last name`.

	Reason for update: Tutor suggested not every culture uses the first, middle, and last name structure. A singular field avoids making assumptions about a person's naming conventions.

2. **Decision**: Introduce a Photo DB to store all photo-related data, with a unique identifier for each photo.
	Reason: To manage user uploads efficiently and to reference photos throughout the system with ease.

	Update: Change name to Image DB. 

	Reason: The client wants to store photographs, artist works, etc.; the word `Photo` limits the types, `Image` Refers to a representation of visual information, whether it's produced by a camera, a scanner, created digitally, or any other means.

3. **Decision**: Image URLs will point to Firebase storage.

	Reason: Firebase offers scalable and secure cloud storage, which can efficiently handle user uploads and provide fast retrieval.

5. **Decision**: Introduce a Favorite DB to store user interactions such as likes, comments, and ratings.

	Reason: Centralizing this data facilitates analytics and enhances user experience by providing insights and personalization options.

6. **Decision**: Design a Metadata DB capturing intricate details of each image.

	Reason: To facilitate image analysis, verify authenticity, and provide additional insights about the image's origin and properties.

## Notes and Assumptions
- FileType & MIMEType: Certain file formats indicate possible image editing or the software used.
- CreateDate & ModifyDate: Significant gaps between these dates could signify image edits.
- ColorSpace: A change might point towards image manipulation.
- Make & Model: Irregularities can indicate artificial generation or edits to the image.
- Software: Software tags, like "Adobe Photoshop," confirm image processing/editing.

## Overall Consideration
The design of the database was approached with scalability, user experience, and data security in mind. By dividing the data into distinct databases and capturing detailed metadata, we aim to ensure smooth operations, efficient analytics, and high user engagement.

## Reference
Harvey, P. (n.d.). ExifTool by Phil Harvey. [online] exiftool.org. Available at: https://exiftool.org/.

[Link to Database Design](https://github.com/tonypioneer/Trust-Indicator/tree/main/docs/Prototype/Database%20Design)
