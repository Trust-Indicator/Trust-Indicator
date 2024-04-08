using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using Newtonsoft.Json.Linq;

class Program
{
    public static string exifToolPath = @"C:\Users\yifan\Desktop\EXIF Tool\exiftool.exe";
    // Path to the image file
    public static string imagePath = @"C:\Users\yifan\Desktop\Trust-Indicator\src\EXIF_Logic\EXIF_TESTER\ExifToolWrapperTests\test2.jpg";
    static void Main()
    {
        List<MetadataItem> metadataItems = new List<MetadataItem>();
        if (UserOption() == true)
        {
            metadataItems = GetMetadata(exifToolPath, imagePath);
        }
        else
        {
            metadataItems = SpecifyMetaDataTypes(GetMetadata(exifToolPath, imagePath));
        }

        // 写入元数据到txt文件
        string outputFile = @"C:\Users\yifan\Desktop\Trust-Indicator\src\EXIF_Logic\EXIF_TESTER\EXIF_TESTER\metadata.txt";
        WriteMetadataToFile(metadataItems, outputFile);

        Console.WriteLine($"Metadata written to: {outputFile}");
    }

    static bool UserOption()
    {
        Console.WriteLine("Enter your choice (yes/no): ");
        string userInput = Console.ReadLine().Trim().ToLower();

        if (userInput == "yes")
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    static List<MetadataItem> SpecifyMetaDataTypes(List<MetadataItem> lists)
    {
        List<MetadataItem> results = new List<MetadataItem>();
        List<string> indicatedTypes = GetUserDesiredMetadataTypes();
        if (indicatedTypes.Count == 0 || indicatedTypes == null)
            results = lists;
        else
        {
            foreach (var metadata in lists)
            {
                if (indicatedTypes.Contains(metadata.Type))
                {
                    results.Add(metadata);
                }
            }
        }
        return results;
    }

    static List<string> GetUserDesiredMetadataTypes()
    {
        Console.WriteLine("Please enter desired metadata types (comma separated, e.g. 'Make,Model,DateTime'): ");
        string userInput = Console.ReadLine();
        return new List<string>(userInput.Split(','));
    }

    static List<MetadataItem> GetMetadata(string exifToolPath, string imagePath)
    {
        ProcessStartInfo startInfo = new ProcessStartInfo
        {
            FileName = exifToolPath,
            Arguments = $"-j \"{imagePath}\"",
            RedirectStandardOutput = true,
            UseShellExecute = false,
            CreateNoWindow = true
        };

        List<MetadataItem> metadataItems = new List<MetadataItem>();

        using (Process process = new Process { StartInfo = startInfo })
        {
            process.Start();
            string output = process.StandardOutput.ReadToEnd();
            process.WaitForExit();

            var json = JArray.Parse(output);

            foreach (var item in json[0].Children<JProperty>())
            {
                metadataItems.Add(new MetadataItem
                {
                    Type = item.Name,
                    Value = item.Value.ToString()
                });
            }
        }
        return metadataItems;
    }

    static void WriteMetadataToFile(List<MetadataItem> metadataItems, string path)
    {
        using (StreamWriter sw = new StreamWriter(path))
        {
            foreach (var metadata in metadataItems)
            {
                sw.WriteLine($"Type: {metadata.Type}, Value: {metadata.Value}");
            }
        }
    }
}

public class MetadataItem
{
    public string Type { get; set; }
    public string Value { get; set; }
}

// Set up the process start info
/*// process 1
ProcessStartInfo psi = new ProcessStartInfo(exifToolPath, imagePath)
{
    RedirectStandardOutput = true,
    UseShellExecute = false,
    CreateNoWindow = true
};

// process 1
using (Process process = new Process { StartInfo = psi })
{
    process.Start();
    string output = process.StandardOutput.ReadToEnd();
    process.WaitForExit();

    // Output contains the EXIF metadata
    Console.WriteLine(output);
}*/

/*// Path to the ExifTool executable
        string exifToolPath = @"C:\Users\yifan\Desktop\EXIF Tool\exiftool.exe";

        // Path to the image file
        string imagePath = @"C:\Users\yifan\Desktop\拍摄底片\20230408_Canberra\0B89B3F8-EEA9-4219-8B18-EC1F079BC3BF-17677-00001F6120BE746A.jpg";
*/
